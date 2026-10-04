import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

// Check the actual publish directory. Never print matched credential values.
export async function checkPagesArtifact(directory) {
  const root = resolve(directory);
  const files = [];
  async function walk(path) {
    for (const item of await readdir(path, { withFileTypes: true })) {
      const child = resolve(path, item.name);
      const name = relative(root, child);
      if (item.isSymbolicLink())
        throw new Error(`Symlink in artifact: ${name}`);
      if (
        /(^|\/)(vault|private-data|node_modules|\.env[^/]*|\.git|functions)(\/|$)/.test(
          name,
        )
      )
        throw new Error(`Private or unexpected artifact path: ${name}`);
      if (item.isDirectory()) await walk(child);
      else {
        if ((await stat(child)).size > 25 * 1024 * 1024)
          throw new Error(`Asset exceeds Pages size limit: ${name}`);
        if (name.endsWith(".map") || name === "_worker.js")
          throw new Error(`Unexpected server code or source map: ${name}`);
        files.push(name);
        if (
          [".js", ".css", ".html", ".json", ".webmanifest", ""].includes(
            extname(name),
          )
        ) {
          const text = await readFile(child, "utf8");
          if (
            /sb_secret_[\w-]{10,}|postgres(?:ql)?:\/\/|SUPABASE_DB_PASSWORD|__e2e\/|lightweight-e2e-build/.test(
              text,
            )
          )
            throw new Error(
              `Credential or test-only marker in artifact: ${name}`,
            );
          for (const jwt of text.matchAll(/eyJ[\w-]+\.([\w-]+)\.[\w-]+/g)) {
            try {
              if (
                JSON.parse(Buffer.from(jwt[1], "base64url").toString()).role ===
                "service_role"
              )
                throw new Error(`Privileged JWT in artifact: ${name}`);
            } catch (error) {
              if (error.message.startsWith("Privileged JWT")) throw error;
            }
          }
        }
      }
    }
  }
  await walk(root);
  for (const name of [
    "index.html",
    "manifest.webmanifest",
    "sw.js",
    "_headers",
  ])
    if (!files.includes(name)) throw new Error(`Missing PWA artifact: ${name}`);
  if (files.length > 20000) throw new Error("Too many assets for Pages upload");
  const headers = await readFile(resolve(root, "_headers"), "utf8");
  for (const policy of [
    "Content-Security-Policy:",
    "X-Content-Type-Options: nosniff",
    "frame-ancestors 'none'",
  ])
    if (!headers.includes(policy))
      throw new Error(`Missing security policy: ${policy}`);
  const manifest = JSON.parse(
    await readFile(resolve(root, "manifest.webmanifest"), "utf8"),
  );
  if (manifest.display !== "standalone" || manifest.start_url !== "/")
    throw new Error("Unexpected PWA origin or display configuration");
  return { files: files.length, directory: root, paths: files.sort() };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = await checkPagesArtifact(process.argv[2] ?? "dist");
  console.log(`Pages artifact passed: ${result.files} static files`);
}
