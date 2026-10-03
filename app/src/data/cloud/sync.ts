import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TrainingStore } from "../local/store";
import { checkRemote, type RemoteSnapshot, type Upload } from "./contracts";

const writeResult = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("saved"),
    revision: z.number().int().positive(),
  }),
  z.object({
    status: z.literal("conflict"),
    revision: z.number().int().nonnegative(),
  }),
]);
export interface CloudTransport {
  read(ownerId: string): Promise<RemoteSnapshot>;
  write(ownerId: string, upload: Upload): Promise<z.infer<typeof writeResult>>;
}
function connectionError(code?: string) {
  return new Error(
    code === "42501"
      ? "클라우드 접근이 허용되지 않았습니다. 계정과 초대 허용 목록을 확인해주세요."
      : "클라우드에 연결하지 못했습니다. 기기 기록은 보존됩니다. 연결 후 다시 시도해주세요.",
  );
}
export function supabaseTransport(client: SupabaseClient): CloudTransport {
  async function requireAccount(ownerId: string) {
    const { data, error } = await client.auth.getUser();
    if (error || data.user?.id !== ownerId)
      throw new Error("로그인 계정이 바뀌었습니다. 다시 로그인해주세요.");
  }
  return {
    async read(ownerId) {
      await requireAccount(ownerId);
      const { data, error } = await client.rpc("training_snapshot_read");
      if (error) throw connectionError(error.code);
      return checkRemote(data, ownerId);
    },
    async write(ownerId, upload) {
      await requireAccount(ownerId);
      const { data, error } = await client.rpc("training_snapshot_write", {
        p_operation_id: upload.operationId,
        p_expected_revision: upload.baseRevision,
        p_snapshot: upload.snapshot,
      });
      if (error) throw connectionError(error.code);
      return writeResult.parse(data);
    },
  };
}
export async function uploadWorkspace(
  store: TrainingStore,
  transport: CloudTransport,
  ownerId: string,
) {
  const upload = await store.prepareUpload(ownerId);
  const result = await transport.write(ownerId, upload);
  if (result.status === "conflict")
    throw new Error(
      "다른 기기의 클라우드 기록이 바뀌었습니다. 기기 JSON 백업을 저장한 후 클라우드 기록을 확인해주세요. 자동으로 덮어쓰지 않습니다.",
    );
  await store.acknowledgeUpload(ownerId, upload.operationId, result.revision);
  return result.revision;
}
