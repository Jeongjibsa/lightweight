import { Accordion, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { RotateCcw } from "lucide-react";
import { useTraining } from "../context/training";
import type { Session } from "../domain/models";
import { Modal, type Run } from "./shared";

export function DeletedSessionRecords({
  ownerId,
  run,
}: {
  ownerId: string;
  run: Run;
}) {
  const { store } = useTraining();
  const deleted = useLiveQuery(
    () => store.deletedEndedSessions(ownerId),
    [store, ownerId],
    [],
  ).filter((session) => session.ownerId === ownerId);
  const [recovering, setRecovering] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);
  if (!deleted.length) return null;
  return (
    <>
      <Paper>
        <Accordion>
          <Accordion.Item value="deleted-ended">
            <Accordion.Control icon={<RotateCcw size={18} />}>
              삭제한 종료 기록 {deleted.length}개
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text size="sm" c="dimmed">
                  복구하면 당시 기록이 목록과 리포트 집계에 다시 포함됩니다.
                </Text>
                {deleted.map((session) => (
                  <Group key={session.id} gap="sm" wrap="nowrap">
                    <Stack gap={4} flex={1} miw={0}>
                      <Text
                        size="sm"
                        fw={600}
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {session.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {session.localDate} ·{" "}
                        {session.sets.filter((set) => set.completedAt).length}
                        세트 완료
                      </Text>
                    </Stack>
                    <Button
                      variant="light"
                      aria-label={`${session.localDate} ${session.name} 복구`}
                      onClick={() => setRecovering(session)}
                    >
                      복구
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Paper>
      {recovering && (
        <Modal
          title="종료 기록 복구"
          onClose={() => {
            if (!busy) setRecovering(null);
          }}
        >
          <Stack gap="md">
            <Text size="sm" style={{ overflowWrap: "anywhere" }}>
              ‘{recovering.name}’의 세트와 시작·종료 시각을 그대로 복구합니다.
              새 운동을 시작하지 않습니다.
            </Text>
            <Group grow>
              <Button
                variant="default"
                disabled={busy}
                onClick={() => setRecovering(null)}
              >
                취소
              </Button>
              <Button
                loading={busy}
                onClick={async () => {
                  setBusy(true);
                  const ok = await run(
                    () =>
                      store.recoverEndedSession(
                        ownerId,
                        recovering.id,
                        recovering.revision,
                      ),
                    "종료 기록을 복구했습니다.",
                  );
                  setBusy(false);
                  if (ok) setRecovering(null);
                }}
              >
                기록 복구
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
    </>
  );
}
