import { describe, expect, it } from "vitest";
import { publicConfig } from "../../src/data/cloud/config";
import { accountDatabaseName } from "../../src/data/local/account";
import { checkRemote, checkSnapshot } from "../../src/data/cloud/contracts";
const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const key = "sb_publishable_synthetic_test_key_123456";
const snapshot = {
  format: "lightweight-backup",
  version: 1,
  exportedAt: "2026-10-03T16:00:00.000Z",
  profile: {
    ownerId: owner,
    name: "가짜",
    preferences: null,
    unit: "kg",
    timeZone: "Asia/Seoul",
    revision: 1,
    updatedAt: "2026-10-03T16:00:00.000Z",
  },
  routines: [],
  sessions: [],
};
describe("브라우저 설정·계정·서버 응답 경계", () => {
  it("설정이 없는 앱은 로컬 모드를 유지한다", () => {
    expect(publicConfig()).toBeNull();
    expect(publicConfig("https://example.supabase.co", "")).toBeNull();
  });
  it("Publishable key와 HTTPS origin만 허용한다", () => {
    expect(publicConfig(" https://example.supabase.co/ ", ` ${key} `)).toEqual({
      url: "https://example.supabase.co",
      key,
    });
    for (const bad of ["sb_secret_synthetic", "service_role", "eyJlegacy"])
      expect(() => publicConfig("https://example.supabase.co", bad)).toThrow();
    for (const url of [
      "http://example.supabase.co",
      "https://user:pass@example.supabase.co",
      "https://example.supabase.co/extra",
      "https://example.supabase.co/?token=synthetic",
      "https://example.supabase.co/#token",
    ])
      expect(() => publicConfig(url, key)).toThrow();
  });
  it("계정 ID를 검증하고 대소문자를 정규화하며 저장소를 분리한다", () => {
    expect(accountDatabaseName(owner)).not.toBe(accountDatabaseName(other));
    expect(accountDatabaseName("AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA")).toBe(
      accountDatabaseName("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"),
    );
    expect(() => accountDatabaseName("../../another-account")).toThrow();
  });
  it("다른 계정의 응답과 버전/기록 불일치를 거부한다", () => {
    expect(() => checkSnapshot(snapshot, other)).toThrow("다른 계정");
    expect(() =>
      checkRemote({ revision: 0, snapshot, updatedAt: null }, owner),
    ).toThrow();
    expect(() =>
      checkRemote({ revision: 1, snapshot: null, updatedAt: null }, owner),
    ).toThrow();
    expect(
      checkRemote({ revision: 0, snapshot: null, updatedAt: null }, owner)
        .revision,
    ).toBe(0);
  });
});
