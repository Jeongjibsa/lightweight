import { databaseClient } from "./db-client.mjs";
const id = process.argv[2];
if (
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id ?? "",
  )
)
  throw new Error(
    "Pass the UUID of an explicitly approved, existing Auth user",
  );
const client = databaseClient();
try {
  await client.connect();
  const result = await client.query(
    "insert into training_private.members(user_id) select id from auth.users where id=$1 on conflict(user_id) do update set enabled=true returning enabled",
    [id],
  );
  if (!result.rowCount)
    throw new Error("No existing Auth user matches this UUID");
  console.log(JSON.stringify({ registeredAccountAllowed: true }));
} catch (error) {
  console.error(
    JSON.stringify({
      registeredAccountAllowed: false,
      errorCode: error.code ?? error.name,
    }),
  );
  process.exitCode = 1;
} finally {
  await client.end();
}
