from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import routing, users, drivers, rides, bookings, payments, ratings, incidents, auth, timetable, chat, notification
import uvicorn

app = FastAPI(title="Samudhyan Rides - Backend", version  = "1.0.1")

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