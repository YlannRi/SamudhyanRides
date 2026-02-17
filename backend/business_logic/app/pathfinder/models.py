
from pydantic import BaseModel
from typing import List

class Coordinate(BaseModel):
    longitude: float
    latitude: float

class RouteRequest(BaseModel):
    coordinates: List[Coordinate]