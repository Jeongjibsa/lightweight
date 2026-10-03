import { UnstyledButton, NativeSelect, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Check, Plus, Timer, Flag, ArrowLeft } from "lucide-react";
import { loadModes, type Session, type TrainingSet } from "../domain/models";
import { useTraining } from "../context/training";
import { ExercisePicker } from "./exercises";
import { Modal, type Run } from "./shared";

function SetRow({
  set,
  index,
  session,
  run,
}: {
  set: TrainingSet;
  index: number;
  session: Session;
  run: Run;
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
    <div className={`set-row ${completed ? "completed" : ""}`}>
      <span className="set-number">{index + 1}</span>
      {timed ? (
        <label className="set-field time-field">
          시간 · 초
          <TextInput
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
        </label>
      ) : (
        <>
          <label className="set-field">
            중량 · {set.unit}
            <TextInput
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
          </label>
          <label className="set-field">
            횟수
            <TextInput
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
          </label>
        </>
      )}
      <UnstyledButton
        className={`complete-button ${completed ? "checked" : ""}`}
        aria-label={`${prefix} ${completed ? "완료 취소" : "완료"}`}
        aria-pressed={completed}
        disabled={busy || readOnly}
        onClick={() => void save(!completed)}
      >
        {completed ? <Check size={19} /> : <span>완료</span>}
      </UnstyledButton>
      <details className="set-extra">
        <summary>{kind === "warmup" ? "준비 세트" : "본세트"} · 상세</summary>
        <div className="extra-grid">
          <label>
            세트 종류
            <NativeSelect
              aria-label={`${prefix} 종류`}
              disabled={completed || readOnly}
              value={kind}
              onChange={(e) => {
                const value = e.target.value as TrainingSet["kind"];
                setKind(value);
                void run(() =>
                  store.updateSet(session.ownerId, session.id, set.id, {
                    ...patch,
                    kind: value,
                  }),
                );
              }}
            >
              <option value="working">본세트</option>
              <option value="warmup">준비 세트</option>
            </NativeSelect>
          </label>
          <label>
            좌우
            <NativeSelect
              aria-label={`${prefix} 좌우`}
              disabled={completed || readOnly}
              value={side}
              onChange={(e) => {
                const value = e.target.value as TrainingSet["side"];
                setSide(value);
                void run(() =>
                  store.updateSet(session.ownerId, session.id, set.id, {
                    ...patch,
                    side: value,
                  }),
                );
              }}
            >
              <option value="both">양쪽 / 해당 없음</option>
              <option value="left">왼쪽</option>
              <option value="right">오른쪽</option>
            </NativeSelect>
          </label>
          <label>
            RIR · 선택
            <TextInput
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
          </label>
        </div>
        <p className="hint">
          RIR은 더 할 수 있었던 횟수입니다. 한쪽씩 기록할 때 좌우를 구분하세요.
        </p>
      </details>
    </div>
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
  const seconds = Math.max(
    0,
    Math.ceil((new Date(last).getTime() + 120000 - clock) / 1000),
  );
  return (
    <div className="rest-clock">
      <Timer size={19} />
      <strong>
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </strong>
      <span>최근 완료부터 2분 · 편의용 타이머</span>
    </div>
  );
}
export function WorkoutView({
  session,
  run,
  onBack,
}: {
  session: Session;
  run: Run;
  onBack: () => void;
}) {
  const { store } = useTraining();
  const [picker, setPicker] = useState(false);
  const [ending, setEnding] = useState(false);
  const [cancel, setCancel] = useState(false);
  const exercises = [
    ...new Map(
      session.sets.map((set) => [set.exercise.id, set.exercise]),
    ).values(),
  ];
  const completed = session.sets.filter((set) => set.completedAt).length;
  const active = session.status === "active";
  return (
    <>
      <UnstyledButton className="text-button back-link" onClick={onBack}>
        <ArrowLeft size={16} />
        오늘로 돌아가기
      </UnstyledButton>
      <section className="card workout-summary">
        <div>
          <span className="badge">
            {active
              ? "진행 중"
              : session.status === "partial"
                ? "일부 완료"
                : "완료"}
          </span>
          <h2>{session.name}</h2>
          <p className="muted">
            {session.localDate} · {session.timeZone}
            {session.routineSnapshot
              ? ` · 루틴 버전 ${session.routineSnapshot.revision}`
              : ""}
          </p>
        </div>
        <div className="workout-count">
          <strong>
            {completed}
            <small> / {session.sets.length}</small>
          </strong>
          <span>완료한 세트 기록</span>
        </div>
      </section>
      <RestClock session={session} />
      <div className="stack">
        {exercises.map((exercise) => (
          <section className="card exercise-session" key={exercise.id}>
            <div className="section-heading">
              <div>
                <h3>{exercise.name}</h3>
                <p className="hint">
                  {exercise.group} · {loadModes[exercise.loadMode]}
                  {exercise.loadMode === "per_hand" ? "을 입력하세요" : ""}
                </p>
              </div>
              <span className="badge">
                {exercise.review === "user_added" ? "직접 입력" : "기록용 초안"}
              </span>
            </div>
            <div className="set-list">
              {session.sets
                .filter((set) => set.exercise.id === exercise.id)
                .map((set, index) => (
                  <SetRow
                    key={set.id}
                    set={set}
                    index={index}
                    session={session}
                    run={run}
                  />
                ))}
            </div>
            {active && (
              <UnstyledButton
                className="text-button add-set"
                disabled={session.sets.length >= 400}
                onClick={() =>
                  void run(() =>
                    store.addSet(session.ownerId, session.id, exercise),
                  )
                }
              >
                <Plus size={16} />
                세트 추가
              </UnstyledButton>
            )}
          </section>
        ))}
      </div>
      {active && (
        <>
          <UnstyledButton
            className="button secondary full add-exercise"
            onClick={() => setPicker(true)}
          >
            <Plus size={18} />
            운동 추가
          </UnstyledButton>
          <div className="workout-actions">
            <UnstyledButton
              className="text-button danger"
              onClick={() => setCancel(true)}
            >
              운동 기록 취소
            </UnstyledButton>
            <UnstyledButton
              className="button primary"
              onClick={() => setEnding(true)}
            >
              <Flag size={18} />
              운동 마치기
            </UnstyledButton>
          </div>
        </>
      )}
      {!active && (
        <p className="hint">
          당시 설정과 수행한 세트를 보존한 기록입니다. 리포트에는 완료한
          본세트만 집계합니다.
        </p>
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
          <p>
            총 {session.sets.length}개 세트 기록 중{" "}
            <strong>{completed}개</strong>를 완료했어요. 완료하지 않은 계획
            세트는 수행량에 포함되지 않습니다.
          </p>
          <div className="button-row">
            <UnstyledButton
              className="button secondary"
              onClick={() => setEnding(false)}
            >
              계속 운동하기
            </UnstyledButton>
            <UnstyledButton
              className="button primary"
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
            </UnstyledButton>
          </div>
          {!completed && (
            <p className="hint">
              세트를 하나 이상 완료하거나, 운동 기록 취소를 선택해주세요.
            </p>
          )}
        </Modal>
      )}
      {cancel && (
        <Modal title="운동 기록 취소" onClose={() => setCancel(false)}>
          <p>
            현재 운동을 기록 목록에서 삭제합니다. 이 운동의 완료 세트도
            리포트에서 제외됩니다.
          </p>
          <div className="button-row">
            <UnstyledButton
              className="button secondary"
              onClick={() => setCancel(false)}
            >
              계속 운동하기
            </UnstyledButton>
            <UnstyledButton
              className="button danger-button"
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
            </UnstyledButton>
          </div>
        </Modal>
      )}
    </>
  );
}
