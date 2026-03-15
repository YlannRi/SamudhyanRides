import os
from dotenv import load_dotenv
load_dotenv(".env.dev")

from app.pathfinder.models import RouteRequest, Coordinate
from app.pathfinder.service import calculate_route

req = RouteRequest(coordinates=[
    Coordinate(longitude=-2.3871, latitude=51.3837), 
    Coordinate(longitude=-2.3811, latitude=51.3792)
])
res = calculate_route(req)
import json
print(json.dumps(res, indent=2))
#comit