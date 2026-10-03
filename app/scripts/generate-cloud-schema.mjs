import { writeFileSync } from "node:fs";
import { z } from "zod";
import { backupSchema } from "../src/domain/models.ts";
// JSON Schema covers structure. Cross-field refinements are checked by the SQL validator.
const schema = z.toJSONSchema(backupSchema, {
  unrepresentable: "any",
  target: "draft-7",
});
writeFileSync(
  new URL("../../supabase/schema/backup-v1.json", import.meta.url),
  `${JSON.stringify(schema, null, 2)}\n`,
);
