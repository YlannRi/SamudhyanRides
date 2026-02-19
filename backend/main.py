from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import routing
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


@app.get("/")
def read_root():
    return {"status": "ok", "service": "backend"}

@app.get("/health")
def health():
    return {"status":"ready", "port":8000}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)