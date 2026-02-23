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

    results = []
    for f in response.json().get("features", []):
        coords = f["geometry"]["coordinates"]  # [lng, lat]
        results.append({
            "label": f["properties"].get("label", ""),
            "lng": coords[0],
            "lat": coords[1],
        })
    return results

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