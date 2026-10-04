import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Select,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  Check,
  Plus,
  Timer,
  Flag,
  ArrowLeft,
  Pencil,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ListOrdered,
} from "lucide-react";
import { loadModes, type Session, type TrainingSet } from "../domain/models";
import { useTraining } from "../context/training";
import { ExercisePicker } from "./exercises";
import { Modal, type Run } from "./shared";

function SetRow({
  set,
  index,
  session,
  run,
  onEdit,
}: {
  set: TrainingSet;
  index: number;
  session: Session;
  run: Run;
  onEdit?: () => void;
}) {
  const { store } = useTraining();
  const [load, setLoad] = useState(set.load === null ? "" : String(set.load));
  const [reps, setReps] = useState(set.reps === null ? "" : String(set.reps));
  const [seconds, setSeconds] = useState(
    set.seconds === null ? "" : String(set.seconds),
  );
  const [rir, setRir] = useState(set.rir === null ? "" : String(set.rir));
  const [kind, setKind] = useState(set.kind);
  const [side, setSide] = useState(set.side);
  const [busy, setBusy] = useState(false);
  useEffect(
    () => setLoad(set.load === null ? "" : String(set.load)),
    [set.load],
  );
  useEffect(
    () => setReps(set.reps === null ? "" : String(set.reps)),
    [set.reps],
  );
  useEffect(
    () => setSeconds(set.seconds === null ? "" : String(set.seconds)),
    [set.seconds],
  );
  useEffect(() => setKind(set.kind), [set.kind]);
  useEffect(() => setSide(set.side), [set.side]);
  useEffect(() => setRir(set.rir === null ? "" : String(set.rir)), [set.rir]);
  const completed = !!set.completedAt;
  const readOnly = session.status !== "active";
  const timed = set.exercise.loadMode === "timed";
  const patch = {
    load: load === "" ? null : Number(load),
    reps: reps === "" ? null : Number(reps),
    seconds: seconds === "" ? null : Number(seconds),
    rir: rir === "" ? null : Number(rir),
    kind,
    side,
  };
  async function save(completion?: boolean) {
    if (readOnly || (completed && completion === undefined)) return;
    if (
      completion === undefined &&
      Object.entries(patch).every(
        ([key, value]) => set[key as keyof TrainingSet] === value,
      )
    )
      return;
    if (completion !== undefined) setBusy(true);
    await run(() =>
      store.updateSet(session.ownerId, session.id, set.id, patch, completion),
    );
    setBusy(false);
  }
  const prefix = `${set.exercise.name} ${index + 1}세트`;
  return (
    <Box
      py="sm"
      style={{ borderBottom: "1px solid var(--mantine-color-dark-5)" }}
    >
      <Group gap="sm" wrap="nowrap" align="flex-end">
        <Text
          w={20}
          pb={12}
          ta="center"
          fw={600}
          c={completed ? "yellow.4" : "dimmed"}
        >
          {index + 1}
        </Text>
        {timed ? (
          <TextInput
            flex={1}
            label="시간 · 초"
            aria-label={`${prefix} 시간`}
            type="number"
            min={1}
            max={86400}
            step={1}
            inputMode="numeric"
            placeholder="—"
            value={seconds}
            disabled={completed || readOnly}
            onChange={(e) => setSeconds(e.target.value)}
            onBlur={() => void save()}
          />
        ) : (
          <>
            <TextInput
              flex={1}
              miw={0}
              label={`중량 · ${set.unit}`}
              aria-label={`${prefix} 중량`}
              type="number"
              min={0}
              max={3000}
              step="any"
              inputMode="decimal"
              placeholder="—"
              value={load}
              disabled={completed || readOnly}
              onChange={(e) => setLoad(e.target.value)}
              onBlur={() => void save()}
            />
            <TextInput
              flex={1}
              miw={0}
              label="횟수"
              aria-label={`${prefix} 횟수`}
              type="number"
              min={1}
              max={1000}
              step={1}
              inputMode="numeric"
              placeholder="—"
              value={reps}
              disabled={completed || readOnly}
              onChange={(e) => setReps(e.target.value)}
              onBlur={() => void save()}
            />
          </>
        )}
        <ActionIcon
          variant={completed ? "filled" : "light"}
          size={46}
          aria-label={`${prefix} ${completed ? "완료 취소" : "완료"}`}
          aria-pressed={completed}
          disabled={busy || readOnly}
          onClick={() => void save(!completed)}
        >
          <Check size={22} />
        </ActionIcon>
      </Group>
      <Accordion mt="sm" variant="default" order={4}>
        <Accordion.Item value="details">
          <Accordion.Control>
            <Text size="xs" c="dimmed">
              {kind === "warmup" ? "준비 세트" : "본세트"} · 상세
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="sm">
              <Select
                label="세트 종류"
                aria-label={`${prefix} 종류`}
                disabled={completed || readOnly}
                value={kind}
                onChange={(selection) => {
                  if (!selection) return;
                  const value = selection as TrainingSet["kind"];
                  setKind(value);
                  void run(() =>
                    store.updateSet(session.ownerId, session.id, set.id, {
                      ...patch,
                      kind: value,
                    }),
                  );
                }}
                data={[
                  { value: "working", label: "본세트" },
                  { value: "warmup", label: "준비 세트" },
                ]}
              />
              <Select
                label="좌우"
                aria-label={`${prefix} 좌우`}
                disabled={completed || readOnly}
                value={side}
                onChange={(selection) => {
                  if (!selection) return;
                  const value = selection as TrainingSet["side"];
                  setSide(value);
                  void run(() =>
                    store.updateSet(session.ownerId, session.id, set.id, {
                      ...patch,
                      side: value,
                    }),
                  );
                }}
                data={[
                  { value: "both", label: "양쪽 / 해당 없음" },
                  { value: "left", label: "왼쪽" },
                  { value: "right", label: "오른쪽" },
                ]}
              />
              <TextInput
                label="RIR · 선택"
                aria-label={`${prefix} RIR`}
                type="number"
                min={0}
                max={10}
                step="any"
                placeholder="미입력"
                disabled={completed || readOnly}
                value={rir}
                onChange={(e) => setRir(e.target.value)}
                onBlur={() => void save()}
              />
            </SimpleGrid>
            <Text size="xs" c="dimmed" mt="sm">
              RIR은 더 할 수 있었던 횟수입니다. 한쪽씩 기록할 때 좌우를
              구분하세요.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      {onEdit && (
        <Button
          size="xs"
          variant="subtle"
          leftSection={<Pencil size={14} />}
          onClick={onEdit}
          mt="xs"
          aria-label={`${prefix} 기록 수정`}
        >
          기록 수정
        </Button>
      )}
    </Box>
  );
}

function SetCorrection({
  set,
  session,
  revision,
  run,
  onClose,
}: {
  set: TrainingSet;
  session: Session;
  revision: number;
  run: Run;
  onClose: () => void;
}) {
  const { store } = useTraining();
  const [load, setLoad] = useState(set.load === null ? "" : String(set.load));
  const [reps, setReps] = useState(set.reps === null ? "" : String(set.reps));
  const [seconds, setSeconds] = useState(
    set.seconds === null ? "" : String(set.seconds),
  );
  const [rir, setRir] = useState(set.rir === null ? "" : String(set.rir));
  const [kind, setKind] = useState(set.kind);
  const [side, setSide] = useState(set.side);
  const [busy, setBusy] = useState(false);
  const number = (text: string) => (text === "" ? null : Number(text));
  return (
    <Modal
      title="세트 기록 수정"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <Stack gap="md">
        <Text size="sm">
          {set.exercise.name} · {set.completedAt ? "완료 세트" : "미완료 세트"}.
          수행 시각과 완료 여부는 유지합니다.
        </Text>
        {set.exercise.loadMode === "timed" ? (
          <TextInput
            label="수정할 시간 · 초"
            type="number"
            disabled={busy}
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
          />
        ) : (
          <SimpleGrid cols={2}>
            <TextInput
              label={`수정할 중량 · ${set.unit}`}
              type="number"
              disabled={busy}
              inputMode="decimal"
              value={load}
              onChange={(e) => setLoad(e.target.value)}
            />
            <TextInput
              label="수정할 횟수"
              type="number"
              disabled={busy}
              inputMode="numeric"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </SimpleGrid>
        )}
        <SimpleGrid cols={{ base: 1, xs: 3 }}>
          <Select
            label="수정할 세트 종류"
            disabled={busy}
            value={kind}
            onChange={(v) => v && setKind(v as TrainingSet["kind"])}
            data={[
              { value: "working", label: "본세트" },
              { value: "warmup", label: "준비 세트" },
            ]}
          />
          <Select
            label="수정할 좌우"
            disabled={busy}
            value={side}
            onChange={(v) => v && setSide(v as TrainingSet["side"])}
            data={[
              { value: "both", label: "양쪽 / 해당 없음" },
              { value: "left", label: "왼쪽" },
              { value: "right", label: "오른쪽" },
            ]}
          />
          <TextInput
            label="수정할 RIR · 선택"
            type="number"
            disabled={busy}
            value={rir}
            onChange={(e) => setRir(e.target.value)}
          />
        </SimpleGrid>
        <Button
          loading={busy}
          onClick={async () => {
            setBusy(true);
            if (
              await run(
                () =>
                  store.correctSet(
                    session.ownerId,
                    session.id,
                    set.id,
                    revision,
                    {
                      load: number(load),
                      reps: number(reps),
                      seconds: number(seconds),
                      rir: number(rir),
                      kind,
                      side,
                    },
                  ),
                "수정한 기록을 저장했습니다.",
              )
            )
              onClose();
            setBusy(false);
          }}
        >
          수정 기록 저장
        </Button>
      </Stack>
    </Modal>
  );
}

function RestClock({ session }: { session: Session }) {
  const last = session.sets
    .map((set) => set.completedAt)
    .filter((at): at is string => !!at)
    .sort()
    .at(-1);
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    if (!last) return;
    const interval = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [last]);
  if (!last || session.status !== "active") return null;
  const seconds = Math.min(
    120,
    Math.max(0, Math.ceil((new Date(last).getTime() + 120000 - clock) / 1000)),
  );
  return (
    <Paper py="sm" px="md" bg="dark.6">
      <Group gap="sm" wrap="nowrap">
        <Timer size={19} color="var(--mantine-color-yellow-4)" />
        <Text fw={650} fz={20} style={{ fontVariantNumeric: "tabular-nums" }}>
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </Text>
        <Text size="xs" c="dimmed">
          최근 완료부터 2분 · 편의용 타이머
        </Text>
      </Group>
    </Paper>
  );
}
function ExerciseOrder({
  session,
  run,
  onClose,
}: {
  session: Session;
  run: Run;
  onClose: () => void;
}) {
  const { store } = useTraining();
  const [revision] = useState(session.revision);
  const [exercises, setExercises] = useState(() => [
    ...new Map(
      session.sets.map((set) => [set.exercise.id, set.exercise]),
    ).values(),
  ]);
  const [saving, setSaving] = useState(false);
  function move(index: number, offset: number) {
    setExercises((prior) => {
      const target = index + offset;
      if (target < 0 || target >= prior.length) return prior;
      const next = [...prior];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }
  return (
    <Modal title="운동 순서 변경" onClose={onClose}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          현재 운동의 순서를 바꿉니다. 입력값과 완료 세트는 보존되고, 저장된
          루틴의 순서는 그대로 유지됩니다.
        </Text>
        <Stack component="ol" aria-label="변경할 운동 순서" pl={0} gap="sm">
          {exercises.map((exercise, index) => (
            <Paper
              component="li"
              key={exercise.id}
              p="sm"
              bg="dark.8"
              style={{ listStyle: "none" }}
            >
              <Group wrap="nowrap" gap="sm">
                <Text flex={1} miw={0} size="sm" fw={600}>
                  {index + 1}. {exercise.name}
                </Text>
                <ActionIcon
                  variant="subtle"
                  size={44}
                  aria-label={`${exercise.name} 위로`}
                  disabled={saving || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp size={19} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  size={44}
                  aria-label={`${exercise.name} 아래로`}
                  disabled={saving || index === exercises.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown size={19} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
        <Group grow>
          <Button variant="default" disabled={saving} onClick={onClose}>
            취소
          </Button>
          <Button
            loading={saving}
            onClick={async () => {
              setSaving(true);
              const ok = await run(
                () =>
                  store.reorderExercises(
                    session.ownerId,
                    session.id,
                    exercises.map((exercise) => exercise.id),
                    revision,
                  ),
                "운동 순서를 저장했습니다.",
              );
              setSaving(false);
              if (ok) onClose();
            }}
          >
            순서 저장
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
export function WorkoutView({
  session,
  run,
  onBack,
  onRepeat,
  history,
}: {
  session: Session;
  run: Run;
  onBack: () => void;
  onRepeat?: (id: string) => void;
  history?: Session[];
}) {
  const { store } = useTraining();
  const [picker, setPicker] = useState(false);
  const [ending, setEnding] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [replacement, setReplacement] = useState<
    TrainingSet["exercise"] | null
  >(null);
  const [correction, setCorrection] = useState<{
    set: TrainingSet;
    revision: number;
  } | null>(null);
  const exercises = [
    ...new Map(
      session.sets.map((set) => [set.exercise.id, set.exercise]),
    ).values(),
  ];
  const completed = session.sets.filter((set) => set.completedAt).length;
  const active = session.status === "active";
  return (
    <Stack gap="md">
      <Button
        variant="subtle"
        leftSection={<ArrowLeft size={17} />}
        onClick={onBack}
        w="fit-content"
        px={0}
      >
        목록으로 돌아가기
      </Button>
      <Paper>
        <Stack gap="md">
          <Group justify="space-between">
            <Badge>
              {active
                ? "진행 중"
                : session.status === "partial"
                  ? "일부 완료"
                  : "완료"}
            </Badge>
            <Text size="sm" c="dimmed">
              {completed} / {session.sets.length}세트
            </Text>
          </Group>
          <Title order={2} fz={24}>
            {session.name}
          </Title>
          <Text size="xs" c="dimmed">
            {session.localDate} · {session.timeZone}
            {session.routineSnapshot
              ? ` · 루틴 버전 ${session.routineSnapshot.revision}`
              : ""}
          </Text>
          <Progress
            value={
              session.sets.length ? (completed / session.sets.length) * 100 : 0
            }
            size={6}
            radius="xl"
            aria-label="세트 기록 완료 비율"
          />
        </Stack>
      </Paper>
      {active && exercises.length > 1 && (
        <Button
          variant="subtle"
          leftSection={<ListOrdered size={18} />}
          w="fit-content"
          onClick={() => setOrdering(true)}
        >
          운동 순서 변경
        </Button>
      )}
      <RestClock session={session} />
      {exercises.map((exercise) => (
        <Paper key={exercise.id} p={{ base: "md", sm: "lg" }}>
          <Group justify="space-between" align="flex-start" mb="md">
            <Box>
              <Title order={3}>{exercise.name}</Title>
              <Text size="xs" c="dimmed" mt={4}>
                {exercise.group} · {loadModes[exercise.loadMode]}
                {exercise.loadMode === "per_hand" ? "을 입력하세요" : ""}
              </Text>
            </Box>
            <Badge color="gray" size="sm">
              {exercise.review === "user_added" ? "직접 입력" : "기록용 초안"}
            </Badge>
          </Group>
          {session.sets
            .filter((set) => set.exercise.id === exercise.id)
            .map((set, index) => (
              <SetRow
                key={set.id}
                set={set}
                index={index}
                session={session}
                run={run}
                onEdit={
                  active
                    ? undefined
                    : () => setCorrection({ set, revision: session.revision })
                }
              />
            ))}
          {active && (
            <Button
              variant="light"
              fullWidth
              mt="sm"
              leftSection={<Plus size={17} />}
              disabled={session.sets.length >= 400}
              onClick={() =>
                void run(() =>
                  store.addSet(session.ownerId, session.id, exercise),
                )
              }
            >
              세트 추가
            </Button>
          )}
          {active &&
            session.sets.some(
              (s) => s.exercise.id === exercise.id && !s.completedAt,
            ) && (
              <Group mt="sm">
                {(!history ||
                  history.some(
                    (s) =>
                      s.ownerId === session.ownerId &&
                      !s.deletedAt &&
                      s.endedAt &&
                      s.sets.some(
                        (t) => t.exercise.id === exercise.id && t.completedAt,
                      ),
                  )) && (
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() =>
                      void run(
                        () =>
                          store.reusePreviousValues(
                            session.ownerId,
                            session.id,
                            exercise.id,
                          ),
                        "비어 있는 입력에 이전 수행 값을 불러왔습니다.",
                      )
                    }
                  >
                    이전 값 불러오기
                  </Button>
                )}
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setReplacement(exercise)}
                >
                  다른 운동으로 교체
                </Button>
              </Group>
            )}
        </Paper>
      ))}
      {active && (
        <>
          <Button
            variant="subtle"
            color="red"
            w="fit-content"
            onClick={() => setCancel(true)}
          >
            운동 기록 취소
          </Button>
          <Paper className="workout-dock" p="sm" shadow="lg" bg="dark.6">
            <Group grow wrap="nowrap" gap="sm">
              <Button
                variant="default"
                leftSection={<Plus size={18} />}
                onClick={() => setPicker(true)}
              >
                운동 추가
              </Button>
              <Button
                leftSection={<Flag size={18} />}
                onClick={() => setEnding(true)}
              >
                운동 마치기
              </Button>
            </Group>
          </Paper>
        </>
      )}
      {!active && (
        <Stack gap="sm">
          <Button
            leftSection={<RotateCcw size={17} />}
            onClick={() =>
              void run(async () => {
                const next = await store.repeatSession(
                  session.ownerId,
                  session.id,
                );
                if (onRepeat) onRepeat(next.id);
                else onBack();
              })
            }
          >
            이 운동 다시 시작
          </Button>
          <Text size="xs" c="dimmed">
            당시 설정과 수행한 세트를 보존한 기록입니다. 리포트에는 완료한
            본세트만 집계합니다. 다시 시작하면 수행한 세트의 입력값을 계획으로
            가져오며 오늘의 완료로 집계하지 않습니다.
          </Text>
        </Stack>
      )}
      {replacement && (
        <Modal title="다른 운동으로 교체" onClose={() => setReplacement(null)}>
          <Stack gap="sm">
            <Text size="sm">
              완료 세트는 보존하고 미완료 세트만 바꿉니다. 새 운동의 입력값은
              비웁니다.
            </Text>
            <ExercisePicker
              onPick={async (exercise) => {
                if (
                  await run(() =>
                    store.replaceExercise(
                      session.ownerId,
                      session.id,
                      replacement.id,
                      exercise,
                    ),
                  )
                )
                  setReplacement(null);
              }}
            />
          </Stack>
        </Modal>
      )}
      {ordering && (
        <ExerciseOrder
          session={session}
          run={run}
          onClose={() => setOrdering(false)}
        />
      )}
      {correction && (
        <SetCorrection
          set={correction.set}
          revision={correction.revision}
          session={session}
          run={run}
          onClose={() => setCorrection(null)}
        />
      )}
      {picker && (
        <Modal title="운동 추가" onClose={() => setPicker(false)}>
          <ExercisePicker
            onPick={async (exercise) => {
              if (
                await run(() =>
                  store.addExercise(session.ownerId, session.id, exercise),
                )
              )
                setPicker(false);
            }}
          />
        </Modal>
      )}
      {ending && (
        <Modal title="오늘 운동을 마칠까요?" onClose={() => setEnding(false)}>
          <Stack gap="md">
            <Text size="sm">
              총 {session.sets.length}개 세트 기록 중 {completed}개를
              완료했어요. 완료하지 않은 계획 세트는 수행량에 포함되지 않습니다.
            </Text>
            <Group grow>
              <Button variant="default" onClick={() => setEnding(false)}>
                계속 운동하기
              </Button>
              <Button
                disabled={!completed}
                onClick={async () => {
                  if (
                    await run(
                      () => store.endSession(session.ownerId, session.id),
                      "오늘의 운동을 저장했습니다.",
                    )
                  ) {
                    setEnding(false);
                    onBack();
                  }
                }}
              >
                완료 기록 저장
              </Button>
            </Group>
            {!completed && (
              <Text size="xs" c="dimmed">
                세트를 하나 이상 완료하거나, 운동 기록 취소를 선택해주세요.
              </Text>
            )}
          </Stack>
        </Modal>
      )}
      {cancel && (
        <Modal title="운동 기록 취소" onClose={() => setCancel(false)}>
          <Stack gap="md">
            <Text size="sm">
              현재 운동을 기록 목록에서 삭제합니다. 이 운동의 완료 세트도
              리포트에서 제외됩니다.
            </Text>
            <Group grow>
              <Button variant="default" onClick={() => setCancel(false)}>
                계속 운동하기
              </Button>
              <Button
                color="red"
                onClick={async () => {
                  if (
                    await run(
                      () =>
                        store.tombstone(session.ownerId, "session", session.id),
                      "운동 기록을 취소했습니다.",
                    )
                  ) {
                    setCancel(false);
                    onBack();
                  }
                }}
              >
                기록 취소
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
    </Stack>
  );
}
