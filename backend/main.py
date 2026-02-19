from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import routing
from app.routers.accounts import users, drivers, rides, bookings, payments, ratings, incidents, auth
import uvicorn

app = FastAPI(title="Samudhyan Rides - Backend", version  = "1.0.1")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
#.include_router(payments.router, prefix="/payments", tags=["Payments"])
#app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(routing.router, prefix="/routing", tags=["Routing"])

app.include_router(users.router, prefix="/account/users", tags=["Accounts"])
app.include_router(auth.router, prefix="/account/auth", tags=["Accounts"])
app.include_router(drivers.router, prefix="/account/drivers", tags=["Accounts"])
app.include_router(rides.router, prefix="/account/rides", tags=["Accounts"])

# I need to test all the ones below here and make sure they all work

app.include_router(bookings.router, prefix="/account/booking", tags=["Accounts"])
app.include_router(payments.router, prefix="/account/payments", tags=["Accounts"])
app.include_router(ratings.router, prefix="/account/ratings", tags=["Accounts"])
app.include_router(incidents.router, prefix="/account/incidents", tags=["Accounts"])


@app.get("/")
def read_root():
    return {"status": "ok", "service": "backend"}

@app.get("/health")
def health():
    return {"status":"ready", "port":8000}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)