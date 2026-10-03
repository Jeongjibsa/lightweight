import { useState } from "react";
import { Alert, Badge, Button, Checkbox } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { CloudDownload, CloudUpload, Download } from "lucide-react";
import { useTraining } from "../context/training";
import { supabase } from "../data/cloud/client";
import { supabaseTransport, uploadWorkspace } from "../data/cloud/sync";
import { type DownloadPreview } from "../data/cloud/contracts";
import { type Backup } from "../domain/models";
import { errorMessage } from "../domain/errors";
import { Modal, type Run } from "../components/shared";

function download(backup: Backup) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `lightweight-${backup.exportedAt.slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function CloudPanel({ busy, run }: { busy: boolean; run: Run }) {
  const { store, db, accountId } = useTraining();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<DownloadPreview | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const state = useLiveQuery(
    () => (accountId ? store.cloudState(accountId) : undefined),
    [accountId, store],
  );
  const queued =
    useLiveQuery(
      () =>
        accountId ? db.outbox.where("ownerId").equals(accountId).count() : 0,
      [accountId, db],
    ) ?? 0;
  if (!accountId || !supabase) return null;
  const transport = supabaseTransport(supabase);
  const disabled = busy || saving;
  async function act(action: () => Promise<void>, message?: string) {
    setSaving(true);
    setError("");
    try {
      await run(async () => {
        const invoke = () =>
          action().catch((e: unknown) => {
            setError(errorMessage(e));
            throw e;
          });
        if (navigator.locks)
          await navigator.locks.request(
            `lightweight.cloud.${accountId}`,
            invoke,
          );
        else await invoke();
      }, message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="card cloud-panel">
      <div className="section-heading">
        <h2>클라우드 기록</h2>
        <Badge variant="light">{queued}개 변경 대기</Badge>
      </div>
      <p className="muted">
        이 계정의 설정·루틴·운동 기록을 한 묶음으로 전송합니다. 다른 기기의
        버전과 충돌하면 기기 기록을 보존합니다.
      </p>
      <p className="hint">
        {state?.lastSyncedAt
          ? `최근 동기화: ${new Date(state.lastSyncedAt).toLocaleString("ko-KR")}`
          : "아직 동기화하지 않았습니다."}{" "}
        자동 전송은 사용하지 않습니다.
      </p>
      {state?.pending && (
        <Alert color="orange">
          전송 결과가 확인되지 않은 작업이 있습니다. ‘클라우드로 전송’으로 같은
          작업을 다시 확인할 수 있습니다.
        </Alert>
      )}
      {error && (
        <Alert color="red" role="alert">
          {error}
        </Alert>
      )}
      <div className="account-actions">
        <Button
          leftSection={<CloudUpload size={18} />}
          disabled={
            disabled || (!queued && !!state?.baseRevision && !state.pending)
          }
          onClick={() =>
            void act(async () => {
              await uploadWorkspace(store, transport, accountId);
            }, "전송을 확인했습니다. 이후 변경은 다음 전송에 포함됩니다.")
          }
        >
          클라우드로 전송
        </Button>
        <Button
          variant="default"
          leftSection={<CloudDownload size={18} />}
          disabled={disabled}
          onClick={() =>
            void act(async () => {
              setPreview(
                await store.previewDownload(
                  accountId,
                  await transport.read(accountId),
                ),
              );
              setConfirmed(false);
            })
          }
        >
          클라우드 기록 불러오기
        </Button>
        {state?.recovery && (
          <Button
            variant="subtle"
            leftSection={<Download size={18} />}
            onClick={() => download(state.recovery!)}
          >
            최근 교체 전 기록 다운로드
          </Button>
        )}
      </div>
      {busy && (
        <p className="hint">운동과 기기 저장을 마친 후 동기화할 수 있습니다.</p>
      )}
      {preview && (
        <Modal
          onClose={() => {
            if (!saving) setPreview(null);
          }}
          title="클라우드 기록으로 교체"
        >
          <div className="form-stack">
            <p>
              클라우드 버전 {preview.remote.revision}의 기록으로 이 계정의 기기
              기록을 교체합니다.
            </p>
            {preview.dirty && (
              <Alert color="orange">
                아직 전송하지 않은 기기 변경이 있습니다. 먼저 JSON 백업을
                다운로드해주세요.
              </Alert>
            )}
            <Button
              variant="default"
              leftSection={<Download size={18} />}
              disabled={disabled}
              onClick={() =>
                void act(async () => download(await store.backup(accountId)))
              }
            >
              현재 기기 기록 다운로드
            </Button>
            <Checkbox
              label="기기 기록을 확인했고, 클라우드 기록으로 교체하겠습니다."
              checked={confirmed}
              onChange={(e) => setConfirmed(e.currentTarget.checked)}
            />
            <p className="hint">
              최근 교체 직전 기록 한 묶음은 이 기기에 보관됩니다. 장기 보관은
              다운로드한 JSON을 사용해주세요.
            </p>
            <Button
              disabled={disabled || !confirmed}
              onClick={() =>
                void act(async () => {
                  const latest = await transport.read(accountId);
                  if (latest.revision !== preview.remote.revision)
                    throw new Error(
                      "클라우드 기록이 바뀌었습니다. 다시 불러와주세요.",
                    );
                  await store.applyDownload(accountId, preview);
                  setPreview(null);
                }, "클라우드 기록을 기기에 저장했습니다.")
              }
            >
              확인한 기록으로 교체
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
