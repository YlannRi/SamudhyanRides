# Samudhyan Rides Backend 

## Requirements

To run the backend locally, download and install:

- **Docker Desktop**  
  https://www.docker.com/products/docker-desktop/

Ensure Docker Desktop is running before starting the backend.

---

## During Development

The codebase follows a modular structure:
```
business_logic/
└── app/
├── main.py
├── routers/
├── pathfinder/
└── ...
```


### When new libraries are required
When you use libraries that had to be installed, please add them to `requirements.txt` 

This will mean that it will be installed automatically for everyone whenever a container is rebuilt


### Structure Overview

**`main.py`**

- FastAPI application entry point  
- Registers and combines all routers  
- Starts the server on **localhost:8000**  
- Responsible for exposing the API


**`routers/`**

- Contains FastAPI route definitions  
- Handles HTTP requests and responses  
- Returns JSON data to the frontend or API clients

Example:

- `routers/routing.py`

**`pathfinder/`**

- Contains routing and path computation logic  
- Implements the mathematical / algorithmic components  
- Pure business logic, independent of FastAPI

For more implementation details, refer to Josh's code:

- `routers/routing.py`
- `app/pathfinder`

---

## Testing & Running the Backend

### 1️⃣ Start Docker Desktop

Before running the backend, ensure **Docker Desktop is running**.

### 2️⃣ Build & Run the Container

From main repo, execute:

`docker compose up --build`

### 3️⃣ Health Check

Verify that the backend is running correctly

`curl http://localhost:8000/health` 

Alternatively, within the terminal, You will see health checks being performed

### 4️⃣ Interactive API Documentation

FastAPI provides an interactive docs via your browser at:

[http://localhost:8000/docs](https://localhost:8000/docs)

Which allows to view all endpoints, send test requests and inspect responses
