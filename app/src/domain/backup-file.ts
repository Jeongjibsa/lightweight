import { backupSchema, type Backup } from "./models";

export const MAX_BACKUP_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_EXPANDED_BACKUP_BYTES = 64 * 1024 * 1024;
export function checkBackupFileSize(bytes: number) {
  if (bytes > MAX_BACKUP_FILE_BYTES)
    throw new Error("백업 파일은 10MiB 이하만 사용할 수 있습니다.");
}

// Keep every field; whitespace alone must not make a downloaded file unrestorable.
export function serializeBackupFile(backup: Backup) {
  const text = JSON.stringify(backup);
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_FILE_BYTES)
    throw new Error(
      "기록이 10MiB를 초과했습니다. 큰 기록은 압축 백업으로 보관해주세요.",
    );
  return text;
}

function byteStream(bytes: Uint8Array<ArrayBuffer>) {
  return new ReadableStream<Uint8Array<ArrayBuffer>>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
}

async function boundedBytes(stream: ReadableStream<Uint8Array>, limit: number) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new Error(
          "백업 용량 한도를 초과했습니다. 기존 기록은 유지됩니다.",
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

export async function createBackupFile(backup: Backup) {
  const bytes = new TextEncoder().encode(JSON.stringify(backup));
  if (bytes.byteLength <= MAX_BACKUP_FILE_BYTES)
    return {
      blob: new Blob([bytes], { type: "application/json" }),
      extension: "json",
    };
  if (bytes.byteLength > MAX_EXPANDED_BACKUP_BYTES)
    throw new Error(
      "기록이 64MiB를 초과해 백업하지 못했습니다. 기존 기록은 유지됩니다.",
    );
  if (typeof CompressionStream === "undefined")
    throw new Error(
      "이 브라우저는 큰 기록의 압축 백업을 지원하지 않습니다. 최신 브라우저에서 다시 시도해주세요. 기존 기록은 유지됩니다.",
    );
  const compressed = await boundedBytes(
    byteStream(bytes).pipeThrough(new CompressionStream("gzip")),
    MAX_BACKUP_FILE_BYTES,
  );
  return {
    blob: new Blob([compressed], { type: "application/gzip" }),
    extension: "json.gz",
  };
}

// Inspect bytes rather than trusting a filename or MIME type. Gzip checksum and
// trailer validation are provided by DecompressionStream, before schema/DB work.
export async function readBackupFile(file: File): Promise<Backup> {
  checkBackupFileSize(file.size);
  const prefix = new Uint8Array(await file.slice(0, 2).arrayBuffer());
  if (prefix[0] !== 0x1f || prefix[1] !== 0x8b) {
    const text = await file.text();
    checkBackupFileSize(new TextEncoder().encode(text).byteLength);
    return backupSchema.parse(JSON.parse(text));
  }
  if (typeof DecompressionStream === "undefined")
    throw new Error(
      "이 브라우저는 압축 백업을 읽을 수 없습니다. 최신 브라우저에서 다시 선택해주세요.",
    );
  const expanded = await boundedBytes(
    byteStream(new Uint8Array(await file.arrayBuffer())).pipeThrough(
      new DecompressionStream("gzip"),
    ),
    MAX_EXPANDED_BACKUP_BYTES,
  );
  const text = new TextDecoder("utf-8", { fatal: true }).decode(expanded);
  return backupSchema.parse(JSON.parse(text));
}
