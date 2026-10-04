import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  readFile,
  mkdir,
  writeFile,
  realpath,
  readdir,
} from "node:fs/promises";
import { resolve, sep, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { catalog } from "../src/content/catalog.ts";

const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/);
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "Public source must be an HTTPS URL without credentials");
const payloadSchema = z.strictObject({
  exerciseId: id,
  version: id,
  claims: z
    .array(
      z.strictObject({
        id,
        kind: z.enum(["scientific", "biomechanical_inference", "user_fit"]),
        text: z.string().trim().min(1),
        limits: z.string().trim().min(1),
        sourceIds: z.array(id).min(1),
      }),
    )
    .min(1),
  sources: z
    .array(
      z.strictObject({
        id,
        url: httpsUrl,
        readScope: z.enum(["full_review", "partial", "abstract"]),
      }),
    )
    .min(1),
  assets: z.array(
    z.strictObject({
      path: z
        .string()
        .regex(/^\/content\/assets\/[a-zA-Z0-9_-]+\.(?:svg|png|webp|mp4|glb)$/),
      license: z.enum(["own", "licensed", "public_domain", "unknown"]),
      attribution: z.string().trim().min(1),
      rightsRef: id,
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
    }),
  ),
});
const reviewSchema = z.strictObject({
  status: z.literal("approved"),
  reviewerKind: z.literal("human"),
  reviewerId: id,
  expertise: z.enum(["exercise_science", "anatomy"]),
  reviewedAt: z.iso.datetime(),
  reviewRef: id,
  payloadSha256: z.string().regex(/^[a-f0-9]{64}$/),
});

export const contentDigest = (payload) =>
  createHash("sha256")
    .update(JSON.stringify(payloadSchema.parse(payload)))
    .digest("hex");

// Checks declarations and payload identity, not the scientific review itself.
export function compileRegistry(raw, knownIds = catalog.map((e) => e.id)) {
  const registry = z
    .strictObject({
      version: id,
      entries: z.array(
        z.strictObject({
          payload: z.unknown(),
          review: z.unknown(),
        }),
      ),
    })
    .parse(raw);
  const exercises = [];
  const seen = new Set();
  for (const entry of registry.entries) {
    if (entry.review?.status !== "approved") continue;
    const review = reviewSchema.parse(entry.review);
    const payload = payloadSchema.parse(entry.payload);
    assert(knownIds.includes(payload.exerciseId), "Unknown public exercise ID");
    assert(!seen.has(payload.exerciseId), "Duplicate public exercise ID");
    seen.add(payload.exerciseId);
    assert.equal(
      review.payloadSha256,
      contentDigest(payload),
      "Review receipt no longer matches content",
    );
    const sourceMap = new Map(payload.sources.map((s) => [s.id, s]));
    assert.equal(sourceMap.size, payload.sources.length, "Duplicate source ID");
    assert.equal(
      new Set(payload.claims.map((c) => c.id)).size,
      payload.claims.length,
      "Duplicate claim ID",
    );
    for (const claim of payload.claims) {
      for (const sourceId of claim.sourceIds) {
        const source = sourceMap.get(sourceId);
        assert(source, "Unknown claim source ID");
        assert.equal(
          source.readScope,
          "full_review",
          "Publication requires reviewed full source",
        );
      }
    }
    assert(
      payload.assets.every((a) => a.license !== "unknown"),
      "Asset rights review pending",
    );
    exercises.push({ ...payload, reviewVersion: review.reviewRef });
  }
  return { schemaVersion: 1, registryVersion: registry.version, exercises };
}

export async function checkPublishedAssets(compiled, publicDirectory) {
  const root = await realpath(publicDirectory);
  const approvedPaths = new Set();
  for (const guide of compiled.exercises) {
    for (const asset of guide.assets) {
      approvedPaths.add(asset.path.slice(1));
      const path = await realpath(resolve(root, asset.path.slice(1)));
      assert(path.startsWith(root + sep), "Asset escapes the public directory");
      const hash = createHash("sha256")
        .update(await readFile(path))
        .digest("hex");
      assert.equal(hash, asset.sha256, "Asset changed after review");
    }
  }
  async function checkFiles(directory) {
    let entries;
    try {
      const actual = await realpath(directory);
      assert(
        actual.startsWith(root + sep),
        "Asset directory escapes public files",
      );
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const item of entries) {
      const path = resolve(directory, item.name);
      if (item.isDirectory()) await checkFiles(path);
      else
        assert(
          approvedPaths.has(relative(root, path).split(sep).join("/")),
          "Unreviewed visual file would be published",
        );
    }
  }
  await checkFiles(resolve(root, "content/assets"));
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const raw = JSON.parse(
    await readFile(
      new URL("../content/review-registry.json", import.meta.url),
      "utf8",
    ),
  );
  const compiled = compileRegistry(raw);
  await checkPublishedAssets(compiled, new URL("../public/", import.meta.url));
  const directory = new URL("../public/content/", import.meta.url);
  await mkdir(directory, { recursive: true });
  const publicRoot = await realpath(new URL("../public/", import.meta.url));
  assert(
    (await realpath(directory)).startsWith(publicRoot + sep),
    "Content output escapes public files",
  );
  await writeFile(
    new URL("exercise-guides.json", directory),
    JSON.stringify(compiled, null, 2) + "\n",
  );
  console.log(
    `Content gate passed: ${compiled.exercises.length} reviewed exercise guides`,
  );
}
