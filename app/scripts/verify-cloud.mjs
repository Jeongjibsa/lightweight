import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { databaseClient } from "./db-client.mjs";
const client = databaseClient();
const a = randomUUID(),
  b = randomUUID(),
  c = randomUUID();
const at = "2026-10-03T16:00:00.000Z";
const snapshot = {
  format: "lightweight-backup",
  version: 1,
  exportedAt: at,
  profile: {
    ownerId: a,
    name: "Synthetic fixture",
    preferences: null,
    unit: "kg",
    timeZone: "Asia/Seoul",
    revision: 1,
    updatedAt: at,
  },
  routines: [],
  sessions: [],
};
const checks = [];
async function role(name, id, anonymous = false) {
  await client.query("reset role");
  await client.query("select set_config('request.jwt.claims',$1,true)", [
    JSON.stringify({ sub: id, role: name, is_anonymous: anonymous }),
  ]);
  await client.query(`set local role ${name}`);
}
async function denied(label, query, values, code) {
  await client.query("savepoint expected_failure");
  try {
    await client.query(query, values);
    assert.fail(label);
  } catch (error) {
    assert.equal(error.code, code, label);
  } finally {
    await client.query("rollback to savepoint expected_failure");
  }
  checks.push(label);
}
const read = "select public.training_snapshot_read() as result";
const write =
  "select public.training_snapshot_write($1,$2,$3::jsonb) as result";
try {
  await client.connect();
  await client.query("begin");
  if (process.argv.includes("--preflight")) {
    await client.query(
      readFileSync(
        new URL(
          "../../supabase/migrations/20261003162808_training_cloud.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
  }
  // Fixtures never commit. No credentials or emails are created.
  await client.query("insert into auth.users(id) values($1),($2),($3)", [
    a,
    b,
    c,
  ]);
  await client.query(
    "insert into training_private.members(user_id) values($1),($2)",
    [a, b],
  );
  await role("authenticated", a);
  assert.equal((await client.query(read)).rows[0].result.revision, 0);
  checks.push("empty account");
  const op = randomUUID();
  assert.deepEqual(
    (await client.query(write, [op, 0, JSON.stringify(snapshot)])).rows[0]
      .result,
    { status: "saved", revision: 1 },
  );
  checks.push("owned snapshot write");
  assert.deepEqual(
    (await client.query(write, [op, 0, JSON.stringify(snapshot)])).rows[0]
      .result,
    { status: "saved", revision: 1 },
  );
  checks.push("idempotent retry");
  await denied(
    "operation payload mismatch",
    write,
    [
      op,
      0,
      JSON.stringify({
        ...snapshot,
        profile: { ...snapshot.profile, name: "Different fixture" },
      }),
    ],
    "22023",
  );
  assert.deepEqual(
    (await client.query(write, [randomUUID(), 0, JSON.stringify(snapshot)]))
      .rows[0].result,
    { status: "conflict", revision: 1 },
  );
  checks.push("stale revision conflict");
  await denied(
    "foreign owner rejected",
    write,
    [
      randomUUID(),
      1,
      JSON.stringify({
        ...snapshot,
        profile: { ...snapshot.profile, ownerId: b },
      }),
    ],
    "22023",
  );
  await denied(
    "malformed snapshot rejected",
    write,
    [randomUUID(), 1, "{}"],
    "22023",
  );
  await denied(
    "invalid preferences rejected",
    write,
    [
      randomUUID(),
      1,
      JSON.stringify({
        ...snapshot,
        profile: {
          ...snapshot.profile,
          preferences: {
            goal: "hypertrophy",
            customGoal: "",
            weeklyMin: 5,
            weeklyMax: 3,
            split: "full_body",
            customSplit: "",
            minutes: null,
            equipment: [],
          },
        },
      }),
    ],
    "22023",
  );
  await denied(
    "private table access blocked",
    "select * from training_private.workspaces",
    [],
    "42501",
  );
  // Exercise the deployed optional fields through the same owned RPC.
  // These fixtures and authorization changes are rolled back below.
  const exercise = {
    id: "fixture-barbell-press",
    name: "Synthetic press",
    group: "어깨",
    subgroup: "전면",
    aliases: ["Synthetic alias"],
    equipment: "바벨",
    loadMode: "total",
    review: "catalog_draft",
  };
  const routine = {
    id: randomUUID(),
    ownerId: a,
    revision: 1,
    updatedAt: at,
    deletedAt: null,
    name: "Synthetic routine",
    exercises: [{ exercise, sets: 1 }],
    preferencesSnapshot: null,
  };
  const details = {
    ...snapshot,
    profile: {
      ...snapshot.profile,
      restTimer: { seconds: 60, favorites: [60, 90, 120, 180] },
    },
    routines: [routine],
    sessions: [
      {
        id: randomUUID(),
        ownerId: a,
        revision: 1,
        updatedAt: at,
        deletedAt: null,
        name: "Synthetic workout",
        note: "Synthetic record note",
        localDate: "2026-10-04",
        timeZone: "Asia/Seoul",
        startedAt: at,
        endedAt: at,
        status: "complete",
        routineSnapshot: structuredClone(routine),
        preferencesSnapshot: null,
        sets: [
          {
            id: randomUUID(),
            exercise,
            order: 0,
            unit: "kg",
            load: 20,
            reps: 8,
            seconds: null,
            kind: "working",
            side: "both",
            rir: null,
            comparison: {
              equipmentLabel: "Synthetic machine A",
              rangeOfMotion: "Synthetic range",
            },
            completedAt: at,
          },
        ],
      },
    ],
  };
  const invalidDetails = [
    ["unknown field rejected", (value) => (value.unexpected = true)],
    [
      "duplicate rest favorites rejected",
      (value) => (value.profile.restTimer.favorites = [60, 60, 120]),
    ],
    [
      "oversized note rejected",
      (value) => (value.sessions[0].note = "x".repeat(1001)),
    ],
    [
      "oversized equipment label rejected",
      (value) =>
        (value.sessions[0].sets[0].comparison.equipmentLabel = "x".repeat(81)),
    ],
    [
      "oversized range label rejected",
      (value) =>
        (value.sessions[0].sets[0].comparison.rangeOfMotion = "x".repeat(81)),
    ],
    [
      "duplicate set ID rejected",
      (value) => value.sessions[0].sets.push(value.sessions[0].sets[0]),
    ],
    [
      "foreign routine snapshot rejected",
      (value) => (value.sessions[0].routineSnapshot.ownerId = b),
    ],
    [
      "completed set without repetitions rejected",
      (value) => (value.sessions[0].sets[0].reps = null),
    ],
    [
      "workout end before start rejected",
      (value) => (value.sessions[0].endedAt = "2026-10-03T15:00:00.000Z"),
    ],
  ];
  for (const [label, mutate] of invalidDetails) {
    const value = structuredClone(details);
    mutate(value);
    await denied(
      label,
      write,
      [randomUUID(), 1, JSON.stringify(value)],
      "22023",
    );
  }
  const detailsOperation = randomUUID();
  assert.deepEqual(
    (await client.query(write, [detailsOperation, 1, JSON.stringify(details)]))
      .rows[0].result,
    { status: "saved", revision: 2 },
  );
  checks.push("owned optional fields snapshot write");
  const roundtrip = (await client.query(read)).rows[0].result;
  assert.equal(roundtrip.revision, 2);
  assert.deepEqual(roundtrip.snapshot, details);
  checks.push("optional fields roundtrip preserved");
  assert.deepEqual(
    (await client.query(write, [detailsOperation, 1, JSON.stringify(details)]))
      .rows[0].result,
    { status: "saved", revision: 2 },
  );
  checks.push("optional fields idempotent retry");
  await role("authenticated", b);
  assert.equal((await client.query(read)).rows[0].result.snapshot, null);
  checks.push("account B cannot read A");
  await role("authenticated", c);
  await denied("uninvited account blocked", read, [], "42501");
  await role("authenticated", a, true);
  await denied("anonymous auth user blocked", read, [], "42501");
  await role("anon", a);
  await denied("anon RPC execution blocked", read, [], "42501");
  // Independently test RLS with a temporary SELECT grant inside this rollback.
  await client.query("reset role");
  await client.query(
    "grant select on training_private.workspaces to authenticated",
  );
  await role("authenticated", a);
  assert.equal(
    (
      await client.query(
        "select count(*)::int as n from training_private.workspaces",
      )
    ).rows[0].n,
    1,
  );
  checks.push("RLS own row visible");
  await role("authenticated", b);
  assert.equal(
    (
      await client.query(
        "select count(*)::int as n from training_private.workspaces",
      )
    ).rows[0].n,
    0,
  );
  checks.push("RLS foreign row hidden");
  await client.query("reset role");
  await client.query(
    "update training_private.members set enabled=false where user_id=$1",
    [a],
  );
  await role("authenticated", a);
  await denied("revoked member blocked", read, [], "42501");
  const result = {
    suite: "remote SQL authorization and snapshot contract",
    preflight: process.argv.includes("--preflight"),
    checks: checks.length,
    passed: checks,
    fixtureData: "synthetic only",
    transaction: "rolled back",
  };
  await client.query("rollback");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(
    JSON.stringify({
      suite: "cloud contract",
      status: "failed",
      code: error.code ?? error.name,
      message:
        error.name === "AssertionError"
          ? error.message
          : "Database contract check failed (details omitted)",
    }),
  );
  process.exitCode = 1;
} finally {
  try {
    await client.query("rollback");
  } catch {}
  await client.end();
}
