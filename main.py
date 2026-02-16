from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from me import router as me_router
from routing import router as routing_router

app = FastAPI(title="SamudhyanRides Backend")

# Configure CORS
origins = [
    "http://localhost:3000",  # React app
    "http://localhost:5173",  # Vite app (alternative)
    "*",  # Allow all for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(me_router)
app.include_router(routing_router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running!"}
