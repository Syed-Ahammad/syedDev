import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Disable motion across the suite so transforms don't shift click targets mid-animation.
    // The dedicated reveal test re-emulates reduce explicitly to keep the assertion self-documenting.
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    // Logs in as the demo user + admin and saves their session to
    // playwright/.auth/*.json for the authenticated specs to reuse.
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // The auth specs supply their own storageState per describe block, so the
      // default project state stays logged-out (public pages must render as a guest).
      testIgnore: /.*\.setup\.ts/,
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NODE_OPTIONS: "--max-old-space-size=4096",
    },
  },
});
