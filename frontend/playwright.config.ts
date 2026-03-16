import { defineConfig } from "@playwright/test";

const baseURL = process.env.PW_BASE_URL || "http://localhost:5173";
const parsedBaseUrl = new URL(baseURL);
const isLocalBaseUrl = ["localhost", "127.0.0.1"].includes(parsedBaseUrl.hostname);

export default defineConfig({
  testDir: "./tests",
  retries: 0,
  use: {
    baseURL,
    headless: true,
  },
  webServer: isLocalBaseUrl
    ? {
        command: `npm run dev -- --host ${parsedBaseUrl.hostname || "localhost"} --port ${
          parsedBaseUrl.port ? Number(parsedBaseUrl.port) : 5173
        }`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
  // Optional: run locally in parallel
  fullyParallel: true,
});
