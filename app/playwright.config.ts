import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { origin } from "./tests/e2e/environment";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const runId = process.env.LIGHTWEIGHT_E2E_RUN_ID;
if (!runId || !/^[a-zA-Z0-9_-]+$/.test(runId))
  throw new Error(
    "Use npm run test:e2e so each execution preserves its own artifacts.",
  );
const output = resolve(appRoot, "../output/playwright/e2e", runId);
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch:
    process.env.LIGHTWEIGHT_E2E_PROBE === "1"
      ? "**/evidence.probe.ts"
      : "**/*.e2e.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 30000,
  expect: { timeout: 5000 },
  outputDir: resolve(output, "test-results"),
  preserveOutput: "always",
  reporter: [
    ["list"],
    ["json", { outputFile: resolve(output, "results.json") }],
    ["html", { outputFolder: resolve(output, "report"), open: "never" }],
  ],
  use: {
    baseURL: origin,
    viewport: { width: 390, height: 844 },
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium-mobile",
      use: { browserName: "chromium", serviceWorkers: "allow" },
    },
    {
      name: "webkit-mobile",
      use: { browserName: "webkit" },
      testIgnore: "**/pwa.e2e.spec.ts",
    },
  ],
  webServer: {
    command: "node scripts/e2e-server.mjs",
    cwd: appRoot,
    url: origin,
    reuseExistingServer: false,
    timeout: 60000,
    stdout: "pipe",
    stderr: "pipe",
    gracefulShutdown: { signal: "SIGTERM", timeout: 2000 },
    env: { VITE_SUPABASE_URL: "", VITE_SUPABASE_PUBLISHABLE_KEY: "" },
  },
});
