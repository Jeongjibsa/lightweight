import { UnstyledButton } from "@mantine/core";
import { errorMessage } from "./domain/errors";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useRegisterSW } from "virtual:pwa-register/react";
import {
  Activity,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Settings2,
  Dumbbell,
  ArrowUpRight,
  Play,
  ChevronRight,
  Check,
  X,
  RefreshCw,
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
import { HistorySuggestion } from "./components/history-suggestion";
import { Empty, type Run } from "./components/shared";

const screens = [
  { id: "today", label: "오늘", icon: Activity },
  { id: "library", label: "운동 탐색", icon: BookOpen },
  { id: "routines", label: "나의 루틴", icon: CalendarDays },
  { id: "reports", label: "리포트", icon: ChartNoAxesCombined },
  { id: "settings", label: "설정", icon: Settings2 },
] as const;
type Screen = (typeof screens)[number]["id"];
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
    <div className="chips summary-chips">
      {p ? (
        <>
          <span className="chip">
            {p.goal === "custom" ? p.customGoal : goals[p.goal]}
          </span>
          <span className="chip">
            주{" "}
            {p.weeklyMin === p.weeklyMax
              ? p.weeklyMin
              : `${p.weeklyMin}–${p.weeklyMax}`}
            회
          </span>
          <span className="chip">
            {p.split === "custom" ? p.customSplit : splits[p.split]}
          </span>
        </>
      ) : (
        <span className="chip">훈련 설정을 입력해주세요</span>
      )}
    </div>
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
  navigate: (screen: Screen) => void;
  inspect: (session: Session) => void;
}) {
  const active = sessions.find((session) => session.status === "active");
  const dates = weekDates(profile.timeZone, now);
  const weekly = sessions.filter(
    (session) =>
      session.localDate >= dates[0]! && session.localDate <= dates[6]!,
  );
  const stats = summarize(weekly);
  const today = dateInZone(now, profile.timeZone);
  const recent = sessions
    .filter((session) => session.status !== "active")
    .slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ONE SESSION AT A TIME</p>
          <h2>
            꾸준히 쌓이는 기록,
            <br />
            나의 훈련이 되다.
          </h2>
          <p>
            오늘의 운동을 가볍게 시작하고
            <br className="mobile-break" /> 변화의 과정을 남겨보세요.
          </p>
          <PreferenceSummary profile={profile} />
          <UnstyledButton
            className="button dark"
            onClick={() => (active ? inspect(active) : void start())}
          >
            <Play size={17} />
            {active ? "진행 중인 운동 이어하기" : "자유 운동 시작"}
            <ArrowUpRight size={18} />
          </UnstyledButton>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="barbell">
            <i />
            <i />
            <b />
            <i />
            <i />
          </div>
          <span className="art-caption">
            YOUR PACE.
            <br />
            YOUR PROGRESS.
          </span>
        </div>
      </section>
      {!profile.preferences && (
        <UnstyledButton
          className="setup-banner"
          onClick={() => navigate("settings")}
        >
          <Settings2 size={22} />
          <span>
            <strong>먼저 나의 훈련 방향을 정해볼까요?</strong>
            <small>목표, 운동 횟수, 분할을 언제든 바꿀 수 있어요.</small>
          </span>
          <ChevronRight size={20} />
        </UnstyledButton>
      )}
      <div className="stats-grid">
        <section className="card stat">
          <span>이번 주 운동</span>
          <strong>
            {stats.sessionCount}
            <small>회</small>
          </strong>
          <p>
            {profile.preferences
              ? `목표 ${profile.preferences.weeklyMin}–${profile.preferences.weeklyMax}회`
              : "나의 목표를 설정해보세요"}
          </p>
        </section>
        <section className="card stat">
          <span>완료한 본세트 기록</span>
          <strong>
            {stats.workingRows}
            <small>개</small>
          </strong>
          <p>준비 세트와 미완료 세트 제외</p>
        </section>
        <section className="card stat">
          <span>운동한 날</span>
          <strong>
            {stats.days}
            <small>일</small>
          </strong>
          <p>이번 주 월요일부터 일요일</p>
        </section>
      </div>
      <HistorySuggestion
        profile={profile}
        routines={routines}
        sessions={sessions}
        now={now}
        start={start}
      />
      <div className="today-grid">
        <section className="card">
          <div className="section-heading">
            <h2>이번 주의 흐름</h2>
            <span className="badge">
              {dates[0]!.slice(5).replace("-", ".")} –{" "}
              {dates[6]!.slice(5).replace("-", ".")}
            </span>
          </div>
          <div className="week-grid">
            {dates.map((date, i) => {
              const done = weekly.some(
                (session) =>
                  session.localDate === date &&
                  session.sets.some(
                    (set) => set.kind === "working" && set.completedAt,
                  ),
              );
              return (
                <div
                  className={`day ${date === today ? "today" : ""} ${done ? "done" : ""}`}
                  key={date}
                >
                  <span>{["월", "화", "수", "목", "금", "토", "일"][i]}</span>
                  <strong>
                    {done ? <Check size={18} /> : Number(date.slice(-2))}
                  </strong>
                </div>
              );
            })}
          </div>
          <div className="section-heading sub-heading">
            <h3>최근 운동</h3>
            <UnstyledButton
              className="text-button"
              onClick={() => navigate("reports")}
            >
              모두 보기 <ChevronRight size={15} />
            </UnstyledButton>
          </div>
          {recent.length ? (
            <div className="history-list">
              {recent.map((session) => (
                <UnstyledButton
                  className="history-item"
                  key={session.id}
                  onClick={() => inspect(session)}
                >
                  <span className="history-icon">
                    <Dumbbell size={20} />
                  </span>
                  <span>
                    <strong>{session.name}</strong>
                    <small>
                      {session.localDate} ·{" "}
                      {session.sets.filter((set) => set.completedAt).length}개
                      세트 완료
                    </small>
                  </span>
                  <ChevronRight size={18} />
                </UnstyledButton>
              ))}
            </div>
          ) : (
            <Empty title="첫 기록을 기다리고 있어요">
              운동을 마치면 이곳에 기록이 쌓입니다.
            </Empty>
          )}
        </section>
        <section className="card">
          <div className="section-heading">
            <h2>바로 시작하는 루틴</h2>
            <UnstyledButton
              className="icon-button"
              aria-label="루틴 관리"
              onClick={() => navigate("routines")}
            >
              <ArrowUpRight size={20} />
            </UnstyledButton>
          </div>
          {routines.slice(0, 3).map((routine) => (
            <UnstyledButton
              className="routine-shortcut"
              key={routine.id}
              onClick={() => void start(routine.id)}
            >
              <span>
                <strong>{routine.name}</strong>
                <small>
                  {routine.exercises.length}개 운동 ·{" "}
                  {routine.exercises.reduce((n, entry) => n + entry.sets, 0)}
                  세트 계획
                </small>
              </span>
              <Play size={17} />
            </UnstyledButton>
          ))}
          {!routines.length && (
            <Empty title="나만의 루틴을 만들어보세요">
              운동 순서와 계획 세트를 저장해두면 다음 운동을 쉽게 시작할 수
              있어요.
            </Empty>
          )}
          <UnstyledButton
            className="button secondary full"
            onClick={() => navigate("routines")}
          >
            나의 루틴 관리
          </UnstyledButton>
        </section>
      </div>
    </>
  );
}
function ReportsView({
  profile,
  sessions,
  inspect,
  now,
}: {
  now: Date;
  profile: Profile;
  sessions: Session[];
  inspect: (session: Session) => void;
}) {
  const dates = weekDates(profile.timeZone, now);
  const weekly = sessions.filter(
    (session) =>
      session.localDate >= dates[0]! && session.localDate <= dates[6]!,
  );
  const stats = summarize(weekly);
  const maximum = Math.max(1, ...Object.values(stats.byGroup));
  return (
    <>
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WEEKLY RECORD</p>
            <h2>기록으로 돌아보는 이번 주</h2>
          </div>
          <span className="badge">{dates[0]}부터</span>
        </div>
        <PreferenceSummary profile={profile} />
        <div className="report-numbers">
          <div>
            <strong>{stats.sessionCount}</strong>
            <span>운동 기록</span>
          </div>
          <div>
            <strong>{stats.workingRows}</strong>
            <span>완료 본세트 기록</span>
          </div>
          <div>
            <strong>{stats.plannedRows}</strong>
            <span>계획 본세트 기록</span>
          </div>
        </div>
        <p className="muted">
          {!stats.workingRows
            ? "완료한 본세트가 생기면 기록을 요약해드릴게요."
            : profile.preferences &&
                stats.sessionCount >= profile.preferences.weeklyMin
              ? "이번 주 설정한 최소 운동 횟수에 도달했어요."
              : "완료한 기록을 차근차근 쌓고 있어요."}
        </p>
      </section>
      <div className="report-grid">
        <section className="card">
          <h2>운동 분류별 기록</h2>
          <div className="group-bars">
            {groups.map((group) => (
              <div className="group-bar" key={group}>
                <span>{group}</span>
                <progress
                  aria-label={`${group} 완료 본세트 기록`}
                  max={maximum}
                  value={stats.byGroup[group]}
                />
                <strong>{stats.byGroup[group]}</strong>
              </div>
            ))}
          </div>
          <p className="hint">
            운동에 지정한 분류별 완료 본세트 입력 행 수입니다. 좌우를 따로
            입력한 행은 각각 셉니다. 근육별 자극량이나 운동 효과를 평가하는
            수치는 아닙니다.
          </p>
        </section>
        <section className="card subtle">
          <p className="eyebrow">EVIDENCE FIRST</p>
          <h2>기록량을 읽는 기준</h2>
          <p className="muted">
            볼륨은 완료한 세트의 중량과 반복으로 계산한 기록량입니다. 같은
            조건의 추이를 참고하세요. 개인별 권장 운동량은 노력·불편감 등 추가
            자료와 근거 검토를 연결한 뒤 제공할 예정입니다.
          </p>
        </section>
      </div>
      <VolumeReport profile={profile} sessions={sessions} now={now} />
      <section className="card">
        <h2>전체 운동 기록</h2>
        {sessions.length ? (
          <div className="history-list">
            {sessions.map((session) => (
              <UnstyledButton
                className="history-item"
                key={session.id}
                onClick={() => inspect(session)}
              >
                <span className="history-icon">
                  <Dumbbell size={20} />
                </span>
                <span>
                  <strong>{session.name}</strong>
                  <small>
                    {session.localDate} ·{" "}
                    {session.status === "active"
                      ? "진행 중"
                      : session.status === "partial"
                        ? "일부 완료"
                        : "완료"}{" "}
                    · {session.sets.filter((set) => set.completedAt).length}/
                    {session.sets.length}세트 기록
                  </small>
                </span>
                <ChevronRight size={18} />
              </UnstyledButton>
            ))}
          </div>
        ) : (
          <Empty title="아직 기록이 없어요">
            오늘 화면에서 자유 운동을 시작해보세요.
          </Empty>
        )}
      </section>
    </>
  );
}
function UpdateNotice({ active }: { active: boolean }) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div className="update-notice" role="status">
      <RefreshCw size={18} />
      <span>
        {active
          ? "새 버전이 준비됐어요. 진행 중인 운동을 마친 후 적용할 수 있습니다."
          : "새 버전이 준비됐어요."}
      </span>
      <UnstyledButton
        className="button secondary"
        disabled={active}
        onClick={() => void updateServiceWorker(true)}
      >
        업데이트
      </UnstyledButton>
      <UnstyledButton
        className="icon-button"
        aria-label="업데이트 안내 닫기"
        onClick={() => setNeedRefresh(false)}
      >
        <X size={18} />
      </UnstyledButton>
    </div>
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
    setSessionId(null);
    setOwnerId(id);
  }
  async function createProfile() {
    await run(async () => {
      const id = crypto.randomUUID();
      await store.ensureProfile(id);
      switchProfile(id);
    }, "새 로컬 프로필을 만들었습니다.");
  }
  if (bootError)
    return (
      <main className="boot-screen">
        <Dumbbell size={32} />
        <h1>기기 저장소를 열지 못했습니다</h1>
        <p role="alert">{bootError}</p>
        <p>
          브라우저의 저장소 허용 설정을 확인해주세요. 기존 기록을 삭제하지 않고
          다시 시도할 수 있습니다.
        </p>
        <UnstyledButton
          className="button primary"
          onClick={() => location.reload()}
        >
          다시 시도
        </UnstyledButton>
      </main>
    );
  if (readyOwner !== ownerId || !workspace?.profile)
    return (
      <main className="boot-screen" role="status">
        <Dumbbell size={32} />
        <p>내 훈련 기록을 불러오는 중…</p>
      </main>
    );
  const { profile, routines, sessions } = workspace;
  const session = sessions.find((record) => record.id === sessionId);
  const title = screens.find((item) => item.id === screen)!.label;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <aside className="sidebar">
        <a className="brand" href="#today" onClick={() => navigate("today")}>
          <span className="brand-icon">
            <Dumbbell size={23} />
          </span>
          <span>
            lightweight<small>나의 훈련, 나의 페이스</small>
          </span>
        </a>
        <nav aria-label="주 메뉴">
          {screens.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              className={`nav-link ${screen === id ? "active" : ""}`}
              href={`#${id}`}
              aria-current={screen === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={21} />
              <span>{label}</span>
              {screen === id && <span className="nav-dot" />}
            </a>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="avatar">{profile.name.slice(0, 1)}</span>
          <span>
            <strong>{profile.name}</strong>
            <small>{accountId ? "로그인 계정" : "기기 프로필"}</small>
          </span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <a
            className="mobile-brand"
            href="#today"
            onClick={() => navigate("today")}
          >
            <Dumbbell size={22} />
            lightweight
          </a>
          <span className="desktop-greeting">
            작은 기록이 만드는 꾸준한 변화
          </span>
          <span className="storage-status" role="status">
            <span className={`status-dot ${pending ? "saving" : ""}`} />
            {pending
              ? "기기에 저장 중…"
              : online
                ? "이 기기에 저장"
                : "오프라인 · 기기 저장"}
          </span>
        </header>
        <main id="main-content" className="content" tabIndex={-1}>
          <header className="page-heading">
            <div>
              <p className="eyebrow">
                {new Intl.DateTimeFormat("ko", {
                  timeZone: profile.timeZone,
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                }).format(now)}
              </p>
              <h1>
                {session
                  ? "운동 기록"
                  : screen === "today"
                    ? "오늘도, 나의 페이스로"
                    : title}
              </h1>
            </div>
            <span className="profile-tag">{profile.name}</span>
          </header>
          {session ? (
            <WorkoutView
              key={session.id}
              session={session}
              run={run}
              onBack={() => setSessionId(null)}
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
              now={now}
              profile={profile}
              sessions={sessions}
              inspect={inspect}
            />
          ) : (
            <>
              <AccountPanel
                busy={
                  pending > 0 ||
                  sessions.some((record) => record.status === "active")
                }
              />
              <CloudPanel
                busy={
                  pending > 0 ||
                  sessions.some((record) => record.status === "active")
                }
                run={run}
              />
              <SettingsView
                key={`${profile.ownerId}-${profile.revision}`}
                profile={profile}
                profiles={profiles}
                run={run}
                switchProfile={switchProfile}
                createProfile={createProfile}
              />
            </>
          )}
          <footer className="page-footer">
            LIGHTWEIGHT <span>오늘의 기록을, 내일의 나에게.</span>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="모바일 주 메뉴">
        {screens.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={screen === id ? "active" : ""}
            aria-current={screen === id ? "page" : undefined}
            onClick={() => navigate(id)}
          >
            <Icon size={21} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      {notice && (
        <div
          className={`toast ${notice.error ? "error" : ""}`}
          role={notice.error ? "alert" : "status"}
        >
          <span>{notice.message}</span>
          <UnstyledButton
            className="icon-button"
            aria-label="알림 닫기"
            onClick={() => setNotice(null)}
          >
            <X size={17} />
          </UnstyledButton>
        </div>
      )}
      <UpdateNotice
        active={sessions.some((record) => record.status === "active")}
      />
    </div>
  );
}
