from fastapi import APIRouter, Depends
from app.pathfinder.models import RouteRequest, Coordinate
from app.pathfinder.service import calculate_route

router = APIRouter(prefix="/routing", tags=["routing"])

@router.post('/calculate')
async def calculate_route_endpoint(request: RouteRequest):
    """Public endpoint - delegates to pathfinding service"""
    return calculate_route(request)

@router.get("/test-bath-route")
async def test_bath_route():
    """Test endpoint with Bath coordinates"""
    from app.pathfinder.models import Coordinate
    test_coordinates = [
        Coordinate(longitude=-2.387101467334169, latitude=51.38371431745675),
        Coordinate(longitude=-2.3811171364634256, latitude=51.3792711152603),
        Coordinate(longitude=-2.372466888509847, latitude=51.374778404087465),
        Coordinate(longitude=-2.3486067249777007, latitude=51.389974587447796),
        Coordinate(longitude=-2.3251408055843865, latitude=51.378561560319504),
    ]
    from app.pathfinder.models import RouteRequest
    route_request = RouteRequest(coordinates=test_coordinates)
    return calculate_route(route_request)