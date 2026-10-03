import { z } from "zod";
import { backupSchema, type Backup } from "../../domain/models";

export const MAX_SNAPSHOT_BYTES = 10 * 1024 * 1024;
export const remoteSnapshotSchema = z
  .object({
    revision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
    snapshot: backupSchema.nullable(),
    updatedAt: z.iso.datetime({ offset: true }).nullable(),
  })
  .superRefine((value, ctx) => {
    if ((value.revision === 0) !== (value.snapshot === null))
      ctx.addIssue({
        code: "custom",
        message: "서버 버전과 기록이 일치하지 않습니다.",
      });
  });
export type RemoteSnapshot = z.infer<typeof remoteSnapshotSchema>;
export type Upload = {
  operationId: string;
  baseRevision: number;
  snapshot: Backup;
  queueIds: string[];
};
export type CloudState = {
  ownerId: string;
  baseRevision: number;
  lastSyncedAt: string | null;
  pending: Upload | null;
  recovery: Backup | null;
};
export type DownloadPreview = {
  remote: RemoteSnapshot;
  localSignature: string;
  dirty: boolean;
};

export function checkSnapshot(input: unknown, ownerId: string): Backup {
  const snapshot = backupSchema.parse(input);
  if (snapshot.profile.ownerId !== ownerId)
    throw new Error("다른 계정의 기록은 동기화할 수 없습니다.");
  if (
    new TextEncoder().encode(JSON.stringify(snapshot)).length >
    MAX_SNAPSHOT_BYTES
  )
    throw new Error(
      "클라우드 기록은 10MB 이하만 전송할 수 있습니다. JSON 백업으로 보관해주세요.",
    );
  return snapshot;
}
export function checkRemote(input: unknown, ownerId: string): RemoteSnapshot {
  const remote = remoteSnapshotSchema.parse(input);
  if (remote.snapshot) checkSnapshot(remote.snapshot, ownerId);
  return remote;
}
