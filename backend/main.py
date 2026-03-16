import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import routing, users, drivers, rides, bookings, payments, ratings, incidents, auth, timetable, chat, notification
import uvicorn
#comit
app = FastAPI(title="Samudhyan Rides - Backend", version="1.0.1")

origins = [
    "https://app.samudhyanrides.com",
    "https://samudhyanrides.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io",
]


extra_origins_raw = os.getenv("CORS_EXTRA_ORIGINS", "")
extra_origins = [origin.strip() for origin in extra_origins_raw.split(",") if origin.strip()]
allowed_origins = [*origins, *extra_origins]

# Allow all Vercel deployments for this project family, including preview and branch URLs.
vercel_preview_origin_regex = r"^https://samudhyanrides-[a-z0-9-]+\.vercel\.app$"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=vercel_preview_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routing.router)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(drivers.router)
app.include_router(rides.router)

app.include_router(timetable.router)

app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(ratings.router)
app.include_router(incidents.router)
app.include_router(chat.router)
app.include_router(notification.router)

@app.get("/")
def read_root():
    return {"status": "ok", "service": "backend"}

@app.get("/health")
def health():
    return {"status":"ready", "port":8000}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
