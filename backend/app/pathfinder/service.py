import os
import requests
from fastapi import HTTPException
from .models import RouteRequest, Coordinate
from typing import List

def calculate_route(request: RouteRequest) -> dict:
    api_key = os.getenv("OPENROUTE_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found")
    
    coords = [[coord.longitude, coord.latitude] for coord in request.coordinates]
    
    url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json"
    }
    payload = {"coordinates": coords}
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    return response.json()

def geocode_address(q: str) -> list:
    api_key = os.getenv("OPENROUTE_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found")

    response = requests.get(
        "https://api.openrouteservice.org/geocode/search",
        params={"api_key": api_key, "text": q, "size": 5}
    )
    if not response.ok:
        raise HTTPException(status_code=502, detail=f"ORS geocode error: {response.text}")

    data = response.json()

    features = data.get("features", [])

    # check location exists
    if not features:
        raise HTTPException(status_code=404, detail="Location not found")

    valid_results = []
    # check location in UK
    for feature in features:
        props = feature["properties"]

        if props.get("country_a") != "GBR":
            continue

        coords = feature["geometry"]["coordinates"]

        valid_results.append({
            "label": props["label"],
            "lng": coords[0],
            "lat": coords[1],
        })

    if not valid_results:
        raise HTTPException(status_code=400, detail="Location must be in the United Kingdom")

    return valid_results


def _format_location_label(props: dict) -> str:
    house_number = props.get("housenumber")
    street = props.get("street")
    street_address = " ".join(part for part in [house_number, street] if part)
    primary = props.get("name") or street_address or props.get("label")
    locality = props.get("locality") or props.get("localadmin") or props.get("county")
    postcode = props.get("postalcode")

    parts = []
    for value in [primary, locality, postcode]:
        if value and value not in parts:
            parts.append(value)

    return ", ".join(parts) or "Selected map pickup"


def reverse_geocode(lat: float, lng: float) -> dict:
    api_key = os.getenv("OPENROUTE_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found")

    response = requests.get(
        "https://api.openrouteservice.org/geocode/reverse",
        params={"api_key": api_key, "point.lat": lat, "point.lon": lng, "size": 1}
    )
    if not response.ok:
        raise HTTPException(status_code=502, detail=f"ORS reverse geocode error: {response.text}")

    data = response.json()
    features = data.get("features", [])
    if not features:
        raise HTTPException(status_code=404, detail="Address not found")

    for feature in features:
        props = feature.get("properties", {})
        country = props.get("country_a")
        if country and country != "GBR":
            continue

        coords = feature.get("geometry", {}).get("coordinates", [lng, lat])
        return {
            "label": _format_location_label(props),
            "lng": coords[0],
            "lat": coords[1],
        }

    raise HTTPException(status_code=400, detail="Location must be in the United Kingdom")


def optimize_route(origin: Coordinate, destination: Coordinate, pickups: List[Coordinate]) -> List[Coordinate]:
    api_key = os.getenv("OPENROUTE_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found")

    payload = {
        "vehicles": [
            {
                "id": 1,
                "profile": "driving-car",
                "start": [origin.longitude, origin.latitude],
                "end": [destination.longitude, destination.latitude]
            }
        ],
        "jobs": [
            {"id": i + 1, "location": [p.longitude, p.latitude]}
            for i, p in enumerate(pickups)
        ]
    }

    response = requests.post(
        "https://api.openrouteservice.org/optimization",
        json=payload,
        headers={"Authorization": api_key, "Content-Type": "application/json"}
    )
    if not response.ok:
        raise HTTPException(status_code=502, detail=f"ORS optimize error: {response.text}")

    # Extract the ordered waypoints from the optimised steps
    steps = response.json()["routes"][0]["steps"]
    return [
        Coordinate(longitude=step["location"][0], latitude=step["location"][1])
        for step in steps
        if step["type"] in ("start", "job", "end")
    ]
