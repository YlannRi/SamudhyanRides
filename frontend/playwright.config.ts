import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  retries: 0,
  use: {
    baseURL: process.env.PW_BASE_URL || "http://localhost:5173",
    headless: true,
  },
  webServer: (() => {
    const baseURL = process.env.PW_BASE_URL || 'http://localhost:5173';
    const url = new URL(baseURL);
    const host = url.hostname || 'localhost';
    const port = url.port ? Number(url.port) : 5173;

    return {
      command: `npm run dev -- --host ${host} --port ${port}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    };
  })(),
  // Optional: run locally in parallel
  fullyParallel: true,
});