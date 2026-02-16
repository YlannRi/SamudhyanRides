from fastapi import APIRouter
from pydantic import BaseModel
import os 
from dotenv import load_dotenv
import requests
from fastapi import HTTPException
from typing import List


router = APIRouter(prefix="/routing", tags=["routing"])
load_dotenv()
# @router.get("/hello")
# async def hello():
#     return {"message": "routing module working"}


class Coordinate(BaseModel):
    longitude: float
    latitude: float

class RouteRequest(BaseModel):
    coordinates: List[Coordinate]


@router.post('/calculate')
async def calculate_route(request: RouteRequest):

    api_key = os.getenv("OPENROUTE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found")

    
    
    coords = [[coord.longitude, coord.latitude] for coord in request.coordinates]

    url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"

    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "coordinates": coords
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status() 
    
    return response.json()


@router.get("/test-bath-route")
async def test_bath_route():
    # hardcoded for now
    test_coordinates = [
        Coordinate(longitude=-2.387101467334169, latitude=51.38371431745675), #theo
        Coordinate(longitude=-2.3811171364634256, latitude=51.3792711152603),  #oldfield park train station,
        Coordinate(longitude=-2.372466888509847, latitude=51.374778404087465), #junction road / oldfield road
        Coordinate(longitude=-2.3486067249777007, latitude=51.389974587447796),  #rockcliffe avenue / bathwick
        Coordinate(longitude=-2.3251408055843865, latitude=51.378561560319504),  # uni
    ]
    
    route_request = RouteRequest(coordinates=test_coordinates)
    return await calculate_route(route_request)


    # return {
    #     "status": "received",
    #     "num_points": len(request.coordinates),
    #     "coordinates": [
    #         [coord.longitude, coord.latitude] 
    #         for coord in request.coordinates
    #     ]
    # }