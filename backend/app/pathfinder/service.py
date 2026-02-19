import os
import requests
from fastapi import HTTPException
from .models import RouteRequest

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