import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { reportCoverage } from "../domain/report-coverage";
import type { Profile, Session } from "../domain/models";

export function RecordCoverage({
  profile,
  sessions,
  now,
  inspect,
  settings,
  today,
}: {
  profile: Profile;
  sessions: Session[];
  now: Date;
  inspect: (session: Session) => void;
  settings: () => void;
  today: () => void;
}) {
  const data = reportCoverage(profile, sessions, now);
  return (
    <Paper component="section" aria-labelledby="coverage-heading">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2} id="coverage-heading">
            이번 주 기록 점검
          </Title>
          <Badge color="gray">기기 기록 기준</Badge>
        </Group>
        <Text size="xs" c="dimmed">
          {data.start} – {data.end} · {data.timeZone}
        </Text>
        <SimpleGrid cols={2}>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              본세트를 기록한 종료 운동
            </Text>
            <Text fw={700} fz={24}>
              {data.completedSessions}회
            </Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              설정한 주간 횟수
            </Text>
            <Text fw={700} fz={24}>
              {data.goal
                ? `${data.goal.min}${data.goal.max === data.goal.min ? "" : `–${data.goal.max}`}회`
                : "미설정"}
            </Text>
          </Stack>
        </SimpleGrid>
        {!data.goal && (
          <Button variant="light" onClick={settings}>
            훈련 설정 입력
          </Button>
        )}
        {data.activeSession && (
          <Alert title="진행 중인 운동이 있어요">
            <Text size="sm" mb="sm">
              종료 운동일과 입력 점검에는 아직 포함하지 않았어요.
            </Text>
            <Button
              variant="light"
              onClick={() => inspect(data.activeSession!)}
            >
              진행 중 기록 확인
            </Button>
          </Alert>
        )}
        {data.incompleteSession && (
          <Alert color="gray" title="미완료 입력이 남아 있어요">
            <Text size="sm" mb="sm">
              종료한 운동에 미완료 본세트 입력 {data.incompleteRows}행이 있어요.
              실제로 생략한 세트인지 확인해보세요.
            </Text>
            <Button
              variant="light"
              onClick={() => inspect(data.incompleteSession!)}
            >
              미완료 기록 확인
            </Button>
          </Alert>
        )}
        {data.completedRows === 0 ? (
          <>
            <Text size="sm">
              이번 주에 종료한 운동의 완료 본세트가 아직 없어요.
            </Text>
            <Button variant="light" onClick={today}>
              운동 기록하기
            </Button>
          </>
        ) : (
          <>
            <Text size="sm">
              완료 본세트 {data.completedRows}행 중 RIR 미입력 {data.missingRir}
              행 · RIR은 선택 입력이에요.
            </Text>
            <Text size="sm">
              {data.comparableConditions
                ? `같은 조건으로 두 날짜 이상 기록한 운동 조건 ${data.comparableConditions}개가 있어요. 아래 추이에서 기록한 수치를 비교해보세요.`
                : "같은 조건의 서로 다른 날짜 기록이 더 쌓이면 수치 차이를 비교할 수 있어요."}
            </Text>
          </>
        )}
        {data.mixedTimeZones && (
          <Text size="xs" c="dimmed">
            다른 시간대에서 남긴 기록이 포함돼요. 운동일은 당시 저장한 날짜를
            유지합니다.
          </Text>
        )}
        <Text size="xs" c="dimmed">
          운동 기록일 {data.completedDays}일 · 같은 날의 여러 운동은 각각 횟수에
          포함하고, 기록일은 1일로 셉니다. 주간 횟수는 직접 설정한 목표이며, 이
          점검으로 운동 효과나 권장 운동량을 판정하지 않습니다. 기록을 수정하면
          함께 갱신됩니다.
        </Text>
      </Stack>
    </Paper>
  );
}
