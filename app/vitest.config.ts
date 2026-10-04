import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "virtual:pwa-register/react": fileURLToPath(
        new URL("./tests/harness/pwa-register.ts", import.meta.url),
      ),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.unit.test.ts"],
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "ui",
          environment: "jsdom",
          execArgv: ["--no-experimental-webstorage"],
          include: ["tests/ui/**/*.ui.test.tsx"],
          setupFiles: ["tests/ui/setup.ts"],
        },
      },
    ],
  },
});
