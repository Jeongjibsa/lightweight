import "fake-indexeddb/auto";
import Dexie from "dexie";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { TrainingDatabase, TrainingStore } from "./store";
import { accountDatabaseName } from "./account";
import { uploadWorkspace, type CloudTransport } from "../cloud/sync";
import type { RemoteSnapshot } from "../cloud/contracts";

const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
let db: TrainingDatabase;
let store: TrainingStore;
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-03T16:00:00Z"));
  db = new TrainingDatabase(`cloud-test-${crypto.randomUUID()}`);
  store = new TrainingStore(db);
  const profile = await store.ensureProfile(owner);
  await store.saveProfile(owner, { ...profile, name: "가짜 기기" });
});
afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  await db.delete();
});
async function remote(): Promise<RemoteSnapshot> {
  return {
    revision: 4,
    snapshot: {
      ...(await store.backup(owner)),
      profile: { ...(await store.ensureProfile(owner)), name: "가짜 서버" },
    },
    updatedAt: "2026-10-03T16:00:00+00:00",
  };
}
describe("동기화와 기기 보존 계약", () => {
  it("전송 중 새 변경은 ACK가 삭제하지 않는다", async () => {
    const upload = await store.prepareUpload(owner);
    await store.saveProfile(owner, {
      ...(await store.ensureProfile(owner)),
      name: "전송 후 변경",
    });
    await store.acknowledgeUpload(owner, upload.operationId, 1);
    expect((await db.outbox.toArray()).map((x) => x.payload)).toHaveLength(1);
    expect((await store.ensureProfile(owner)).name).toBe("전송 후 변경");
    expect((await store.cloudState(owner)).baseRevision).toBe(1);
  });
  it("응답 유실 후 재시도는 같은 operation과 payload를 사용한다", async () => {
    const write = vi
      .fn<CloudTransport["write"]>()
      .mockRejectedValueOnce(new Error("가짜 응답 유실"))
      .mockResolvedValue({ status: "saved", revision: 1 });
    const transport: CloudTransport = { read: vi.fn(), write };
    await expect(uploadWorkspace(store, transport, owner)).rejects.toThrow(
      "유실",
    );
    const first = structuredClone(write.mock.calls[0]![1]);
    await store.saveProfile(owner, {
      ...(await store.ensureProfile(owner)),
      name: "재시도 전 변경",
    });
    await uploadWorkspace(store, transport, owner);
    expect(write.mock.calls[1]![1]).toEqual(first);
    expect(await db.outbox.count()).toBe(1);
  });
  it("CAS 충돌과 잘못된 ACK는 대기 작업과 기기 기록을 보존한다", async () => {
    const transport: CloudTransport = {
      read: vi.fn(),
      write: vi.fn().mockResolvedValue({ status: "conflict", revision: 9 }),
    };
    await expect(uploadWorkspace(store, transport, owner)).rejects.toThrow(
      "다른 기기",
    );
    const pending = (await store.cloudState(owner)).pending!;
    await expect(
      store.acknowledgeUpload(owner, pending.operationId, 2),
    ).rejects.toThrow("버전");
    expect(await db.outbox.count()).toBe(1);
    expect((await store.cloudState(owner)).pending?.operationId).toBe(
      pending.operationId,
    );
  });
  it("불러오기 확인 중 기기 기록이 바뀌면 교체하지 않는다", async () => {
    const preview = await store.previewDownload(owner, await remote());
    await store.saveProfile(owner, {
      ...(await store.ensureProfile(owner)),
      name: "확인 중 변경",
    });
    await expect(store.applyDownload(owner, preview)).rejects.toThrow(
      "바뀌었습니다",
    );
    expect((await store.ensureProfile(owner)).name).toBe("확인 중 변경");
    expect(await db.outbox.count()).toBe(2);
  });
  it("명시적 교체는 기존 기록을 회수용 스냅샷으로 보존하고 ACK 버전을 적용한다", async () => {
    const preview = await store.previewDownload(owner, await remote());
    expect(preview.dirty).toBe(true);
    await store.applyDownload(owner, preview);
    expect((await store.ensureProfile(owner)).name).toBe("가짜 서버");
    expect((await store.cloudState(owner)).recovery?.profile.name).toBe(
      "가짜 기기",
    );
    expect((await store.cloudState(owner)).baseRevision).toBe(4);
    expect(await db.outbox.count()).toBe(0);
  });
  it("잘못된 계정의 불러오기는 저장소에 반영하지 않는다", async () => {
    await expect(store.previewDownload(other, await remote())).rejects.toThrow(
      "다른 계정",
    );
    expect((await store.ensureProfile(owner)).name).toBe("가짜 기기");
  });
  it("진행 중인 운동은 전송과 불러오기 교체를 막는다", async () => {
    const preview = await store.previewDownload(owner, await remote());
    await store.startSession(owner);
    await expect(store.prepareUpload(owner)).rejects.toThrow("진행 중");
    const current = await store.previewDownload(owner, preview.remote);
    await expect(store.applyDownload(owner, current)).rejects.toThrow(
      "진행 중",
    );
  });
  it("불러오기 저장 실패는 기록·outbox·동기화 상태를 함께 롤백한다", async () => {
    const preview = await store.previewDownload(owner, await remote());
    vi.spyOn(db.cloud, "put").mockRejectedValueOnce(
      new Error("가짜 디스크 오류"),
    );
    await expect(store.applyDownload(owner, preview)).rejects.toThrow("디스크");
    expect((await store.ensureProfile(owner)).name).toBe("가짜 기기");
    expect(await db.outbox.count()).toBe(1);
    expect((await store.cloudState(owner)).baseRevision).toBe(0);
  });
  it("schema 1 기록과 outbox를 schema 2로 업그레이드해도 보존한다", async () => {
    const name = `migration-test-${crypto.randomUUID()}`;
    const legacy = new Dexie(name);
    legacy.version(1).stores({
      profiles: "ownerId",
      routines: "id, ownerId, updatedAt",
      sessions: "id, ownerId, localDate, updatedAt",
      outbox: "id, ownerId, entityId, createdAt",
    });
    await legacy.table("profiles").put(await store.ensureProfile(owner));
    await legacy.table("outbox").bulkPut(await db.outbox.toArray());
    legacy.close();
    const upgraded = new TrainingDatabase(name);
    try {
      expect((await upgraded.profiles.get(owner))?.name).toBe("가짜 기기");
      expect(await upgraded.outbox.count()).toBe(1);
      expect(await upgraded.cloud.count()).toBe(0);
      expect(upgraded.verno).toBe(2);
    } finally {
      await upgraded.delete();
    }
  });
  it("로그인 계정의 물리 저장소는 서로 분리된다", async () => {
    const a = new TrainingDatabase(accountDatabaseName(owner));
    const b = new TrainingDatabase(accountDatabaseName(other));
    try {
      await new TrainingStore(a).ensureProfile(owner);
      expect(await b.profiles.count()).toBe(0);
      expect(await b.outbox.count()).toBe(0);
    } finally {
      await a.delete();
      await b.delete();
    }
  });
});
