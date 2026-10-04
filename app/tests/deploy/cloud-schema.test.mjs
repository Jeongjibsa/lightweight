import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  cloudSchema,
  validatorSQL,
} from "../../scripts/generate-cloud-validator.mjs";
const current = JSON.parse(
  readFileSync(
    new URL("../../../supabase/schema/backup-v1.json", import.meta.url),
  ),
);
test("checked-in cloud schema follows the actual client record contract", () => {
  assert.deepEqual(current, cloudSchema());
  assert.equal(
    current.properties.profile.properties.restTimer.properties.favorites
      .uniqueItems,
    true,
  );
  assert.equal(
    current.properties.sessions.items.properties.note.maxLength,
    1000,
  );
  assert.equal(
    current.properties.sessions.items.properties.sets.items.properties
      .comparison.additionalProperties,
    false,
  );
});
test("optional-field migration retains owner/refinement checks and matches schema without changing grants", () => {
  const migration = readFileSync(
    new URL(
      "../../../supabase/migrations/20261004162726_training_optional_record_fields.sql",
      import.meta.url,
    ),
    "utf8",
  );
  assert.equal(migration, validatorSQL(current));
  assert.equal(migration.includes("grant "), false);
  assert.equal(migration.includes("security definer"), false);
});
