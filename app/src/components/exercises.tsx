import {
  ActionIcon,
  Accordion,
  Badge,
  Box,
  Button,
  Group,
  Select,
  NavLink,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useState, type FormEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Trash2,
  Play,
  Copy,
  Info,
  Dumbbell,
  RotateCcw,
} from "lucide-react";
import { catalog } from "../content/catalog";
import {
  exerciseSchema,
  groups,
  subgroups,
  equipmentOptions,
  loadModes,
  type Exercise,
  type Profile,
  type Routine,
} from "../domain/models";
import { useTraining } from "../context/training";
import { ExerciseGuide } from "./exercise-guide";
import { Empty, Modal, type Run } from "./shared";
export function ExercisePicker({
  onPick,
  onInspect,
  disabled = false,
}: {
  onPick: (exercise: Exercise) => void;
  onInspect?: (exercise: Exercise) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("전체");
  const [subgroup, setSubgroup] = useState("전체");
  const [equipment, setEquipment] = useState("전체");
  const [custom, setCustom] = useState(false);
  const filtered = catalog.filter(
    (item) =>
      (group === "전체" || item.group === group) &&
      (subgroup === "전체" || item.subgroup === subgroup) &&
      (equipment === "전체" || item.equipment === equipment) &&
      `${item.name} ${item.equipment} ${item.subgroup ?? ""} ${(item.aliases ?? []).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <Stack gap="md">
      <TextInput
        placeholder="운동 이름 또는 장비 검색"
        aria-label="운동 검색"
        leftSection={<Search size={18} />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ScrollArea type="auto" offsetScrollbars>
        <Group gap={6} wrap="nowrap" w="max-content">
          {["전체", ...groups].map((item) => (
            <Button
              key={item}
              variant={item === group ? "filled" : "default"}
              radius="xl"
              size="compact-md"
              px="md"
              aria-pressed={item === group}
              onClick={() => {
                setGroup(item);
                setSubgroup("전체");
              }}
            >
              {item}
            </Button>
          ))}
        </Group>
      </ScrollArea>
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
        {group !== "전체" && (
          <Select
            label="세부 부위"
            value={subgroup}
            data={["전체", ...subgroups[group as Exercise["group"]]]}
            onChange={(value) => setSubgroup(value ?? "전체")}
          />
        )}
        <Select
          label="장비"
          value={equipment}
          data={["전체", ...equipmentOptions]}
          onChange={(value) => setEquipment(value ?? "전체")}
        />
      </SimpleGrid>
      <Stack gap={4}>
        {filtered.map((exercise) => (
          <Group key={exercise.id} wrap="nowrap" gap={4}>
            <NavLink
              component="button"
              type="button"
              disabled={disabled}
              flex={1}
              onClick={() => onPick(exercise)}
              aria-label={`${exercise.name} 추가`}
              label={exercise.name}
              description={`${exercise.group}${exercise.subgroup ? ` / ${exercise.subgroup}` : ""} · ${exercise.equipment} · ${loadModes[exercise.loadMode]}`}
              leftSection={
                <ThemeIcon variant="light" color="gray" radius="lg" size={38}>
                  <Dumbbell size={19} />
                </ThemeIcon>
              }
              rightSection={
                <Plus size={20} color="var(--mantine-color-yellow-4)" />
              }
            />
            {onInspect && (
              <ActionIcon
                aria-label={`${exercise.name} 정보`}
                onClick={() => onInspect(exercise)}
              >
                <Info size={19} />
              </ActionIcon>
            )}
          </Group>
        ))}
      </Stack>
      {!filtered.length && (
        <Text size="sm" c="dimmed">
          검색 결과가 없습니다. 직접 운동을 추가할 수 있어요.
        </Text>
      )}
      <Button
        variant="default"
        fullWidth
        disabled={disabled}
        onClick={() => setCustom(!custom)}
      >
        {custom ? "직접 입력 닫기" : "목록에 없는 운동 직접 입력"}
      </Button>
      {custom && !disabled && <CustomExercise onPick={onPick} />}
    </Stack>
  );
}
function CustomExercise({ onPick }: { onPick: (exercise: Exercise) => void }) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState<Exercise["group"]>("가슴");
  const [subgroup, setSubgroup] = useState<string | null>(null);
  const [mode, setMode] = useState<Exercise["loadMode"]>("total");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const result = exerciseSchema.safeParse({
      id: crypto.randomUUID(),
      name,
      group,
      subgroup: subgroup ?? undefined,
      equipment: "직접 입력",
      loadMode: mode,
      review: "user_added",
    });
    if (!result.success) {
      setError("운동 이름을 입력해주세요.");
      return;
    }
    setError("");
    onPick(result.data);
  }
  return (
    <Stack onSubmit={submit} component="form" gap="md">
      <TextInput
        required
        maxLength={80}
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="운동 이름"
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Select
          label="기록 분류"
          value={group}
          data={[...groups]}
          onChange={(value) => {
            if (value) {
              setGroup(value as Exercise["group"]);
              setSubgroup(null);
            }
          }}
        />
        <Select
          label="세부 부위 (선택)"
          value={subgroup}
          clearable
          allowDeselect
          data={[...subgroups[group]]}
          onChange={setSubgroup}
        />
        <Select
          label="중량 표기"
          value={mode}
          data={Object.entries(loadModes).map(([value, label]) => ({
            value,
            label,
          }))}
          onChange={(value) => {
            if (value) setMode(value as Exercise["loadMode"]);
          }}
        />
      </SimpleGrid>
      <Button type="submit" variant="filled">
        이 운동 추가
      </Button>
      {error && (
        <Text role="alert" size="sm" c="red.4" my="sm">
          {error}
        </Text>
      )}
    </Stack>
  );
}
export function LibraryView({
  onAdd,
}: {
  onAdd: (exercise: Exercise) => Promise<void>;
}) {
  const [detail, setDetail] = useState<Exercise | null>(null);
  const [adding, setAdding] = useState(false);
  async function add(exercise: Exercise) {
    if (adding) return;
    setAdding(true);
    try {
      await onAdd(exercise);
      setDetail(null);
    } finally {
      setAdding(false);
    }
  }
  return (
    <Stack gap="lg">
      <Paper>
        <Group justify="space-between" mb="md">
          <Title order={2}>오늘의 운동 찾기</Title>
          <Badge color="gray">기록용 초안</Badge>
        </Group>
        <Text c="dimmed" size="sm" mb="md">
          운동 이름을 눌러 바로 추가하세요.
        </Text>
        <ExercisePicker
          onPick={(exercise) => void add(exercise)}
          onInspect={setDetail}
          disabled={adding}
        />
      </Paper>
      <Text size="xs" c="dimmed">
        현재 {catalog.length}개 종목과 세부 부위는 입력·탐색을 위한 기록
        분류입니다. 논문 기반 설명·자극 범위·티어는 검토를 마친 콘텐츠부터
        제공할 예정입니다.
      </Text>
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <Stack gap="md">
            <ExerciseGuide key={detail.id} exerciseId={detail.id} />
            {[
              ["기록 분류", detail.group],
              ["장비", detail.equipment],
              ["입력 기준", loadModes[detail.loadMode]],
            ].map(([label, value]) => (
              <Group key={label} justify="space-between">
                <Text c="dimmed" size="sm">
                  {label}
                </Text>
                <Text fw={500} size="sm">
                  {value}
                </Text>
              </Group>
            ))}
            <Text c="dimmed" size="sm">
              같은 중량 표기와 장비 조건을 유지하면 지난 기록을 비교하기
              편합니다. 입력 분류는 근육별 자극량이나 효과 순위를 뜻하지
              않습니다.
            </Text>
            <Button
              fullWidth
              loading={adding}
              leftSection={<Plus size={18} />}
              onClick={() => void add(detail)}
            >
              현재 운동에 추가
            </Button>
          </Stack>
        </Modal>
      )}
    </Stack>
  );
}
function RoutineEditor({
  routine,
  ownerId,
  run,
  onClose,
}: {
  routine?: Routine;
  ownerId: string;
  run: Run;
  onClose: () => void;
}) {
  const { store } = useTraining();
  const [name, setName] = useState(routine?.name ?? "");
  const [entries, setEntries] = useState<Routine["exercises"]>(
    routine?.exercises ?? [],
  );
  const [picker, setPicker] = useState(!routine);
  const [saving, setSaving] = useState(false);
  function move(index: number, offset: number) {
    setEntries((prior) => {
      const next = [...prior];
      const target = index + offset;
      if (target < 0 || target >= next.length) return prior;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }
  return (
    <Modal title={routine ? "루틴 편집" : "나의 루틴 만들기"} onClose={onClose}>
      <Stack
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          const ok = await run(
            () =>
              store.saveRoutine(ownerId, {
                id: routine?.id,
                name,
                exercises: entries,
              }),
            "루틴을 저장했습니다.",
          );
          setSaving(false);
          if (ok) onClose();
        }}
        component="form"
        gap="md"
      >
        <TextInput
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 전신 A"
          label="루틴 이름"
        />
        <Stack gap="md">
          {entries.map((entry, index) => (
            <Paper key={`${entry.exercise.id}-${index}`} p="md" bg="dark.8">
              <Stack gap="md">
                <Stack gap={4}>
                  <Text fw={650}>
                    {index + 1}. {entry.exercise.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {entry.exercise.group} ·{" "}
                    {loadModes[entry.exercise.loadMode]}
                  </Text>
                </Stack>
                <TextInput
                  aria-label={`${entry.exercise.name} 계획 세트`}
                  type="number"
                  min={1}
                  max={12}
                  required
                  value={entry.sets}
                  onChange={(e) =>
                    setEntries((prior) =>
                      prior.map((item, i) =>
                        i === index
                          ? { ...item, sets: Number(e.target.value) }
                          : item,
                      ),
                    )
                  }
                  label="계획 세트"
                />
                <Group gap="sm">
                  <Button
                    type="button"
                    aria-label={`${entry.exercise.name} 위로`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    variant="subtle"
                    p={0}
                    w={44}
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    type="button"
                    aria-label={`${entry.exercise.name} 아래로`}
                    disabled={index === entries.length - 1}
                    onClick={() => move(index, 1)}
                    variant="subtle"
                    p={0}
                    w={44}
                  >
                    <ArrowDown size={16} />
                  </Button>
                  <Button
                    type="button"
                    aria-label={`${entry.exercise.name} 제거`}
                    onClick={() =>
                      setEntries((prior) => prior.filter((_, i) => i !== index))
                    }
                    variant="subtle"
                    p={0}
                    w={44}
                  >
                    <Trash2 size={16} />
                  </Button>
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
        <Button
          type="button"
          disabled={entries.length >= 30}
          onClick={() => setPicker(!picker)}
          variant="default"
        >
          <Plus size={18} />
          {picker ? "운동 선택 닫기" : "운동 추가"}
        </Button>
        <Text size="xs" c="dimmed" my="sm">
          세트 수는 직접 조정하는 계획값입니다. 과학적 루틴 추천은 근거 검토 후
          제공됩니다.
        </Text>
        <Button
          disabled={saving || !entries.length}
          type="submit"
          variant="filled"
        >
          {saving ? "저장 중…" : "루틴 저장"}
        </Button>
      </Stack>
      {picker && (
        <Box mt="lg">
          <ExercisePicker
            disabled={entries.length >= 30}
            onPick={(exercise) => {
              setEntries((prior) => [...prior, { exercise, sets: 3 }]);
              setPicker(entries.length + 1 < 30);
            }}
          />
        </Box>
      )}
    </Modal>
  );
}
export function RoutinesView({
  profile,
  routines,
  run,
  start,
}: {
  profile: Profile;
  routines: Routine[];
  run: Run;
  start: (id?: string) => Promise<void>;
}) {
  const { store } = useTraining();
  const [editor, setEditor] = useState<Routine | "new" | null>(null);
  const [deleting, setDeleting] = useState<Routine | null>(null);
  const [recovering, setRecovering] = useState<Routine | null>(null);
  const [recoverBusy, setRecoverBusy] = useState(false);
  const deleted = useLiveQuery(
    () => store.deletedRoutines(profile.ownerId),
    [store, profile.ownerId],
    [],
  ).filter((routine) => routine.ownerId === profile.ownerId);
  return (
    <>
      <Group gap="sm" justify="space-between" mb="md">
        <Text size="sm" c="dimmed" my="sm">
          순서와 계획 세트를 저장하고, 운동할 때 바로 불러오세요.
        </Text>
        <Button onClick={() => setEditor("new")} variant="filled">
          <Plus size={18} />
          루틴 만들기
        </Button>
      </Group>
      {!routines.length ? (
        <Paper>
          <Empty title="아직 저장된 루틴이 없어요">
            자주 하는 운동을 하나의 루틴으로 묶어보세요.
          </Empty>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {routines.map((routine) => (
            <Paper key={routine.id}>
              <Badge>
                {routine.exercises.length}개 운동 ·{" "}
                {routine.exercises.reduce((n, item) => n + item.sets, 0)}세트
                계획
              </Badge>
              <Title order={2} mt="md" mb="md">
                {routine.name}
              </Title>
              <Stack component="ol" gap="sm" pl="md" mb="lg">
                {routine.exercises.map((item, index) => (
                  <Box key={index} component="li" fz="sm">
                    <Text component="span" c="inherit">
                      {item.exercise.name}
                    </Text>
                    <Text component="span" size="xs" c="dimmed" ml="sm">
                      {item.sets}세트
                    </Text>
                  </Box>
                ))}
              </Stack>
              <Button
                onClick={() => void start(routine.id)}
                variant="filled"
                fullWidth
              >
                <Play size={16} />이 루틴으로 시작
              </Button>
              <Group gap="sm" mt="sm">
                <Button onClick={() => setEditor(routine)} variant="subtle">
                  편집
                </Button>
                <Button
                  onClick={() =>
                    void run(
                      () =>
                        store.saveRoutine(profile.ownerId, {
                          name: `${routine.name.slice(0, 74)} 복사`,
                          exercises: routine.exercises,
                        }),
                      "루틴을 복사했습니다.",
                    )
                  }
                  variant="subtle"
                >
                  <Copy size={14} />
                  복사
                </Button>
                <Button
                  onClick={() => setDeleting(routine)}
                  variant="subtle"
                  color="red"
                >
                  삭제
                </Button>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      )}
      {editor && (
        <RoutineEditor
          ownerId={profile.ownerId}
          routine={editor === "new" ? undefined : editor}
          run={run}
          onClose={() => setEditor(null)}
        />
      )}
      {deleted.length > 0 && (
        <Paper mt="lg">
          <Accordion>
            <Accordion.Item value="deleted">
              <Accordion.Control icon={<RotateCcw size={18} />}>
                삭제한 루틴 {deleted.length}개
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
                  <Text size="sm" c="dimmed">
                    삭제한 루틴을 다시 사용할 수 있어요. 복구해도 과거 운동
                    기록은 바뀌지 않습니다.
                  </Text>
                  {deleted.map((routine) => (
                    <Group key={routine.id} gap="sm" wrap="nowrap">
                      <Stack gap={4} flex={1} miw={0}>
                        <Text
                          size="sm"
                          fw={600}
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {routine.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {routine.exercises.length}개 운동 ·{" "}
                          {new Date(routine.deletedAt!).toLocaleDateString(
                            "ko-KR",
                          )}{" "}
                          삭제
                        </Text>
                      </Stack>
                      <Button
                        variant="light"
                        aria-label={`${routine.name} 복구`}
                        onClick={() => setRecovering(routine)}
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
      )}
      {recovering && (
        <Modal
          title="삭제한 루틴 복구"
          onClose={() => {
            if (!recoverBusy) setRecovering(null);
          }}
        >
          <Stack gap="md">
            <Text size="sm" style={{ overflowWrap: "anywhere" }}>
              ‘{recovering.name}’의 운동 순서와 계획 세트를 복구합니다.
            </Text>
            <Group grow>
              <Button
                variant="default"
                disabled={recoverBusy}
                onClick={() => setRecovering(null)}
              >
                취소
              </Button>
              <Button
                loading={recoverBusy}
                onClick={async () => {
                  setRecoverBusy(true);
                  const ok = await run(
                    () =>
                      store.recoverRoutine(
                        profile.ownerId,
                        recovering.id,
                        recovering.revision,
                      ),
                    "루틴을 복구했습니다.",
                  );
                  setRecoverBusy(false);
                  if (ok) setRecovering(null);
                }}
              >
                루틴 복구
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
      {deleting && (
        <Modal title="루틴 삭제" onClose={() => setDeleting(null)}>
          <Text size="sm" c="dimmed" my="sm">
            ‘{deleting.name}’을 루틴 목록에서 삭제합니다. 이 루틴으로 수행한
            운동 기록은 보존됩니다.
          </Text>
          <Group gap="sm">
            <Button onClick={() => setDeleting(null)} variant="default">
              취소
            </Button>
            <Button
              onClick={async () => {
                if (
                  await run(
                    () =>
                      store.tombstone(profile.ownerId, "routine", deleting.id),
                    "루틴을 삭제했습니다.",
                  )
                )
                  setDeleting(null);
              }}
              variant="filled"
              color="red"
            >
              루틴 삭제
            </Button>
          </Group>
        </Modal>
      )}
    </>
  );
}
