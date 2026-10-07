import {
  ActionIcon,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  NavLink,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { errorMessage } from "./domain/errors";
import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Dumbbell,
  Play,
  ChevronRight,
  Check,
  Plus,
  Settings2,
  ArrowUpRight,
} from "lucide-react";
import { useTraining } from "./context/training";
import { AccountPanel } from "./auth/account-panel";
import { CloudPanel } from "./auth/cloud-panel";
import {
  dateInZone,
  goals,
  splits,
  summarize,
  groups,
  type Exercise,
  type Profile,
  type Routine,
  type Session,
} from "./domain/models";
import { LibraryView, RoutinesView } from "./components/exercises";
import { SettingsView } from "./components/settings";
import { WorkoutView } from "./components/workout";
import { VolumeReport } from "./components/volume-report";
import { UpdateNotice } from "./components/update-notice";
import { RecordCoverage } from "./components/report-coverage";
import { DeletedSessionRecords } from "./components/deleted-session-records";
import { HistorySuggestion } from "./components/history-suggestion";
import { BottomNavigation } from "./components/navigation";
import { screens, type Screen } from "./components/screens";
import { Empty, type Run } from "./components/shared";
const storageKey = "lightweight.active-profile.v1";
function currentScreen(): Screen {
  const id = location.hash.slice(1);
  return screens.some((screen) => screen.id === id) ? (id as Screen) : "today";
}
function weekDates(timeZone: string, now: Date) {
  const today = dateInZone(now, timeZone);
  const date = new Date(`${today}T12:00:00Z`);
  const offset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const value = new Date(date);
    value.setUTCDate(date.getUTCDate() + i);
    return value.toISOString().slice(0, 10);
  });
}
function PreferenceSummary({ profile }: { profile: Profile }) {
  const p = profile.preferences;
  return (
    <Group gap={6}>
      {p ? (
        <>
          <Badge color="gray">
            {p.goal === "custom" ? p.customGoal : goals[p.goal]}
          </Badge>
          <Badge color="gray">
            주{" "}
            {p.weeklyMin === p.weeklyMax
              ? p.weeklyMin
              : `${p.weeklyMin}–${p.weeklyMax}`}
            회
          </Badge>
          <Badge color="gray">
            {p.split === "custom" ? p.customSplit : splits[p.split]}
          </Badge>
        </>
      ) : (
        <Text c="dimmed" size="sm">
          훈련 설정을 입력해주세요
        </Text>
      )}
    </Group>
  );
}
function SessionRow({
  session,
  inspect,
}: {
  session: Session;
  inspect: (s: Session) => void;
}) {
  return (
    <NavLink
      component="button"
      type="button"
      onClick={() => inspect(session)}
      label={session.name}
      description={`${session.localDate} · ${session.sets.filter((s) => s.completedAt).length}/${session.sets.length}세트 · ${session.status === "active" ? "진행 중" : session.status === "partial" ? "일부 완료" : "완료"}`}
      leftSection={
        <ThemeIcon variant="light" size={40} radius="lg">
          <Dumbbell size={20} />
        </ThemeIcon>
      }
      rightSection={<ChevronRight size={18} />}
    />
  );
}
function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <Paper p={{ base: "sm", sm: "lg" }} role="group" aria-label={label}>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Group gap={4} align="baseline" mt={8}>
        <Text
          fz={28}
          fw={650}
          lh={1.2}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Text>
        <Text c="dimmed" size="xs">
          {unit}
        </Text>
      </Group>
    </Paper>
  );
}
function TodayView({
  profile,
  routines,
  sessions,
  start,
  navigate,
  inspect,
  now,
}: {
  now: Date;
  profile: Profile;
  routines: Routine[];
  sessions: Session[];
  start: (id?: string) => Promise<void>;
  navigate: (s: Screen) => void;
  inspect: (s: Session) => void;
}) {
  const active = sessions.find((s) => s.status === "active");
  const dates = weekDates(profile.timeZone, now);
  const weekly = sessions.filter(
    (s) => s.localDate >= dates[0]! && s.localDate <= dates[6]!,
  );
  const stats = summarize(weekly);
  const today = dateInZone(now, profile.timeZone);
  return (
    <Stack gap="lg">
      <Paper
        p={{ base: "lg", sm: "xl" }}
        bg="dark.6"
        style={{ borderColor: "var(--mantine-color-dark-4)" }}
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Badge color="yellow">
              {active ? "WORKOUT IN PROGRESS" : "READY WHEN YOU ARE"}
            </Badge>
            <Dumbbell size={24} color="var(--mantine-color-yellow-4)" />
          </Group>
          <Box>
            <Title order={2} fz={{ base: 24, sm: 30 }}>
              {active ? active.name : "오늘의 운동, 시작해볼까요?"}
            </Title>
            <Text c="dark.1" size="sm" mt={6}>
              {active
                ? `${active.sets.filter((s) => s.completedAt).length}개 세트 완료 · 기록은 기기에 보관되어 있어요.`
                : "루틴을 불러오거나 자유롭게 기록하세요."}
            </Text>
          </Box>
          <PreferenceSummary profile={profile} />
          <Button
            fullWidth
            size="lg"
            h={52}
            leftSection={<Play size={19} />}
            rightSection={<ChevronRight size={18} />}
            onClick={() => (active ? inspect(active) : void start())}
          >
            {active ? "진행 중인 운동 이어하기" : "자유 운동 시작"}
          </Button>
        </Stack>
      </Paper>
      <Box>
        <Group justify="space-between" mb="sm">
          <Title order={2}>바로 시작하는 루틴</Title>
          <ActionIcon
            aria-label="루틴 관리"
            onClick={() => navigate("routines")}
          >
            <ArrowUpRight size={20} />
          </ActionIcon>
        </Group>
        {routines.length ? (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {routines.slice(0, 4).map((r) => (
              <Paper key={r.id} p={4}>
                <NavLink
                  component="button"
                  type="button"
                  onClick={() => void start(r.id)}
                  label={r.name}
                  description={`${r.exercises.length}개 운동 · ${r.exercises.reduce((n, e) => n + e.sets, 0)}세트 계획`}
                  rightSection={
                    <Play size={18} color="var(--mantine-color-yellow-4)" />
                  }
                />
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Button
            variant="light"
            fullWidth
            leftSection={<Plus size={18} />}
            onClick={() => navigate("routines")}
          >
            나의 첫 루틴 만들기
          </Button>
        )}
      </Box>
      {!profile.preferences && (
        <Alert icon={<Settings2 size={20} />} title="나에게 맞는 훈련 방향">
          <Text size="sm" c="dark.1" mb="sm">
            목표·횟수·분할을 설정하고 기록을 시작하세요.
          </Text>
          <Button variant="light" onClick={() => navigate("settings")}>
            훈련 설정 입력
          </Button>
        </Alert>
      )}
      <Box>
        <Group justify="space-between" mb="sm">
          <Title order={2}>이번 주</Title>
          <Text c="dimmed" size="xs">
            {profile.preferences
              ? `목표 ${profile.preferences.weeklyMin}–${profile.preferences.weeklyMax}회`
              : "월요일 – 일요일"}
          </Text>
        </Group>
        <SimpleGrid cols={3} spacing="sm">
          <Stat label="운동 기록" value={stats.sessionCount} unit="회" />
          <Stat label="완료 본세트" value={stats.workingRows} unit="개" />
          <Stat label="운동한 날" value={stats.days} unit="일" />
        </SimpleGrid>
      </Box>
      <Paper>
        <SimpleGrid cols={7} spacing={4}>
          {dates.map((date, i) => {
            const done = weekly.some(
              (s) =>
                s.localDate === date &&
                s.sets.some((set) => set.kind === "working" && set.completedAt),
            );
            return (
              <Stack key={date} align="center" gap={8}>
                <Text c={date === today ? "yellow.4" : "dimmed"} size="xs">
                  {["월", "화", "수", "목", "금", "토", "일"][i]}
                </Text>
                <ThemeIcon
                  size={34}
                  radius="xl"
                  variant={done ? "filled" : "light"}
                  color={date === today || done ? "yellow" : "gray"}
                  aria-label={`${date}${done ? " 운동 기록 있음" : ""}`}
                >
                  {done ? (
                    <Check size={17} />
                  ) : (
                    <Text size="sm" c="inherit">
                      {Number(date.slice(-2))}
                    </Text>
                  )}
                </ThemeIcon>
              </Stack>
            );
          })}
        </SimpleGrid>
      </Paper>
      <HistorySuggestion
        profile={profile}
        routines={routines}
        sessions={sessions}
        now={now}
        start={start}
      />
      <Paper>
        <Group justify="space-between" mb="md">
          <Title order={2}>최근 운동</Title>
          <Button
            variant="subtle"
            size="compact-md"
            rightSection={<ChevronRight size={15} />}
            onClick={() => navigate("reports")}
          >
            모두 보기
          </Button>
        </Group>
        {sessions.filter((s) => s.status !== "active").length ? (
          <Stack gap={4}>
            {sessions
              .filter((s) => s.status !== "active")
              .slice(0, 4)
              .map((s) => (
                <SessionRow key={s.id} session={s} inspect={inspect} />
              ))}
          </Stack>
        ) : (
          <Empty title="첫 기록을 기다리고 있어요">
            운동을 마치면 이곳에 기록이 쌓입니다.
          </Empty>
        )}
      </Paper>
    </Stack>
  );
}
function ReportsView({
  profile,
  sessions,
  inspect,
  now,
  settings,
  today,
  run,
}: {
  now: Date;
  profile: Profile;
  sessions: Session[];
  inspect: (s: Session) => void;
  settings: () => void;
  today: () => void;
  run: Run;
}) {
  const dates = weekDates(profile.timeZone, now);
  const stats = summarize(
    sessions.filter(
      (s) => s.localDate >= dates[0]! && s.localDate <= dates[6]!,
    ),
  );
  const maximum = Math.max(1, ...Object.values(stats.byGroup));
  return (
    <Stack gap="lg">
      <SimpleGrid cols={3} spacing="sm">
        <Stat label="이번 주 운동" value={stats.sessionCount} unit="회" />
        <Stat label="완료 본세트" value={stats.workingRows} unit="개" />
        <Stat label="계획 본세트" value={stats.plannedRows} unit="개" />
      </SimpleGrid>
      <RecordCoverage
        profile={profile}
        sessions={sessions}
        now={now}
        inspect={inspect}
        settings={settings}
        today={today}
      />
      <VolumeReport profile={profile} sessions={sessions} now={now} />
      <Paper>
        <Stack gap="md">
          <Title order={2}>운동 분류별 기록</Title>
          {groups.map((group) => (
            <Group key={group} wrap="nowrap">
              <Text w={40} size="sm">
                {group}
              </Text>
              <Progress
                flex={1}
                value={(stats.byGroup[group] / maximum) * 100}
                aria-label={`${group} 완료 본세트 기록`}
                size={8}
                radius="xl"
              />
              <Text w={24} ta="right" size="sm">
                {stats.byGroup[group]}
              </Text>
            </Group>
          ))}
          <Text size="xs" c="dimmed">
            완료한 본세트 입력 행 수입니다. 좌우 별도 입력은 각각 셉니다. 근육별
            자극량이나 운동 효과를 평가하는 수치는 아닙니다.
          </Text>
        </Stack>
      </Paper>
      <Paper>
        <Title order={2} mb="md">
          전체 운동 기록
        </Title>
        {sessions.length ? (
          <Stack gap={4}>
            {sessions.map((s) => (
              <SessionRow key={s.id} session={s} inspect={inspect} />
            ))}
          </Stack>
        ) : (
          <Empty title="아직 기록이 없어요">
            오늘 화면에서 자유 운동을 시작해보세요.
          </Empty>
        )}
      </Paper>
      <DeletedSessionRecords ownerId={profile.ownerId} run={run} />
    </Stack>
  );
}
export default function App() {
  const { db, store, accountId } = useTraining();
  const [ownerId, setOwnerId] = useState(() => {
    if (accountId) return accountId;
    try {
      const prior = localStorage.getItem(storageKey);
      return prior && /^[0-9a-f-]{36}$/.test(prior)
        ? prior
        : crypto.randomUUID();
    } catch {
      return crypto.randomUUID();
    }
  });
  const [bootError, setBootError] = useState("");
  const [readyOwner, setReadyOwner] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const [screen, setScreen] = useState<Screen>(currentScreen);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [screen, sessionId]);
  const [notice, setNotice] = useState<{
    message: string;
    error: boolean;
  } | null>(null);
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(navigator.onLine);
  const workspace = useLiveQuery(() => store.workspace(ownerId), [ownerId]);
  const profiles = useLiveQuery(() => db.profiles.toArray(), []) ?? [];
  useEffect(() => {
    let cancelled = false;
    void store
      .ensureProfile(ownerId)
      .then(() => {
        if (!accountId) localStorage.setItem(storageKey, ownerId);
        if (!cancelled) setReadyOwner(ownerId);
      })
      .catch((error: unknown) => {
        if (!cancelled) setBootError(errorMessage(error));
      });
    return () => {
      cancelled = true;
    };
  }, [ownerId, accountId, store]);
  useEffect(() => {
    const change = () => {
      if (!screens.some((item) => `#${item.id}` === location.hash)) return;
      const next = currentScreen();
      setScreen(next);
      if (next !== "today") setSessionId(null);
    };
    const connect = () => setOnline(navigator.onLine);
    window.addEventListener("hashchange", change);
    window.addEventListener("online", connect);
    window.addEventListener("offline", connect);
    return () => {
      window.removeEventListener("hashchange", change);
      window.removeEventListener("online", connect);
      window.removeEventListener("offline", connect);
    };
  }, []);
  useEffect(() => {
    if (!notice || notice.error) return;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  const run: Run = async (action, message) => {
    setPending((n) => n + 1);
    try {
      await action();
      if (message) setNotice({ message, error: false });
      else setNotice((prior) => (prior?.error ? null : prior));
      return true;
    } catch (error) {
      setNotice({ message: errorMessage(error), error: true });
      return false;
    } finally {
      setPending((n) => n - 1);
    }
  };
  function navigate(next: Screen) {
    setSessionId(null);
    setScreen(next);
    if (location.hash !== `#${next}`) location.hash = next;
  }
  async function start(routineId?: string) {
    await run(async () => {
      const session = await store.startSession(ownerId, routineId);
      navigate("today");
      setSessionId(session.id);
    });
  }
  async function addExercise(exercise: Exercise) {
    await run(async () => {
      const session = await store.startSession(ownerId);
      await store.addExercise(ownerId, session.id, exercise);
      navigate("today");
      setSessionId(session.id);
    });
  }
  function inspect(session: Session) {
    setSessionId(session.id);
  }
  function switchProfile(id: string) {
    if (pending > 0) return;
    setSessionId(null);
    setOwnerId(id);
  }
  async function createProfile() {
    if (pending > 0) return;
    await run(async () => {
      const id = crypto.randomUUID();
      await store.ensureProfile(id);
      switchProfile(id);
    }, "새 로컬 프로필을 만들었습니다.");
  }
  if (bootError)
    return (
      <Container size="sm" py={80}>
        <Stack align="center">
          <Dumbbell size={32} />
          <Title order={1}>기기 저장소를 열지 못했습니다</Title>
          <Alert color="red" role="alert">
            {bootError}
          </Alert>
          <Text c="dimmed">
            브라우저의 저장소 허용 설정을 확인해주세요. 기존 기록을 삭제하지
            않고 다시 시도할 수 있습니다.
          </Text>
          <Button onClick={() => location.reload()}>다시 시도</Button>
        </Stack>
      </Container>
    );
  if (
    readyOwner !== ownerId ||
    !workspace?.profile ||
    workspace.profile.ownerId !== ownerId
  )
    return (
      <Stack
        component="main"
        align="center"
        justify="center"
        mih="100dvh"
        role="status"
      >
        <Loader />
        <Text>내 훈련 기록을 불러오는 중…</Text>
      </Stack>
    );
  const { profile, routines, sessions } = workspace;
  const session = sessions.find((record) => record.id === sessionId);
  const title = screens.find((item) => item.id === screen)!.label;
  return (
    <Box mih="100dvh" bg="dark.9">
      <Button component="a" href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </Button>
      <Box
        component="header"
        pt="max(16px, env(safe-area-inset-top))"
        pb="md"
        style={{ borderBottom: "1px solid var(--mantine-color-dark-5)" }}
      >
        <Container size={1080}>
          <Group justify="space-between" wrap="nowrap">
            <Anchor
              href="#today"
              onClick={() => navigate("today")}
              c="dark.0"
              underline="never"
            >
              <Group gap={9} wrap="nowrap">
                <ThemeIcon radius="lg" size={34}>
                  <Dumbbell size={20} />
                </ThemeIcon>
                <Text fw={650} fz={21} lts={-0.7}>
                  lightweight
                </Text>
              </Group>
            </Anchor>
            <Group gap={8} wrap="nowrap">
              <Badge
                color={pending ? "yellow" : "gray"}
                size="sm"
                role="status"
              >
                {pending ? "저장 중…" : online ? "기기 저장" : "오프라인"}
              </Badge>
              <Avatar
                component="button"
                type="button"
                size={44}
                radius="xl"
                color="yellow"
                variant="light"
                aria-label={`${profile.name} 설정`}
                onClick={() => navigate("settings")}
                style={{ cursor: "pointer", border: 0 }}
              >
                {profile.name.slice(0, 1)}
              </Avatar>
            </Group>
          </Group>
        </Container>
      </Box>
      <Container
        size={1080}
        component="main"
        id="main-content"
        className="app-content"
        tabIndex={-1}
        pt={{ base: "lg", sm: "xl" }}
      >
        <UpdateNotice
          active={sessions.some((s) => s.status === "active")}
          busy={pending > 0}
          resume={() => {
            const active = sessions.find((s) => s.status === "active");
            if (active) inspect(active);
          }}
        />
        <Group justify="space-between" mb="lg">
          <Box>
            <Text c="dimmed" size="xs" mb={6}>
              {new Intl.DateTimeFormat("ko", {
                timeZone: profile.timeZone,
                month: "long",
                day: "numeric",
                weekday: "long",
              }).format(now)}
            </Text>
            <Title
              order={1}
              ref={headingRef}
              tabIndex={-1}
              style={{ outline: "none" }}
            >
              {session ? "운동 기록" : screen === "today" ? "오늘" : title}
            </Title>
          </Box>
          {screen === "today" && !session && (
            <Text c="dark.1" size="sm">
              {profile.name}
            </Text>
          )}
        </Group>
        {session ? (
          <WorkoutView
            key={session.id}
            session={session}
            run={run}
            onBack={() => setSessionId(null)}
            onRepeat={setSessionId}
            history={workspace.sessions}
          />
        ) : screen === "today" ? (
          <TodayView
            now={now}
            profile={profile}
            routines={routines}
            sessions={sessions}
            start={start}
            navigate={navigate}
            inspect={inspect}
          />
        ) : screen === "library" ? (
          <LibraryView onAdd={addExercise} />
        ) : screen === "routines" ? (
          <RoutinesView
            profile={profile}
            routines={routines}
            run={run}
            start={start}
          />
        ) : screen === "reports" ? (
          <ReportsView
            run={run}
            now={now}
            profile={profile}
            sessions={sessions}
            inspect={inspect}
            settings={() => navigate("settings")}
            today={() => navigate("today")}
          />
        ) : (
          <Stack gap="lg">
            <SettingsView
              key={`${profile.ownerId}-${profile.revision}`}
              profile={profile}
              profiles={profiles}
              run={run}
              switchProfile={switchProfile}
              createProfile={createProfile}
              busy={pending > 0}
            />
            <AccountPanel
              busy={pending > 0 || sessions.some((s) => s.status === "active")}
            />
            <CloudPanel
              busy={pending > 0 || sessions.some((s) => s.status === "active")}
              run={run}
            />
          </Stack>
        )}
        <Divider mt="xl" mb="md" />
        <Text size="xs" c="dimmed" ta="center">
          LIGHTWEIGHT · 오늘의 기록을, 내일의 나에게.
        </Text>
      </Container>
      <BottomNavigation screen={screen} navigate={navigate} />
      <Stack className="notice-stack" gap="sm">
        {notice && (
          <Alert
            color={notice.error ? "red" : "yellow"}
            role={notice.error ? "alert" : "status"}
            withCloseButton
            closeButtonLabel="알림 닫기"
            onClose={() => setNotice(null)}
          >
            {notice.message}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
