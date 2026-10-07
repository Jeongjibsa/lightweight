import "fake-indexeddb/auto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TrainingDatabase, TrainingStore } from "./store";
import { uploadWorkspace, type CloudTransport } from "../cloud/sync";
import {
  checkSnapshot,
  type RemoteSnapshot,
  type Upload,
} from "../cloud/contracts";
import { catalog } from "../../content/catalog";

const owner = "00000000-0000-4000-8000-000000000001";
const databases: TrainingDatabase[] = [];
function device() {
  const db = new TrainingDatabase(`sync-recovery-${crypto.randomUUID()}`);
  databases.push(db);
  return { db, store: new TrainingStore(db) };
}
// Synthetic CAS/receipt server: no credentials, network, Auth or RLS simulation.
function server() {
  let current: RemoteSnapshot = {
    revision: 0,
    snapshot: null,
    updatedAt: null,
  };
  const receipts = new Map<string, { status: "saved"; revision: number }>();
  let commits = 0;
  const transport: CloudTransport = {
    async read(account) {
      expect(account).toBe(owner);
      return structuredClone(current);
    },
    async write(account, upload: Upload) {
      const snapshot = checkSnapshot(upload.snapshot, account);
      const receipt = receipts.get(upload.operationId);
      if (receipt) return receipt;
      if (current.revision !== upload.baseRevision)
        return { status: "conflict", revision: current.revision };
      current = {
        revision: current.revision + 1,
        snapshot: structuredClone(snapshot),
        updatedAt: new Date().toISOString(),
      };
      const result = { status: "saved" as const, revision: current.revision };
      receipts.set(upload.operationId, result);
      commits++;
      return result;
    },
  };
  return { transport, commits: () => commits };
}
async function state(db: TrainingDatabase) {
  return Promise.all(db.tables.map((table) => table.toArray()));
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-07T03:00:00Z"));
});
afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  await Promise.all(databases.splice(0).map((db) => db.delete()));
});

it("two device lost-response retry, edit conflict and explicit pull preserve recovery and reject a stale deletion rollback", async () => {
  const a = device();
  const b = device();
  const remote = server();
  await a.store.ensureProfile(owner);
  let session = await a.store.startSession(owner);
  session = await a.store.addExercise(owner, session.id, catalog[8]!);
  await a.store.updateSet(
    owner,
    session.id,
    session.sets[0]!.id,
    { load: 80, reps: 8 },
    true,
  );
  const ended = await a.store.endSession(owner, session.id);
  let lost = true;
  const unreliable: CloudTransport = {
    read: remote.transport.read,
    async write(account, upload) {
      const result = await remote.transport.write(account, upload);
      if (lost) {
        lost = false;
        throw new Error("synthetic lost response after commit");
      }
      return result;
    },
  };
  await expect(uploadWorkspace(a.store, unreliable, owner)).rejects.toThrow(
    "lost response",
  );
  const pending = (await a.store.cloudState(owner)).pending!;
  const old = await remote.transport.read(owner);
  await b.store.ensureProfile(owner);
  await b.store.applyDownload(owner, await b.store.previewDownload(owner, old));
  await b.store.deleteEndedSession(owner, ended.id, ended.revision);
  await uploadWorkspace(b.store, remote.transport, owner);
  expect(remote.commits()).toBe(2);
  await a.store.saveProfile(owner, {
    ...(await a.store.ensureProfile(owner)),
    name: "synthetic offline edit",
  });
  await uploadWorkspace(a.store, unreliable, owner);
  expect((await a.store.cloudState(owner)).baseRevision).toBe(1);
  expect(remote.commits()).toBe(2);
  expect(await a.db.outbox.count()).toBe(1);
  expect((await a.db.sessions.get(ended.id))?.deletedAt).toBeNull();
  await expect(
    uploadWorkspace(a.store, remote.transport, owner),
  ).rejects.toThrow("다른 기기");
  expect((await a.store.ensureProfile(owner)).name).toBe(
    "synthetic offline edit",
  );
  expect((await a.store.cloudState(owner)).pending?.operationId).not.toBe(
    pending.operationId,
  );
  await a.store.applyDownload(
    owner,
    await a.store.previewDownload(owner, await remote.transport.read(owner)),
  );
  expect((await a.db.sessions.get(ended.id))?.deletedAt).not.toBeNull();
  expect((await a.store.cloudState(owner)).recovery?.profile.name).toBe(
    "synthetic offline edit",
  );
  expect(
    (await a.store.cloudState(owner)).recovery?.sessions[0]?.deletedAt,
  ).toBeNull();
  expect(await a.db.outbox.count()).toBe(0);
  const before = await state(a.db);
  await expect(a.store.previewDownload(owner, old)).rejects.toThrow("오래된");
  expect(await state(a.db)).toEqual(before);
  expect((await a.store.cloudState(owner)).baseRevision).toBe(2);
});

it("apply independently checks the remote revision even if a preview response is replaced after confirmation", async () => {
  const a = device();
  const remote = server();
  await a.store.ensureProfile(owner);
  await uploadWorkspace(a.store, remote.transport, owner);
  const old = await remote.transport.read(owner);
  await a.store.saveProfile(owner, {
    ...(await a.store.ensureProfile(owner)),
    name: "synthetic revision two",
  });
  await uploadWorkspace(a.store, remote.transport, owner);
  const preview = await a.store.previewDownload(
    owner,
    await remote.transport.read(owner),
  );
  const before = await state(a.db);
  await expect(
    a.store.applyDownload(owner, { ...preview, remote: old }),
  ).rejects.toThrow("오래된");
  expect(await state(a.db)).toEqual(before);
});

it("equal-revision explicit pull remains possible and preserves local changes in the recovery snapshot", async () => {
  const a = device();
  const remote = server();
  await a.store.ensureProfile(owner);
  await uploadWorkspace(a.store, remote.transport, owner);
  await a.store.saveProfile(owner, {
    ...(await a.store.ensureProfile(owner)),
    name: "synthetic local draft",
  });
  const preview = await a.store.previewDownload(
    owner,
    await remote.transport.read(owner),
  );
  expect(preview.dirty).toBe(true);
  await a.store.applyDownload(owner, preview);
  expect((await a.store.cloudState(owner)).recovery?.profile.name).toBe(
    "synthetic local draft",
  );
  expect((await a.store.cloudState(owner)).baseRevision).toBe(1);
});
