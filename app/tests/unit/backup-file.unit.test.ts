import { expect, it } from "vitest";
import {
  createBackupFile,
  readBackupFile,
  serializeBackupFile,
  MAX_EXPANDED_BACKUP_BYTES,
} from "../../src/domain/backup-file";
import { gzipSync, gunzipSync } from "node:zlib";
import { errorMessage } from "../../src/domain/errors";
import { largeBackupFixture } from "../fixtures/large-backup";
import { owner } from "../fixtures/training";

it("UTF-8 큰 파일을 compact JSON으로 손실 없이 만들고, 초과 파일은 잘라내지 않고 거부한다", () => {
  const fixture = largeBackupFixture(owner);
  expect(
    new TextEncoder().encode(JSON.stringify(fixture, null, 2)).byteLength,
  ).toBeGreaterThan(10485760);
  const text = serializeBackupFile(fixture);
  expect(new TextEncoder().encode(text).byteLength).toBeLessThanOrEqual(
    10485760,
  );
  expect(JSON.parse(text)).toEqual(fixture);
  expect(() => serializeBackupFile(largeBackupFixture(owner, 60))).toThrow(
    "압축 백업",
  );
});
it("10MiB 초과 기록을 실제 gzip으로 손실 없이 내보내고 확장자와 무관하게 복원한다", async () => {
  const fixture = largeBackupFixture(owner, 60);
  const file = await createBackupFile(fixture);
  expect(file.extension).toBe("json.gz");
  const bytes = new Uint8Array(await file.blob.arrayBuffer());
  expect(bytes.byteLength).toBeLessThan(10485760);
  expect(JSON.parse(gunzipSync(bytes).toString("utf8"))).toEqual(fixture);
  expect(await readBackupFile(new File([bytes], "unknown.bin"))).toEqual(
    fixture,
  );
}, 20000);
it("gzip 손상·잘림·팽창 한도를 schema/DB 적용 전에 거부한다", async () => {
  const valid = gzipSync(JSON.stringify(largeBackupFixture(owner, 1)));
  const corrupt = new Uint8Array(valid);
  corrupt[corrupt.length - 8] ^= 1;
  await expect(readBackupFile(new File([corrupt], "bad.gz"))).rejects.toThrow();
  await expect(
    readBackupFile(new File([valid.subarray(0, -5)], "cut.gz")),
  ).rejects.toThrow();
  const oversized = gzipSync(Buffer.alloc(MAX_EXPANDED_BACKUP_BYTES + 1, " "));
  await expect(
    readBackupFile(new File([oversized], "oversized.gz")),
  ).rejects.toThrow("용량 한도");
}, 20000);
it("직접 및 Dexie로 감싼 quota 오류를 사용자가 재시도할 수 있는 안내로 표시한다", () => {
  const cause = new DOMException("synthetic quota", "QuotaExceededError");
  expect(errorMessage(cause)).toContain("기존 기록은 유지");
  expect(errorMessage({ name: "BulkError", inner: cause })).toContain(
    "저장 공간",
  );
  expect(errorMessage(new Error("일반 실패"))).toBe("일반 실패");
});
