# Samudhyan Rides Backend 

## Requirements

To run the backend locally, download and install:

- **Docker Desktop**  
  https://www.docker.com/products/docker-desktop/

---

## Testing & Running the Backend

### 1️⃣ Start Docker Desktop

Before running the backend, ensure **Docker Desktop is running**.

### 2️⃣ Build & Run the Container

From main repo, execute:

`docker compose up --build`

### 3️⃣ Health Check

Verify that the backend is running correctly

`curl https://localhost:8000/health` 

Alternatively, within the terminal, You will see health checks being performed

### 4️⃣ Interactive API Documentation

FastAPI provides an interactive docs via your browser at:

[https://localhost:8000/docs](https://localhost:8000/docs)

Which allows to view all endpoints, send test requests and inspect responses

## Testing & Running the Frontend

### 1️⃣ open a different terminal window within your code editor, so its '.../SamudhyanRides/frontend'. Don't close other terminal.

'cd ...\SamudhyanRides\frontend'

### 2️⃣ execute the following command:

`npm run dev` - may require `npm install` beforehand to install dependencies

### 3️⃣ Access the frontend

[http://localhost:5173](http://localhost:5173)

## Database Tests

The repo now includes pgTAP database tests under `supabase/tests/*.sql`.

### 1ï¸âƒ£ Start Docker Desktop

Supabase local development uses Docker. Make sure Docker Desktop is running first.

### 2ï¸âƒ£ Install root dependencies

From the repo root:

`npm ci`

### 3ï¸âƒ£ Start the local Supabase stack

`npm run db:start`

### 4ï¸âƒ£ Reset the local database to the checked-in schema

`npm run db:reset`

The local schema lives in `supabase/migrations/` and currently mirrors `database.sql`.

### 5ï¸âƒ£ Run pgTAP

`npm run db:test`
