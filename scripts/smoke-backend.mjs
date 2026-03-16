const baseUrl = process.env.SMOKE_BACKEND_URL;

if (!baseUrl) {
  console.error("SMOKE_BACKEND_URL is required");
  process.exit(1);
}

const healthUrl = new URL("/health", baseUrl).toString();
const response = await fetch(healthUrl, {
  headers: {
    accept: "application/json",
  },
});

if (!response.ok) {
  console.error(`Health check failed for ${healthUrl}: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const payload = await response.json().catch(() => null);

if (!payload || payload.status !== "ready") {
  console.error(`Unexpected health response from ${healthUrl}: ${JSON.stringify(payload)}`);
  process.exit(1);
}

console.log(`Backend health check passed for ${healthUrl}`);
