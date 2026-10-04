import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  FileButton,
  Group,
  Select,
  Paper,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useRef, useState, type FormEvent } from "react";
import { Download, Upload, Plus, ShieldCheck } from "lucide-react";
import {
  goals,
  splits,
  equipmentOptions,
  profileSchema,
  type Profile,
  type Backup,
  type Preferences,
} from "../domain/models";
import { useTraining } from "../context/training";
import { Modal, type Run } from "./shared";

function ProfileForm({ profile, run }: { profile: Profile; run: Run }) {
  const { store } = useTraining();
  const p = profile.preferences;
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState<Preferences["goal"] | "">(p?.goal ?? "");
  const [customGoal, setCustomGoal] = useState(p?.customGoal ?? "");
  const [split, setSplit] = useState<Preferences["split"] | "">(p?.split ?? "");
  const [customSplit, setCustomSplit] = useState(p?.customSplit ?? "");
  const [min, setMin] = useState(p ? String(p.weeklyMin) : "");
  const [max, setMax] = useState(p ? String(p.weeklyMax) : "");
  const [minutes, setMinutes] = useState(p?.minutes ? String(p.minutes) : "");
  const [equipment, setEquipment] = useState<Preferences["equipment"]>(
    p?.equipment ?? [],
  );
  const [unit, setUnit] = useState(profile.unit);
  const [timeZone, setTimeZone] = useState(profile.timeZone);
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    await run(async () => {
      const input = profileSchema.parse({
        ...profile,
        name,
        unit,
        timeZone,
        preferences: {
          goal,
          customGoal,
          weeklyMin: Number(min),
          weeklyMax: Number(max),
          split,
          customSplit,
          minutes: minutes ? Number(minutes) : null,
          equipment,
        },
      });
      await store.saveProfile(profile.ownerId, input);
    }, "훈련 설정을 이 기기에 저장했습니다.");
    setSaving(false);
  }
  return (
    <Stack component="form" onSubmit={submit} gap="lg">
      <TextInput
        label="프로필 이름"
        aria-label="프로필 이름"
        value={name}
        maxLength={40}
        required
        onChange={(e) => setName(e.target.value)}
      />
      <Radio.Group
        name="goal"
        label="운동 목표"
        value={goal}
        onChange={(value) => setGoal(value as Preferences["goal"])}
      >
        <SimpleGrid cols={2} mt="sm" spacing="sm">
          {Object.entries(goals).map(([value, label]) => (
            <Paper key={value} p="sm" bg={goal === value ? "dark.6" : "dark.8"}>
              <Radio
                value={value}
                label={label}
                required
                styles={{
                  body: { alignItems: "center", minHeight: 44 },
                  label: {
                    paddingBlock: 10,
                    paddingInlineStart: 8,
                    wordBreak: "keep-all",
                  },
                }}
              />
            </Paper>
          ))}
        </SimpleGrid>
      </Radio.Group>
      {goal === "custom" && (
        <TextInput
          label="나의 목표"
          required
          value={customGoal}
          maxLength={100}
          onChange={(e) => setCustomGoal(e.target.value)}
          placeholder="예: 등과 하체의 근력 늘리기"
        />
      )}
      <Box>
        <Text size="sm" fw={500} mb="sm">
          주당 운동 횟수
        </Text>
        <SimpleGrid cols={2} spacing="sm">
          <Select
            label="최소 횟수"
            required
            value={min || null}
            placeholder="선택"
            onChange={(value) => setMin(value ?? "")}
            data={[
              ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
                value: String(n),
                label: `${n}회`,
              })),
            ]}
          />
          <Select
            label="최대 횟수"
            required
            value={max || null}
            placeholder="선택"
            onChange={(value) => setMax(value ?? "")}
            data={[
              ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
                value: String(n),
                label: `${n}회`,
              })),
            ]}
          />
        </SimpleGrid>
        <Text size="xs" c="dimmed" mt={8}>
          같은 횟수로 고정하거나 범위를 설정할 수 있어요.
        </Text>
      </Box>
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
        <Select
          label="분할 방법"
          aria-label="분할 방법"
          required
          value={split || null}
          placeholder="선택"
          onChange={(value) => setSplit((value ?? "") as Preferences["split"])}
          data={[
            ...Object.entries(splits).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <TextInput
          label="운동 시간 · 선택"
          type="number"
          min={10}
          max={240}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="분"
        />
      </SimpleGrid>
      {split === "custom" && (
        <TextInput
          label="나의 분할"
          required
          value={customSplit}
          maxLength={100}
          onChange={(e) => setCustomSplit(e.target.value)}
          placeholder="예: 상체 / 하체 / 전신"
        />
      )}
      <Checkbox.Group
        label="사용할 수 있는 장비 · 선택"
        value={equipment}
        onChange={(value) => setEquipment(value as Preferences["equipment"])}
      >
        <SimpleGrid cols={2} mt="sm" spacing="sm">
          {equipmentOptions.map((item) => (
            <Checkbox
              key={item}
              value={item}
              label={item}
              styles={{
                body: { alignItems: "center", minHeight: 44 },
                label: { paddingBlock: 10 },
              }}
            />
          ))}
        </SimpleGrid>
      </Checkbox.Group>
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
        <Select
          label="중량 단위"
          value={unit}
          onChange={(value) => {
            if (value) setUnit(value as Profile["unit"]);
          }}
          data={["kg", "lb"]}
        />
        <TextInput
          label="기록 시간대"
          value={timeZone}
          required
          onChange={(e) => setTimeZone(e.target.value)}
          placeholder="Asia/Seoul"
        />
      </SimpleGrid>
      <Text size="xs" c="dimmed">
        바뀐 설정은 다음 운동부터 적용됩니다. 지난 기록의 단위와 당시 설정은
        보존됩니다.
      </Text>
      <Button disabled={saving} type="submit">
        {saving ? "저장 중…" : "훈련 설정 저장"}
      </Button>
    </Stack>
  );
}

export function SettingsView({
  profile,
  profiles,
  run,
  switchProfile,
  createProfile,
  busy = false,
}: {
  profile: Profile;
  profiles: Profile[];
  run: Run;
  switchProfile: (id: string) => void;
  createProfile: () => Promise<void>;
  busy?: boolean;
}) {
  const { store, accountId } = useTraining();
  const resetFile = useRef<(() => void) | null>(null);
  const [backup, setBackup] = useState<Backup | null>(null);
  const [fileError, setFileError] = useState("");
  const [restoring, setRestoring] = useState(false);
  async function exportBackup() {
    await run(async () => {
      const data = await store.backup(profile.ownerId);
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `lightweight-${data.exportedAt.slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, "백업 파일을 만들었습니다. 안전한 곳에 보관해주세요.");
  }
  async function importFile(file?: File) {
    if (!file) return;
    setFileError("");
    setBackup(null);
    if (file.size > 10 * 1024 * 1024) {
      setFileError("10MB 이하의 백업 파일을 선택해주세요.");
      return;
    }
    try {
      setBackup(store.parseBackup(await file.text()));
    } catch {
      setFileError(
        "백업 파일을 읽지 못했습니다. 파일 형식을 확인한 뒤 다시 선택해주세요.",
      );
    }
  }
  return (
    <Stack gap="lg">
      <Paper>
        <Group justify="space-between" mb="lg">
          <Title order={2}>나에게 맞는 훈련</Title>
          <Badge>프로필별 설정</Badge>
        </Group>
        <ProfileForm
          key={JSON.stringify(profile)}
          profile={profile}
          run={run}
        />
      </Paper>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {!accountId && (
          <Paper>
            <Stack gap="md">
              <Title order={2}>기기 프로필</Title>
              <Text c="dimmed" size="sm">
                각 프로필의 설정·루틴·기록을 따로 관리합니다. 이 기기에서 누구나
                전환할 수 있어요.
              </Text>
              <Select
                label="현재 프로필"
                value={profile.ownerId}
                disabled={busy || restoring}
                searchable
                nothingFoundMessage="프로필을 찾을 수 없어요"
                onChange={(value) => {
                  if (value && !busy && !restoring) switchProfile(value);
                }}
                data={profiles.map((item) => ({
                  value: item.ownerId,
                  label: item.name,
                }))}
              />
              <Button
                variant="light"
                leftSection={<Plus size={18} />}
                disabled={busy || restoring}
                onClick={() => void createProfile()}
              >
                새 프로필 만들기
              </Button>
            </Stack>
          </Paper>
        )}
        <Paper>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon variant="light" size={38}>
                <ShieldCheck size={21} />
              </ThemeIcon>
              <Title order={2}>내 기록 보관하기</Title>
            </Group>
            <Text size="sm" c="dimmed">
              현재 기록은 이 브라우저의 기기에 저장됩니다. 브라우저 데이터
              삭제나 기기 변경에 대비해 백업해주세요.
            </Text>
            <Button
              variant="default"
              leftSection={<Download size={18} />}
              onClick={() => void exportBackup()}
            >
              현재 프로필 백업
            </Button>
            <FileButton
              resetRef={resetFile}
              onChange={(file) => {
                // Clear the input after every selection so the same file can be retried.
                resetFile.current?.();
                void importFile(file ?? undefined);
              }}
              accept="application/json,.json"
              inputProps={{ "aria-label": "백업 파일 선택" }}
            >
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  leftSection={<Upload size={18} />}
                >
                  백업 가져오기
                </Button>
              )}
            </FileButton>
            {fileError && (
              <Alert color="red" role="alert">
                {fileError}
              </Alert>
            )}
            <Text size="xs" c="dimmed">
              백업에는 개인 기록이 들어 있습니다. 공유할 때 내용을 확인해주세요.
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>
      <Alert title="기기 저장 모드" color="gray">
        <Text size="sm" c="dark.1">
          {accountId
            ? "이 계정의 기록을 기기에 저장합니다. 클라우드 저장 상태는 계정 연결 영역에서 확인하세요."
            : "기기 프로필 전환은 인증 기능이 아닙니다. 계정 로그인을 사용하면 계정별 저장소를 별도로 사용합니다."}
        </Text>
      </Alert>
      {backup && (
        <Modal
          title="백업을 복원할까요?"
          onClose={() => {
            if (!restoring) setBackup(null);
          }}
        >
          <Stack gap="md">
            <Text fw={600}>
              {backup.profile.name}의 백업 · {backup.exportedAt.slice(0, 10)}
            </Text>
            <Group>
              <Badge>
                루틴 {backup.routines.filter((item) => !item.deletedAt).length}
                개
              </Badge>
              <Badge>
                운동 {backup.sessions.filter((item) => !item.deletedAt).length}
                개
              </Badge>
            </Group>
            <Text size="sm" c="dark.1">
              현재 프로필의 설정·루틴·기록을 이 백업으로 교체합니다. 다른 로컬
              프로필은 유지됩니다. 먼저 현재 기록을 백업하는 것을 권장합니다.
            </Text>
            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
              <Button
                variant="default"
                disabled={restoring}
                onClick={() => setBackup(null)}
              >
                취소
              </Button>
              <Button
                disabled={restoring}
                onClick={async () => {
                  setRestoring(true);
                  const ok = await run(
                    () => store.restore(profile.ownerId, backup),
                    "백업을 복원했습니다.",
                  );
                  if (ok) setBackup(null);
                  setRestoring(false);
                }}
              >
                {restoring ? "복원 중…" : "현재 프로필에 복원"}
              </Button>
            </SimpleGrid>
          </Stack>
        </Modal>
      )}
    </Stack>
  );
}
