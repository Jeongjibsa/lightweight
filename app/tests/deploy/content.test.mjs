import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  contentDigest,
  compileRegistry,
  checkPublishedAssets,
} from "../../scripts/compile-reviewed-content.mjs";

// Synthetic declaration only, never added to the real publication registry.
function entry() {
  const payload = {
    exerciseId: "squat",
    version: "synthetic-v1",
    claims: [
      {
        id: "claim-1",
        kind: "biomechanical_inference",
        text: "Synthetic fixture",
        limits: "Not production guidance",
        sourceIds: ["SRC-test"],
      },
    ],
    sources: [
      {
        id: "SRC-test",
        url: "https://example.invalid/review",
        readScope: "full_review",
      },
    ],
    assets: [],
  };
  return {
    payload,
    review: {
      status: "approved",
      reviewerKind: "human",
      reviewerId: "synthetic-reviewer",
      expertise: "anatomy",
      reviewedAt: "2026-10-04T00:00:00Z",
      reviewRef: "REV-test",
      payloadSha256: contentDigest(payload),
    },
  };
}
const registry = (...entries) => ({ version: "synthetic-v1", entries });

test("draft and held content are omitted, review identity is not exposed", () => {
  const approved = entry();
  const result = compileRegistry(
    registry(
      { payload: { privateDraft: "not public" }, review: { status: "draft" } },
      approved,
    ),
  );
  assert.equal(result.exercises.length, 1);
  assert(!JSON.stringify(result).includes("synthetic-reviewer"));
  assert(!JSON.stringify(result).includes("privateDraft"));
});
test("agent approval and changed approved text fail the publication gate", () => {
  const agent = entry();
  agent.review.reviewerKind = "agent";
  assert.throws(() => compileRegistry(registry(agent)));
  const changed = entry();
  changed.payload.claims[0].text = "Changed after review";
  assert.throws(() => compileRegistry(registry(changed)), /no longer matches/);
});
test("abstract-only sources, pending rights and broken source references are rejected", () => {
  for (const change of [
    (p) => {
      p.sources[0].readScope = "abstract";
    },
    (p) => {
      p.claims[0].sourceIds = ["missing"];
    },
    (p) => {
      p.assets = [
        {
          path: "/content/assets/synthetic.png",
          license: "unknown",
          attribution: "Synthetic",
          rightsRef: "RIGHT-test",
          sha256: "0".repeat(64),
        },
      ];
    },
  ]) {
    const e = entry();
    change(e.payload);
    e.review.payloadSha256 = contentDigest(e.payload);
    assert.throws(() => compileRegistry(registry(e)));
  }
});
test("duplicate or unknown public exercise identities cannot replace guides", () => {
  assert.throws(
    () => compileRegistry(registry(entry(), entry())),
    /Duplicate public/,
  );
  assert.throws(() => compileRegistry(registry(entry()), []), /Unknown public/);
});

test("changed visual files and symlinks outside public files fail before export", async () => {
  const directory = await mkdtemp(join(tmpdir(), "lightweight-content-check-"));
  const publicDirectory = join(directory, "public");
  const assets = join(publicDirectory, "content/assets");
  try {
    await mkdir(assets, { recursive: true });
    const reviewedBytes = Buffer.from("synthetic visual");
    const hash = createHash("sha256").update(reviewedBytes).digest("hex");
    const e = entry();
    e.payload.assets = [
      {
        path: "/content/assets/synthetic.png",
        license: "own",
        attribution: "Synthetic fixture",
        rightsRef: "RIGHT-test",
        sha256: hash,
      },
    ];
    e.review.payloadSha256 = contentDigest(e.payload);
    const compiled = compileRegistry(registry(e));
    const file = join(assets, "synthetic.png");
    await writeFile(file, reviewedBytes);
    await checkPublishedAssets(compiled, publicDirectory);
    const orphan = join(assets, "unreviewed.png");
    await writeFile(orphan, "unreviewed fixture");
    await assert.rejects(
      checkPublishedAssets(compiled, publicDirectory),
      /Unreviewed visual file/,
    );
    await rm(orphan);
    await writeFile(file, "changed visual");
    await assert.rejects(
      checkPublishedAssets(compiled, publicDirectory),
      /changed after review/,
    );
    await rm(file);
    const outside = join(directory, "outside-fixture.png");
    await writeFile(outside, reviewedBytes);
    await symlink(outside, file);
    await assert.rejects(
      checkPublishedAssets(compiled, publicDirectory),
      /escapes the public/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
