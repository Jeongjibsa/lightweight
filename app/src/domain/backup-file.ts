import type { Backup } from "./models";

export const MAX_BACKUP_FILE_BYTES = 10 * 1024 * 1024;
export function checkBackupFileSize(bytes: number) {
  if (bytes > MAX_BACKUP_FILE_BYTES)
    throw new Error("백업 파일은 10MiB 이하만 사용할 수 있습니다.");
}

// Keep every field; whitespace alone must not make a downloaded file unrestorable.
export function serializeBackupFile(backup: Backup) {
  const text = JSON.stringify(backup);
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_FILE_BYTES)
    throw new Error(
      "기록이 10MiB를 초과해 백업 파일을 만들 수 없습니다. 기존 기록은 유지됩니다. 큰 기록의 분할 백업은 아직 지원하지 않습니다.",
    );
  return text;
}
