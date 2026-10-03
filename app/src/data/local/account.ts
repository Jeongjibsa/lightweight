export function accountDatabaseName(id: string) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  )
    throw new Error("계정 ID 형식을 확인해주세요.");
  return `lightweight-account-${id.toLowerCase()}-v1`;
}
