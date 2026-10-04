import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.LIGHTWEIGHT_E2E_PORT ?? 4188);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("Invalid E2E port");
const env = {
  ...process.env,
  VITE_SUPABASE_URL: "",
  VITE_SUPABASE_PUBLISHABLE_KEY: "",
};
let child;
let stopping = false;
const run = (args) =>
  new Promise((done, reject) => {
    child = spawn(
      process.execPath,
      [resolve(appRoot, "node_modules/vite/bin/vite.js"), ...args],
      { cwd: appRoot, stdio: "inherit", env },
    );
    child.once("error", reject);
    child.once("exit", (code, signal) =>
      code === 0 || stopping
        ? done()
        : reject(new Error(`E2E Vite process exited: ${code ?? signal}`)),
    );
  });
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => {
    stopping = true;
    child?.kill(signal);
  });
await run(["build", "--outDir", "dist-e2e", "--emptyOutDir"]);
if (!stopping)
  await run([
    "preview",
    "--outDir",
    "dist-e2e",
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--strictPort",
  ]);
