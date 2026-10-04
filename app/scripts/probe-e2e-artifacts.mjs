import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const runId = `probe-${randomUUID()}`;
const child = spawn(
  process.execPath,
  [resolve(appRoot, "scripts/run-e2e.mjs"), "--project=chromium-mobile"],
  {
    cwd: appRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      LIGHTWEIGHT_E2E_RUN_ID: runId,
      LIGHTWEIGHT_E2E_PROBE: "1",
    },
  },
);
const exit = await new Promise((done, reject) => {
  child.once("exit", done);
  child.once("error", reject);
});
if (exit !== 1)
  throw new Error(`Probe must fail exactly once, got exit ${exit}`);
const output = resolve(appRoot, "../output/playwright/e2e", runId);
const result = JSON.parse(
  await readFile(resolve(output, "results.json"), "utf8"),
);
if (
  result.stats.unexpected !== 1 ||
  result.stats.flaky !== 0 ||
  result.stats.expected !== 0
)
  throw new Error("Failure result was not preserved");
const specs = result.suites.flatMap((suite) => suite.specs);
const failure = specs[0]?.tests[0]?.results[0];
if (
  specs.length !== 1 ||
  specs[0].title !== "HAR-05 intentional failure artifact probe" ||
  failure?.status !== "failed" ||
  failure.retry !== 0 ||
  !failure.error?.message.includes("의도적인 하네스 실패 표본")
)
  throw new Error("The expected first-failure assertion was not preserved");
async function walk(path) {
  const files = [];
  for (const file of await readdir(path, { withFileTypes: true })) {
    const target = resolve(path, file.name);
    if (file.isDirectory()) files.push(...(await walk(target)));
    else files.push(target);
  }
  return files;
}
const files = await walk(output);
for (const name of [
  "trace.zip",
  "test-failed-1.png",
  "execution.json",
  "console.json",
  "index.html",
])
  if (!files.some((file) => file.includes(name)))
    throw new Error(`Missing failure artifact: ${name}`);
const execution = JSON.parse(
  await readFile(
    files.find((file) => file.endsWith("/execution.json")),
    "utf8",
  ),
);
if (execution.runId !== runId || execution.retry !== 0)
  throw new Error("Failure execution metadata does not match this probe");
console.log(
  `HAR-05 probe verified: deliberate exit1 + first-failure trace/screenshot/console/metadata/report; ${runId}`,
);
