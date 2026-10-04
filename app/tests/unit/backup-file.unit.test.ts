import { expect, it } from "vitest";
import { serializeBackupFile } from "../../src/domain/backup-file";
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
    "분할 백업",
  );
});
it("직접 및 Dexie로 감싼 quota 오류를 사용자가 재시도할 수 있는 안내로 표시한다", () => {
  const cause = new DOMException("synthetic quota", "QuotaExceededError");
  expect(errorMessage(cause)).toContain("기존 기록은 유지");
  expect(errorMessage({ name: "BulkError", inner: cause })).toContain(
    "저장 공간",
  );
  expect(errorMessage(new Error("일반 실패"))).toBe("일반 실패");
});
