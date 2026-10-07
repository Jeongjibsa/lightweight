import {
  Accordion,
  Alert,
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import type { Profile, Session } from "../domain/models";
import { weeklyReport, weeklyReportFile } from "../domain/weekly-report";
import { formatMetric } from "./volume-format";

export function WeeklyRecordReport({
  profile,
  sessions,
  now,
}: {
  profile: Profile;
  sessions: Session[];
  now: Date;
}) {
  const report = useMemo(
    () => weeklyReport(profile, sessions, now),
    [profile, sessions, now],
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  function download() {
    setError("");
    setSaved(false);
    try {
      const blob = weeklyReportFile(report),
        url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lightweight-report-${report.current.end}.html`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setSaved(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "리포트 파일을 저장하지 못했어요.",
      );
    }
  }
  const rows = [
    [
      "운동 횟수",
      `${report.current.sessions}회`,
      `${report.previous.sessions}회`,
    ],
    [
      "완료 본세트",
      `${report.current.workingRows}행`,
      `${report.previous.workingRows}행`,
    ],
    [
      "볼륨 부분합",
      formatMetric(report.current.volume, "kg·회"),
      formatMetric(report.previous.volume, "kg·회"),
    ],
    [
      "볼륨 포함 행",
      `${report.current.volumeRows}/${report.current.workingRows}`,
      `${report.previous.volumeRows}/${report.previous.workingRows}`,
    ],
  ];
  return (
    <Paper component="section" aria-labelledby="weekly-comparison-heading">
      <Stack gap="md">
        <Group justify="space-between">
          <Title id="weekly-comparison-heading" order={2}>
            지난주와 비교
          </Title>
          <Button
            variant="light"
            leftSection={<Download size={17} />}
            onClick={download}
          >
            리포트 파일 저장
          </Button>
        </Group>
        <Text size="sm" c="dimmed">
          {report.current.start}–{report.current.end} · 지난주도 같은 요일까지
          비교합니다. 종료한 운동의 기록만 포함합니다.
        </Text>
        <Table
          style={{ tableLayout: "fixed" }}
          styles={{
            td: { overflowWrap: "anywhere" },
            th: { overflowWrap: "anywhere" },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th scope="col">지표</Table.Th>
              <Table.Th scope="col">이번 주</Table.Th>
              <Table.Th scope="col">지난주</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map(([label, a, b]) => (
              <Table.Tr key={label}>
                <Table.Th scope="row">{label}</Table.Th>
                <Table.Td>{a}</Table.Td>
                <Table.Td>{b}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Text size="xs" c="dimmed">
          총 중량 방식만 볼륨 부분합에 포함합니다. N/A는 0이 아니며 기록의
          변화가 근육 성장이나 최적 볼륨을 뜻하지는 않습니다.
        </Text>
        <Accordion variant="default">
          <Accordion.Item value="basis">
            <Accordion.Control>
              이 리포트는 어떻게 계산하나요?
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="sm">
                  준비·미완료 세트, 진행 중·취소·삭제·미래 운동은 제외합니다.
                  좌우를 따로 입력한 행은 각각 셉니다. 기록 없는 날을 휴식일로
                  판단하지 않습니다.
                </Text>
                <Text size="sm">
                  저장한 파일은 브라우저에서 읽을 수 있고, 당시 입력과 계산
                  버전을 함께 보존합니다. 운동 백업이나 클라우드 동기화 파일은
                  아닙니다.
                </Text>
                <Text size="xs" c="dimmed">
                  {report.version} · {report.versions.volume} ·{" "}
                  {report.versions.coverage} · 근육 매핑/과학 추천 규칙: 검토 전
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        {saved && (
          <Text role="status" size="sm">
            리포트 파일 저장을 요청했어요. 기기의 다운로드 목록에서
            확인해주세요.
          </Text>
        )}
        {error && <Alert color="red">{error}</Alert>}
      </Stack>
    </Paper>
  );
}
