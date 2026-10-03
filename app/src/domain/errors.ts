export function errorMessage(error: unknown) {
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
