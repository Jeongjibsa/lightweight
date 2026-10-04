import { writeFileSync } from "node:fs";
import { cloudSchema } from "./generate-cloud-validator.mjs";
writeFileSync(
  new URL("../../supabase/schema/backup-v1.json", import.meta.url),
  `${JSON.stringify(cloudSchema(), null, 2)}\n`,
);
