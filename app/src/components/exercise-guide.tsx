import {
  Accordion,
  Alert,
  Anchor,
  Badge,
  Button,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  loadPublishedGuides,
  type PublishedGuide,
} from "../content/published-guides";
const kinds = {
  scientific: "연구 결과",
  biomechanical_inference: "생체역학적 해석",
  user_fit: "사용 조건",
};
type State =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      guide: PublishedGuide | null;
      version: string;
      exerciseId: string;
    };

export function ExerciseGuide({ exerciseId }: { exerciseId: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    loadPublishedGuides(controller.signal)
      .then((bundle) => {
        if (!controller.signal.aborted)
          setState({
            status: "ready",
            exerciseId,
            guide:
              bundle.exercises.find((e) => e.exerciseId === exerciseId) ?? null,
            version: bundle.registryVersion,
          });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, [exerciseId, attempt]);
  if (
    state.status === "loading" ||
    (state.status === "ready" && state.exerciseId !== exerciseId)
  )
    return (
      <Group role="status">
        <Loader size="sm" />
        <Text size="sm">운동 설명을 확인하고 있어요…</Text>
      </Group>
    );
  if (state.status === "error")
    return (
      <Alert color="yellow" title="운동 설명을 불러오지 못했어요">
        <Stack gap="sm">
          <Text size="sm">
            연결이나 자료 형식을 확인할 수 없어 설명을 보류합니다. 운동 기록은
            계속 사용할 수 있어요.
          </Text>
          <Button
            variant="light"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((n) => n + 1);
            }}
          >
            설명 다시 불러오기
          </Button>
        </Stack>
      </Alert>
    );
  const { guide } = state;
  if (!guide)
    return (
      <Stack gap="xs">
        <Badge color="gray" w="fit-content">
          콘텐츠 검토 전
        </Badge>
        <Text size="sm" c="dimmed">
          아직 검토가 완료된 설명이 없어요. 자극 범위·수행 설명·티어는 검토를
          마친 자료부터 제공합니다.
        </Text>
      </Stack>
    );
  return (
    <Stack gap="md">
      <Badge w="fit-content">검토된 운동 설명</Badge>
      {guide.claims.map((claim) => (
        <Stack key={claim.id} gap="xs">
          <Badge variant="outline" color="gray" w="fit-content">
            {kinds[claim.kind]}
          </Badge>
          <Text size="sm">{claim.text}</Text>
          <Text size="sm" c="dimmed">
            적용 한계: {claim.limits}
          </Text>
          <Group gap="sm">
            {claim.sourceIds.map((id) => (
              <Anchor
                key={id}
                href={guide.sources.find((s) => s.id === id)!.url}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
              >
                {id} 원문
              </Anchor>
            ))}
          </Group>
        </Stack>
      ))}
      <Accordion variant="default">
        <Accordion.Item value="sources">
          <Accordion.Control>출처와 검토 기준</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                자료 {state.version} · 설명 {guide.version} · 검토{" "}
                {guide.reviewVersion}
              </Text>
              {guide.sources.map((source) => (
                <Anchor
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                >
                  {source.id} · 전문 검토 자료
                </Anchor>
              ))}
              {guide.assets.map((asset) => (
                <Stack key={asset.path} gap={4}>
                  <Anchor
                    href={asset.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    시각 자료 열기
                  </Anchor>
                  <Text size="xs" c="dimmed">
                    {asset.attribution} · {asset.license}
                  </Text>
                </Stack>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
