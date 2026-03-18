import { defineConfig } from "@playwright/test";

const defaultLocalPort = 4173;
const baseURL = process.env.PW_BASE_URL || `http://localhost:${defaultLocalPort}`;
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
          parsedBaseUrl.port ? Number(parsedBaseUrl.port) : defaultLocalPort
        }`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
  // Optional: run locally in parallel
  fullyParallel: true,
});
