export function errorMessage(error: unknown) {
  let cause = error;
  for (
    let depth = 0;
    depth < 5 && cause && typeof cause === "object";
    depth++
  ) {
    if ("name" in cause && cause.name === "QuotaExceededError")
      return "이 기기의 저장 공간이 부족해 저장하지 못했습니다. 기존 기록은 유지됩니다. 공간을 확보한 뒤 다시 시도해주세요.";
    cause =
      "inner" in cause ? cause.inner : "cause" in cause ? cause.cause : null;
  }
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray(error.issues)
  )
    return error.issues
      .map((issue: { message: string }) => issue.message)
      .slice(0, 2)
      .join(" ");
  return error instanceof Error
    ? error.message
    : "저장하지 못했습니다. 다시 시도해주세요.";
}
