import { Alert, Button, Text } from "@mantine/core";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function UpdateNotice({
  active,
  busy,
  resume,
}: {
  active: boolean;
  busy: boolean;
  resume: () => void;
}) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(false);
  async function apply() {
    if (active || busy || applying) return;
    setApplying(true);
    setError(false);
    try {
      await updateServiceWorker(true);
    } catch {
      setError(true);
    } finally {
      setApplying(false);
    }
  }
  if (!needRefresh) return null;
  return (
    <Alert
      icon={<RefreshCw size={18} />}
      title="새 버전이 준비됐어요"
      mb="lg"
      withCloseButton={!applying}
      onClose={() => setNeedRefresh(false)}
      closeButtonLabel="업데이트 안내 닫기"
    >
      <Text size="sm" c="dark.1" mb="sm">
        {active
          ? "진행 중인 운동이 있어 적용을 기다리고 있어요. 운동을 종료하면 업데이트할 수 있습니다."
          : busy
            ? "기록을 저장하고 있어요. 저장이 끝나면 업데이트할 수 있습니다."
            : "저장한 기록을 유지하며 앱을 업데이트합니다."}
      </Text>
      {active ? (
        <Button variant="light" disabled={busy} onClick={resume}>
          운동 마치고 업데이트
        </Button>
      ) : (
        <Button
          variant="light"
          disabled={busy}
          loading={applying}
          onClick={() => void apply()}
        >
          업데이트
        </Button>
      )}
      {error && (
        <Text role="alert" c="red.4" size="sm" mt="sm">
          업데이트를 적용하지 못했어요. 연결을 확인한 뒤 다시 눌러주세요.
        </Text>
      )}
    </Alert>
  );
}
