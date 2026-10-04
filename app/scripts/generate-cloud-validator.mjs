import { readFileSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { backupSchema } from "../src/domain/models.ts";
export function cloudSchema() {
  const schema = z.toJSONSchema(backupSchema, {
    unrepresentable: "any",
    target: "draft-7",
  });
  // z.refine is not represented in JSON Schema. Preserve the rest favorite contract explicitly.
  schema.properties.profile.properties.restTimer.properties.favorites.uniqueItems = true;
  return schema;
}
export function validatorSQL(schema) {
  const initial = readFileSync(
    new URL(
      "../../supabase/migrations/20261003162808_training_cloud.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const validator = initial.match(
    /create function training_private\.valid_snapshot\(.*?\$\$;/s,
  )?.[0];
  if (!validator) throw new Error("Initial validator not found");
  return (
    "-- Optional record fields; retain ownership/cross-field checks and all existing grants/RLS.\n" +
    validator
      .replace("create function", "create or replace function")
      .replace(
        /\$schema\$.*?\$schema\$/s,
        () => `$schema$${JSON.stringify(schema)}$schema$`,
      ) +
    "\n"
  );
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const schema = cloudSchema();
  writeFileSync(
    new URL("../../supabase/schema/backup-v1.json", import.meta.url),
    JSON.stringify(schema, null, 2) + "\n",
  );
  const path = process.argv[2];
  if (!path || !path.endsWith("_training_optional_record_fields.sql"))
    throw new Error("Provide the CLI-created optional-field migration path");
  writeFileSync(path, validatorSQL(schema));
  console.log("Cloud schema/validator generated; original migration retained.");
}
