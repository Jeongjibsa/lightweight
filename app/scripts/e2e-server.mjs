import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve, extname, sep } from "node:path";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.LIGHTWEIGHT_E2E_PORT ?? 4188);
const runId = process.env.LIGHTWEIGHT_E2E_RUN_ID;
if (!Number.isInteger(port) || port < 1024 || port > 65535 || !runId)
  throw new Error("Invalid E2E environment");
let child;
let server;
let stopping = false;
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => {
    stopping = true;
    child?.kill(signal);
    server?.close();
    server?.closeAllConnections();
  });
// Fresh CI checkouts do not contain the ignored generated public JSON.
// Run the same publication gate as the production build before either SW build.
await new Promise((done, reject) => {
  child = spawn(
    process.execPath,
    [resolve(appRoot, "scripts/compile-reviewed-content.mjs")],
    {
      cwd: appRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        VITE_SUPABASE_URL: "",
        VITE_SUPABASE_PUBLISHABLE_KEY: "",
      },
    },
  );
  child.once("error", reject);
  child.once("exit", (code, signal) =>
    code === 0 || stopping
      ? done()
      : reject(new Error(`E2E content compilation exited: ${code ?? signal}`)),
  );
});
for (const build of ["v1", "v2"]) {
  if (stopping) break;
  await new Promise((done, reject) => {
    child = spawn(
      process.execPath,
      [
        resolve(appRoot, "node_modules/vite/bin/vite.js"),
        "build",
        "--config",
        "scripts/e2e-vite.config.mjs",
        "--outDir",
        `dist-e2e/${build}`,
        "--emptyOutDir",
      ],
      {
        cwd: appRoot,
        stdio: "inherit",
        env: {
          ...process.env,
          VITE_SUPABASE_URL: "",
          VITE_SUPABASE_PUBLISHABLE_KEY: "",
          LIGHTWEIGHT_E2E_BUILD_ID: build,
        },
      },
    );
    child.once("error", reject);
    child.once("exit", (code, signal) =>
      code === 0 || stopping
        ? done()
        : reject(new Error(`E2E build exited: ${code ?? signal}`)),
    );
  });
}
if (!stopping) {
  const headers = Object.fromEntries(
    (await readFile(resolve(appRoot, "public/_headers"), "utf8"))
      .split("\n")
      .flatMap((line) => {
        const match = line.match(/^\s+([^:]+):\s*(.+)$/);
        return match ? [[match[1], match[2]]] : [];
      }),
  );
  const mime = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".webmanifest": "application/manifest+json",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".svg": "image/svg+xml",
  };
  let selected = "v1";
  server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(
        new URL(req.url, `http://127.0.0.1:${port}`).pathname,
      );
      if (path === "/__e2e/build") {
        const requested = req.headers["x-e2e-build"];
        if (
          req.method !== "POST" ||
          req.headers["x-e2e-run"] !== runId ||
          !["v1", "v2"].includes(requested)
        ) {
          res.writeHead(403);
          res.end();
          return;
        }
        selected = requested;
        res.writeHead(204);
        res.end();
        return;
      }
      if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405);
        res.end();
        return;
      }
      if (path === "/__e2e/blank") {
        res.writeHead(200, {
          ...headers,
          "Content-Type": "text/html",
          "Cache-Control": "no-store",
        });
        res.end("<!doctype html><title>Synthetic IndexedDB fixture</title>");
        return;
      }
      const root = resolve(appRoot, `dist-e2e/${selected}`);
      const file = resolve(root, `.${path === "/" ? "/index.html" : path}`);
      if (!file.startsWith(root + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const data = await readFile(file);
      res.writeHead(200, {
        ...headers,
        "Content-Type": mime[extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch (error) {
      res.writeHead(error?.code === "ENOENT" ? 404 : 500);
      res.end();
    }
  });
  server.listen(port, "127.0.0.1");
}
