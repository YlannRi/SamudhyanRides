from fastapi import APIRouter, HTTPException, Query
from app.pathfinder.models import RouteRequest, Coordinate
from app.pathfinder.service import calculate_route, geocode_address, optimize_route
from app.accounts.database import supabase

router = APIRouter(prefix="/routing", tags=["routing"])

@router.post('/calculate')
async def calculate_route_endpoint(request: RouteRequest):
    """Public endpoint - delegates to pathfinding service"""
    return calculate_route(request)

@router.get("/test-bath-route")
async def test_bath_route():
    """Test endpoint with Bath coordinates"""
    test_coordinates = [
        Coordinate(longitude=-2.387101467334169, latitude=51.38371431745675),
        Coordinate(longitude=-2.3811171364634256, latitude=51.3792711152603),
        Coordinate(longitude=-2.372466888509847, latitude=51.374778404087465),
        Coordinate(longitude=-2.3486067249777007, latitude=51.389974587447796),
        Coordinate(longitude=-2.3251408055843865, latitude=51.378561560319504),
    ]
    route_request = RouteRequest(coordinates=test_coordinates)
    return calculate_route(route_request)


# geocode address search
@router.get("/geocode")
async def geocode_address_endpoint(q: str = Query(..., description="Address or place name")):
    return geocode_address(q)

# get ORS GeoJSON route for a ride
@router.get("/ride/{ride_id}")
async def get_ride_route(ride_id: str):
    """
    Returns an ORS GeoJSON route for the ride.
    Phase 2: Includes all confirmed booking pickups, optimized for the best path.
    """
    # 1. Fetch the ride
    result = supabase.table("rides").select(
        "origin_lat, origin_lng, destination_lat, destination_lng, departure_time"
    ).eq("id", ride_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Ride not found")

    ride = result.data[0]
    
    # Check for missing coords
    origin = Coordinate(longitude=ride["origin_lng"], latitude=ride["origin_lat"]) if ride["origin_lng"] and ride["origin_lat"] else None
    destination = Coordinate(longitude=ride["destination_lng"], latitude=ride["destination_lat"]) if ride["destination_lng"] and ride["destination_lat"] else None
    
    if not origin or not destination:
        raise HTTPException(status_code=422, detail="Ride missing coordinate fields.")

    # 2. Fetch confirmed bookings for this ride
    bookings_res = supabase.table("bookings").select(
        "id, pickup_lat, pickup_lng"
    ).eq("ride_id", ride_id).eq("status", "confirmed").execute()

    pickups = []
    coord_to_bookings = {}
    for b in bookings_res.data:
        if b["pickup_lat"] and b["pickup_lng"]:
            coord = (b["pickup_lng"], b["pickup_lat"])
            if coord not in coord_to_bookings:
                coord_to_bookings[coord] = []
            coord_to_bookings[coord].append(b["id"])
            pickups.append(Coordinate(longitude=b["pickup_lng"], latitude=b["pickup_lat"]))

    # 3. Determine the waypoints
    if pickups:
        # Use ORS /optimize to find the best order for multiple pickups
        ordered_waypoints = optimize_route(origin, destination, pickups)
    else:
        # Just start -> end
        ordered_waypoints = [origin, destination]

    # 4. Calculate final GeoJSON route
    route_json = calculate_route(RouteRequest(coordinates=ordered_waypoints))

    # 5. Calculate estimated times
    from datetime import datetime, timedelta
    
    departure_time_str = ride.get("departure_time")
    arrival_time = None
    if departure_time_str:
        # Handle 'Z' suffix since fromisoformat doesn't always support it nicely across python versions, though 3.11+ does
        departure_time_str = departure_time_str.replace("Z", "+00:00")
        try:
            arrival_time = datetime.fromisoformat(departure_time_str)
        except ValueError:
            pass
            
    times = {
        "driver_leave": None,
        "arrival": ride.get("departure_time"),
        "pickups": []
    }
    
    if arrival_time and "features" in route_json and len(route_json["features"]) > 0:
        properties = route_json["features"][0].get("properties", {})
        summary = properties.get("summary", {})
        total_duration_sec = summary.get("duration", 0)
        
        driver_leave = arrival_time - timedelta(seconds=total_duration_sec)
        times["driver_leave"] = driver_leave.isoformat()
        
        segments = properties.get("segments", [])
        current_time = driver_leave
        
        # Iterate through segments up to the second to last segment (since the last segment is the destination)
        for i in range(len(segments) - 1):
            segment_duration = segments[i].get("duration", 0)
            current_time += timedelta(seconds=segment_duration)
            
            # The waypoint reached at the end of this segment is ordered_waypoints[i+1]
            wp = ordered_waypoints[i+1]
            
            # Find matching bookings by coordinate
            coord_key = (wp.longitude, wp.latitude)
            booking_ids = coord_to_bookings.get(coord_key, [])
            
            times["pickups"].append({
                "lat": wp.latitude,
                "lng": wp.longitude,
                "estimated_time": current_time.isoformat(),
                "booking_ids": booking_ids
            })

    return {
        "route": route_json,
        "times": times
    }