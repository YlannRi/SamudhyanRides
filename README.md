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

## Frontend E2E Tests

The repo also includes a small Playwright end-to-end suite for stable user journeys against mocked API responses.

From `frontend`, run:

`npm run test:e2e`

The first-pass E2E coverage includes:

- logging in and logging out through the app shell
- driver account sign-up routing into the driver application form
- adding a trusted contact from Safety check-up

### GitHub Actions

There is also a manual and reusable workflow at `.github/workflows/post-deploy-smoke.yml`.
Use it after deployment, or call it from a future deployment workflow once deployment is automated in GitHub Actions.

## Security Gates

The repo now includes a basic security baseline in GitHub Actions.

CI gates now cover:

- secret scanning with `gitleaks`
- backend dependency vulnerability scanning with `pip-audit`
- root and frontend dependency vulnerability scanning with `npm audit`

There is also a separate CodeQL workflow for static security analysis of:

- Python backend code
- JavaScript / TypeScript frontend code

Dependency update automation is configured in `.github/dependabot.yml` for:

- GitHub Actions
- root `npm`
- `frontend` `npm`
- `backend` `pip`

## API Contract Checks

The repo now includes API contract checks to make sure the backend OpenAPI document and a few key runtime responses stay aligned with what the frontend expects.

CI now runs an `api-contracts` job that:

- validates the generated FastAPI OpenAPI document
- runs focused contract tests against the real FastAPI app using `TestClient`
- uploads the generated OpenAPI document as a workflow artifact

The current contract coverage includes:

- `/`
- `/health`
- `/auth/register`
- `/auth/login`
- `/auth/refresh`
- `/notifications/`
- `/notifications/unread-count`

## Performance Testing

The repo now includes a backend performance harness under `backend/perf/`.

It records these metrics:

- response time
- throughput
- concurrency
- memory usage

### Local setup

Install the performance-only dependencies:

`npm run perf:backend:install`

### Run against a local Docker backend

If your backend is running via `docker compose up`, the runner can sample memory from the `samudhyan_backend` container automatically:

`npm run perf:backend -- --host http://127.0.0.1:8000 --users 20 --spawn-rate 5 --run-time 30s`

### Run against a local Python process

If you start the backend directly with Uvicorn, pass its PID so memory usage is sampled from the process instead of Docker:

`python backend/perf/run_suite.py --host http://127.0.0.1:8000 --users 20 --spawn-rate 5 --run-time 30s --pid <backend-pid>`

### Run a longer soak test

To catch leaks or gradual degradation, run the matrix harness with a longer soak duration:

`npm run perf:backend:soak`

That runs:

- a `15m` soak scenario
- a `50` user stepped-load scenario
- a `100` user stepped-load scenario

If you want a shorter soak:

`npm run perf:backend:matrix -- --soak-duration 5m --step-users 50,100`

### Increase load gradually

Use the matrix harness to ramp users and identify where latency or failures begin:

`npm run perf:backend:matrix -- --step-users 50,100`

You can change the ramp points as needed:

`npm run perf:backend:matrix -- --step-users 25,50,75,100,125`

### Ramp until failure threshold

If you want the runner to keep increasing concurrency until failure rate exceeds a threshold, use:

`npm run perf:backend:ramp`

By default this runs:

- start at `25` users
- add `25` users per stage
- cap at `200` users
- run each stage for `2m`
- stop when failure rate exceeds `1%`

You can override any of that:

`python backend/perf/run_ramp.py --start-users 50 --step-users 50 --max-users 300 --run-time 5m --failure-rate-threshold-pct 2`

### Output

The suite writes artifacts to `backend/perf/results/`:

- `backend_perf_summary.json`
- `backend_perf_summary.md`
- `backend_perf.html`
- Locust CSV stats/history files
- stdout/stderr logs

The matrix runner also writes:

- `backend_perf_matrix_summary.json`
- `backend_perf_matrix_summary.md`

These aggregate the soak and stepped-load scenarios and highlight the first scenario where failures appear or p95 latency doubles relative to the baseline.

The ramp runner writes:

- `backend_perf_ramp_summary.json`
- `backend_perf_ramp_summary.md`

These show every stage that ran and the first user level where failure rate crossed the configured threshold.

### Thresholds

You can turn the suite into a gate by passing optional thresholds:

`python backend/perf/run_suite.py --max-p95-ms 500 --min-rps 25 --max-failure-rate-pct 1 --max-peak-memory-mb 300`

### GitHub Actions

There is also a manual workflow at `.github/workflows/performance.yml`.
It starts the backend on GitHub Actions, runs the performance suite, and uploads the generated reports as artifacts.

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
