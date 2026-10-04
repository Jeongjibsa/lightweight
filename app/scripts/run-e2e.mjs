import { spawn, execFileSync } from "node:child_process";
import { randomUUID, createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const runId =
  process.env.LIGHTWEIGHT_E2E_RUN_ID ??
  `${new Date().toISOString().replace(/[^0-9A-Za-z]/g, "")}-${randomUUID().slice(0, 8)}`;
if (!/^[a-zA-Z0-9_-]+$/.test(runId)) throw new Error("Invalid E2E run ID");
mkdirSync(resolve(appRoot, "../output/playwright/e2e"), { recursive: true });
// An existing execution ID must never silently overwrite first-failure evidence.
const output = resolve(appRoot, "../output/playwright/e2e", runId);
mkdirSync(output);
const sourceFiles = {};
function fingerprint(path) {
  for (const item of readdirSync(resolve(appRoot, path), {
    withFileTypes: true,
  })) {
    const relative = `${path}/${item.name}`;
    if (item.isDirectory()) fingerprint(relative);
    else if (item.isFile())
      sourceFiles[relative] = createHash("sha256")
        .update(readFileSync(resolve(appRoot, relative)))
        .digest("hex");
  }
}
for (const path of ["src", "tests", "scripts"]) fingerprint(path);
for (const path of [
  "package.json",
  "package-lock.json",
  "playwright.config.ts",
  "vite.config.ts",
  "vitest.config.ts",
  "tsconfig.e2e.json",
  "index.html",
])
  sourceFiles[path] = createHash("sha256")
    .update(readFileSync(resolve(appRoot, path)))
    .digest("hex");
const codeFingerprint = createHash("sha256")
  .update(JSON.stringify(Object.entries(sourceFiles).sort()))
  .digest("hex");
writeFileSync(
  resolve(output, "environment.json"),
  JSON.stringify(
    {
      runId,
      gitRevision: execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: appRoot,
        encoding: "utf8",
      }).trim(),
      workingTreeDirty: !!execFileSync(
        "git",
        ["status", "--porcelain", "--untracked-files=no"],
        { cwd: appRoot, encoding: "utf8" },
      ).trim(),
      codeFingerprint,
      sourceFiles,
      node: process.version,
      startedAt: new Date().toISOString(),
      credentials:
        "Supabase VITE environment overridden empty; env files excluded from fingerprint",
    },
    null,
    2,
  ),
);
console.log(`E2E artifacts: output/playwright/e2e/${runId}`);
const child = spawn(
  process.execPath,
  [
    resolve(appRoot, "node_modules/@playwright/test/cli.js"),
    "test",
    ...process.argv.slice(2),
  ],
  {
    cwd: appRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      LIGHTWEIGHT_E2E_RUN_ID: runId,
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_PUBLISHABLE_KEY: "",
    },
  },
);
child.once("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
process.once("SIGINT", () => child.kill("SIGINT"));
process.once("SIGTERM", () => child.kill("SIGTERM"));
