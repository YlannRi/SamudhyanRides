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

## Smoke Tests

Use the smoke layer after deployment to verify that the live system is still reachable.

### Backend

Set `SMOKE_BACKEND_URL` to the deployed backend origin and run:

`npm run smoke:backend`

This checks `GET /health` and expects a JSON response with `"status": "ready"`.

### Frontend

From `frontend`, point Playwright at the deployed frontend and run:

`$env:PW_BASE_URL="https://samudhyanrides.vercel.app"; npm run test:smoke`

The smoke suite checks:

- the root route loads
- the login route renders its form

### GitHub Actions

There is also a manual and reusable workflow at `.github/workflows/post-deploy-smoke.yml`.
Use it after deployment, or call it from a future deployment workflow once deployment is automated in GitHub Actions.

## Deploy Pipeline

Backend deployment is now wired through GitHub Actions in `.github/workflows/deploy-backend.yml`.

- On pushes to `main`, it waits for the `CI` workflow to finish successfully, then deploys `backend/` to Azure Container Apps.
- It runs the smoke workflow immediately after deployment.
- You can also trigger it manually with `workflow_dispatch`.

Frontend production smoke is wired to Vercel's real deployment pipeline in `.github/workflows/frontend-production-smoke.yml`.

- It listens for Vercel `repository_dispatch` events of type `vercel.deployment.success`.
- It only runs smoke tests when Vercel reports the deployment environment as `production`.

### GitHub configuration

Set these GitHub repository or environment variables for the backend deploy workflow:

- `AZURE_ACR_NAME`
- `AZURE_CONTAINER_APP_NAME`
- `AZURE_RESOURCE_GROUP`
- `PRODUCTION_FRONTEND_URL` (optional if you keep `https://samudhyanrides.vercel.app`)
- `PRODUCTION_BACKEND_URL` (optional if you keep `https://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io`)

Set this GitHub secret for backend deployment:

- `AZURE_CREDENTIALS`

For the Vercel-triggered smoke workflow, make sure the Vercel project is connected to this GitHub repository so `repository_dispatch` deployment events are delivered to GitHub Actions.
