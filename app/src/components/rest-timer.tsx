import {
  Button,
  Group,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import {
  defaultRestPreferences,
  restPreferencesSchema,
  type RestPreferences,
  type Session,
} from "../domain/models";
import {
  pauseRest,
  remainingRest,
  restLabel,
  restStateSchema,
  resumeRest,
  startRest,
  type RestState,
} from "../domain/rest-timer";
import { useTraining } from "../context/training";
import { Modal, type Run } from "./shared";

export function RestTimer({ session, run }: { session: Session; run: Run }) {
  const { db, store } = useTraining();
  const profile = useLiveQuery(
    () => db.profiles.get(session.ownerId),
    [db, session.ownerId],
  );
  const preferences = profile?.restTimer ?? defaultRestPreferences;
  const last = session.sets
    .filter((set) => set.completedAt)
    .sort((a, b) => a.completedAt!.localeCompare(b.completedAt!))
    .at(-1);
  const source = last ? `${last.id}:${last.completedAt}` : "manual";
  const key = `lightweight-rest:${db.name}:${session.ownerId}:${session.id}`;
  const [state, setState] = useState<RestState | null>(() => {
    try {
      return restStateSchema.parse(
        JSON.parse(localStorage.getItem(key) ?? "null"),
      );
    } catch {
      return null;
    }
  });
  const [clock, setClock] = useState(() => Date.now());
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [persistError, setPersistError] = useState(false);
  const current: RestState =
    state?.source === source
      ? state
      : last
        ? startRest(
            source,
            preferences.seconds,
            new Date(last.completedAt!).getTime(),
          )
        : {
            source,
            duration: preferences.seconds,
            deadline: null,
            pausedSeconds: null,
            stopped: false,
          };
  const serialized = JSON.stringify(current);
  useEffect(() => {
    try {
      localStorage.setItem(key, serialized);
    } catch {
      queueMicrotask(() => setPersistError(true));
    }
  }, [key, serialized]);
  useEffect(() => {
    const update = () => setClock(Date.now());
    const timer = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const seconds = remainingRest(current, clock);
  const idle =
    current.deadline === null &&
    current.pausedSeconds === null &&
    !current.stopped;
  const finished = !idle && seconds === 0;
  const paused =
    current.deadline === null && current.pausedSeconds !== null && seconds > 0;
  async function handleDurationClick(duration: number, now: number) {
    if (busy) return;
    setBusy(true);
    if (
      await run(() =>
        store.saveRestPreferences(session.ownerId, {
          ...preferences,
          seconds: duration,
        }),
      )
    ) {
      setClock(now);
      setState(startRest(source, duration, now));
    }
    setBusy(false);
  }
  return (
    <Paper component="section" aria-label="세트 휴식 타이머" bg="dark.6" p="md">
      <Stack gap="sm">
        <Group justify="space-between">
          <Group gap="sm">
            <Timer size={20} aria-hidden="true" />
            <Text fw={600}>세트 휴식</Text>
          </Group>
          <Button
            variant="subtle"
            size="compact-md"
            onClick={() => setEditing(true)}
          >
            즐겨찾기 편집
          </Button>
        </Group>
        <Group justify="space-between" align="center">
          <Text
            aria-label="남은 휴식 시간"
            fz={32}
            fw={650}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {restLabel(seconds)}
          </Text>
          <Text size="sm" c={finished ? "yellow.4" : "dimmed"} role="status">
            {finished
              ? "휴식 완료"
              : idle
                ? "세트를 완료하면 시작"
                : paused
                  ? "일시정지"
                  : "휴식 중"}
          </Text>
        </Group>
        <SimpleGrid cols={preferences.favorites.length} spacing={6}>
          {preferences.favorites.map((duration) => (
            <Button
              key={duration}
              variant={current.duration === duration ? "filled" : "default"}
              px={0}
              disabled={busy}
              aria-label={`${duration}초 휴식 시작`}
              onClick={() => void handleDurationClick(duration, Date.now())}
            >
              {restLabel(duration)}
            </Button>
          ))}
        </SimpleGrid>
        <Group gap="sm" grow>
          <Button
            variant="light"
            aria-label={
              idle || finished
                ? "타이머 시작"
                : paused
                  ? "휴식 재개"
                  : "휴식 일시정지"
            }
            onClick={() => {
              const now = Date.now();
              setClock(now);
              setState(
                idle || finished
                  ? startRest(source, current.duration, now)
                  : paused
                    ? resumeRest(current, now)
                    : pauseRest(current, now),
              );
            }}
          >
            {idle || finished ? "시작" : paused ? "재개" : "일시정지"}
          </Button>
          <Button
            variant="subtle"
            disabled={idle || finished}
            onClick={() => setState({ ...current, stopped: true })}
          >
            휴식 종료
          </Button>
        </Group>
        {last && (
          <Text size="xs" c="dimmed">
            {last.exercise.name} {last.order + 1}세트 완료 후 · 편의용 시간
          </Text>
        )}
        {persistError && (
          <Text size="xs" c="red.4" role="alert">
            타이머 상태를 기기에 저장하지 못했습니다. 앱을 다시 열면 시간 상태가
            달라질 수 있습니다.
          </Text>
        )}
      </Stack>
      {editing && (
        <FavoritesEditor
          preferences={preferences}
          onClose={() => setEditing(false)}
          onSave={async (next) =>
            run(
              () => store.saveRestPreferences(session.ownerId, next),
              "휴식 즐겨찾기를 저장했습니다.",
            )
          }
        />
      )}
    </Paper>
  );
}
function FavoritesEditor({
  preferences,
  onSave,
  onClose,
}: {
  preferences: RestPreferences;
  onSave: (next: RestPreferences) => Promise<boolean>;
  onClose: () => void;
}) {
  const [values, setValues] = useState<(number | string)[]>(
    preferences.favorites,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Modal title="휴식 즐겨찾기" onClose={onClose}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          자주 쓰는 시간을 3~4개 저장하세요. 15초~30분 범위의 편의 설정입니다.
        </Text>
        {values.map((value, index) => (
          <NumberInput
            key={index}
            label={`즐겨찾기 ${index + 1} · 초`}
            min={15}
            max={1800}
            step={15}
            allowDecimal={false}
            value={value}
            disabled={busy}
            onChange={(next) =>
              setValues(values.map((prior, i) => (i === index ? next : prior)))
            }
          />
        ))}
        <Button
          variant="subtle"
          disabled={busy}
          onClick={() =>
            setValues(
              values.length === 4 ? values.slice(0, 3) : [...values, 180],
            )
          }
        >
          {values.length === 4
            ? "즐겨찾기 3개로 줄이기"
            : "즐겨찾기 4번째 추가"}
        </Button>
        {error && (
          <Text c="red.4" role="alert">
            {error}
          </Text>
        )}
        <Group grow>
          <Button variant="default" disabled={busy} onClick={onClose}>
            취소
          </Button>
          <Button
            disabled={busy}
            loading={busy}
            aria-label="즐겨찾기 저장"
            onClick={async () => {
              const result = restPreferencesSchema.safeParse({
                seconds: preferences.seconds,
                favorites: values,
              });
              if (!result.success) {
                setError(
                  "15~1800초 사이의 서로 다른 시간을 3~4개 입력해주세요.",
                );
                return;
              }
              setError("");
              setBusy(true);
              if (await onSave(result.data)) onClose();
              setBusy(false);
            }}
          >
            저장
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
