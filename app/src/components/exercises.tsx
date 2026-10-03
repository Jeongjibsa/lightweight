import { UnstyledButton, NativeSelect, TextInput } from "@mantine/core";
import { useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Trash2,
  Play,
  Copy,
} from "lucide-react";
import { catalog } from "../content/catalog";
import {
  exerciseSchema,
  groups,
  loadModes,
  type Exercise,
  type Profile,
  type Routine,
} from "../domain/models";
import { useTraining } from "../context/training";
import { Empty, Modal, type Run } from "./shared";

export function ExercisePicker({
  onPick,
}: {
  onPick: (exercise: Exercise) => void;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("전체");
  const [custom, setCustom] = useState(false);
  const filtered = catalog.filter(
    (item) =>
      (group === "전체" || item.group === group) &&
      `${item.name} ${item.equipment}`.includes(query.trim()),
  );
  return (
    <>
      <label className="search">
        <Search size={18} />
        <TextInput
          placeholder="운동 이름 또는 장비 검색"
          aria-label="운동 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="chips filter-chips">
        {["전체", ...groups].map((item) => (
          <UnstyledButton
            className={`chip ${item === group ? "selected" : ""}`}
            key={item}
            onClick={() => setGroup(item)}
            aria-pressed={item === group}
          >
            {item}
          </UnstyledButton>
        ))}
      </div>
      <div className="picker-list">
        {filtered.map((exercise) => (
          <UnstyledButton
            className="picker-item"
            key={exercise.id}
            onClick={() => onPick(exercise)}
          >
            <span>
              <strong>{exercise.name}</strong>
              <small>
                {exercise.group} · {exercise.equipment} ·{" "}
                {loadModes[exercise.loadMode]}
              </small>
            </span>
            <Plus size={18} />
          </UnstyledButton>
        ))}
      </div>
      {!filtered.length && (
        <p className="muted">
          검색 결과가 없습니다. 직접 운동을 추가할 수 있어요.
        </p>
      )}
      <UnstyledButton
        className="button secondary full"
        onClick={() => setCustom(!custom)}
      >
        {custom ? "직접 입력 닫기" : "목록에 없는 운동 직접 입력"}
      </UnstyledButton>
      {custom && <CustomExercise onPick={onPick} />}
    </>
  );
}
function CustomExercise({ onPick }: { onPick: (exercise: Exercise) => void }) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState<Exercise["group"]>("가슴");
  const [mode, setMode] = useState<Exercise["loadMode"]>("total");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const result = exerciseSchema.safeParse({
      id: crypto.randomUUID(),
      name,
      group,
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
    <form className="form-stack inset" onSubmit={submit}>
      <label>
        운동 이름
        <TextInput
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <div className="two-columns">
        <label>
          기록 분류
          <NativeSelect
            value={group}
            onChange={(e) => setGroup(e.target.value as Exercise["group"])}
          >
            {groups.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </NativeSelect>
        </label>
        <label>
          중량 표기
          <NativeSelect
            value={mode}
            onChange={(e) => setMode(e.target.value as Exercise["loadMode"])}
          >
            {Object.entries(loadModes).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </label>
      </div>
      <UnstyledButton className="button primary" type="submit">
        이 운동 추가
      </UnstyledButton>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
    </form>
  );
}
export function LibraryView({
  onAdd,
}: {
  onAdd: (exercise: Exercise) => Promise<void>;
}) {
  const [detail, setDetail] = useState<Exercise | null>(null);
  return (
    <div className="library-grid">
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXERCISE LIBRARY</p>
            <h2>오늘의 운동 찾기</h2>
          </div>
          <span className="badge">기록용 초안</span>
        </div>
        <ExercisePicker onPick={setDetail} />
      </section>
      <div className="stack">
        <section className="card anatomy-card">
          <p className="eyebrow">EXPLORE BY AREA</p>
          <h2>부위별로 탐색하세요</h2>
          <svg
            viewBox="0 0 200 260"
            role="img"
            aria-label="가슴, 등, 어깨, 팔, 하체, 코어를 탐색하는 전신 개념도"
          >
            <circle cx="100" cy="30" r="21" className="body-base" />
            <path
              d="M72 58 Q100 48 128 58 L142 126 L130 138 L121 98 L119 147 L136 233 Q126 247 115 235 L100 168 L85 235 Q74 247 64 233 L81 147 L79 98 L70 138 L58 126Z"
              className="body-base"
            />
            <path
              d="M79 66 Q100 59 121 66 L119 92 Q100 102 81 92Z"
              className="body-highlight"
            />
            <path
              d="M84 104 L116 104 L115 141 L85 141Z"
              className="body-highlight secondary-region"
            />
            <path
              d="M83 154 L95 156 L80 225 L72 225Z M105 156 L117 154 L128 225 L120 225Z"
              className="body-highlight secondary-region"
            />
          </svg>
          <p className="hint">
            탐색을 돕는 개념도입니다. 실제 근육 자극의 크기나 범위를 나타내지
            않습니다.
          </p>
        </section>
        <section className="card subtle">
          <h3>근거를 확인하는 운동 가이드</h3>
          <p className="muted">
            현재 12개 종목은 입력과 기록을 위한 목록입니다. 논문 기반 설명·자극
            범위·티어는 검토를 마친 콘텐츠부터 제공할 예정입니다.
          </p>
        </section>
      </div>
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <span className="badge">
            {detail.review === "user_added" ? "직접 입력" : "콘텐츠 검토 전"}
          </span>
          <dl className="details">
            <div>
              <dt>기록 분류</dt>
              <dd>{detail.group}</dd>
            </div>
            <div>
              <dt>장비</dt>
              <dd>{detail.equipment}</dd>
            </div>
            <div>
              <dt>입력 기준</dt>
              <dd>{loadModes[detail.loadMode]}</dd>
            </div>
          </dl>
          <p className="muted">
            같은 중량 표기와 장비 조건을 유지하면 지난 기록을 비교하기 편합니다.
            수행 방법과 근거 평가는 아직 준비 중입니다.
          </p>
          <UnstyledButton
            className="button primary full"
            onClick={async () => {
              await onAdd(detail);
              setDetail(null);
            }}
          >
            <Plus size={18} />
            현재 운동에 추가
          </UnstyledButton>
        </Modal>
      )}
    </div>
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
  const [picker, setPicker] = useState(false);
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
      <form
        className="form-stack"
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
      >
        <label>
          루틴 이름
          <TextInput
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 전신 A"
          />
        </label>
        <div className="stack small-gap">
          {entries.map((entry, index) => (
            <div
              className="routine-entry"
              key={`${entry.exercise.id}-${index}`}
            >
              <div>
                <strong>
                  {index + 1}. {entry.exercise.name}
                </strong>
                <small>
                  {entry.exercise.group} · {loadModes[entry.exercise.loadMode]}
                </small>
              </div>
              <label className="set-count">
                계획 세트
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
                />
              </label>
              <div className="entry-actions">
                <UnstyledButton
                  type="button"
                  className="icon-button"
                  aria-label={`${entry.exercise.name} 위로`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp size={16} />
                </UnstyledButton>
                <UnstyledButton
                  type="button"
                  className="icon-button"
                  aria-label={`${entry.exercise.name} 아래로`}
                  disabled={index === entries.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown size={16} />
                </UnstyledButton>
                <UnstyledButton
                  type="button"
                  className="icon-button"
                  aria-label={`${entry.exercise.name} 제거`}
                  onClick={() =>
                    setEntries((prior) => prior.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 size={16} />
                </UnstyledButton>
              </div>
            </div>
          ))}
        </div>
        <UnstyledButton
          type="button"
          className="button secondary"
          disabled={entries.length >= 30}
          onClick={() => setPicker(!picker)}
        >
          <Plus size={18} />
          {picker ? "운동 선택 닫기" : "운동 추가"}
        </UnstyledButton>
        <p className="hint">
          세트 수는 직접 조정하는 계획값입니다. 과학적 루틴 추천은 근거 검토 후
          제공됩니다.
        </p>
        <UnstyledButton
          className="button primary"
          disabled={saving || !entries.length}
          type="submit"
        >
          {saving ? "저장 중…" : "루틴 저장"}
        </UnstyledButton>
      </form>
      {picker && (
        <div className="inset">
          <ExercisePicker
            onPick={(exercise) => {
              setEntries((prior) => [...prior, { exercise, sets: 3 }]);
              setPicker(false);
            }}
          />
        </div>
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
  return (
    <>
      <div className="section-heading">
        <p className="muted">
          순서와 계획 세트를 저장하고, 운동할 때 바로 불러오세요.
        </p>
        <UnstyledButton
          className="button primary"
          onClick={() => setEditor("new")}
        >
          <Plus size={18} />
          루틴 만들기
        </UnstyledButton>
      </div>
      {!routines.length ? (
        <section className="card">
          <Empty title="아직 저장된 루틴이 없어요">
            자주 하는 운동을 하나의 루틴으로 묶어보세요.
          </Empty>
        </section>
      ) : (
        <div className="routine-grid">
          {routines.map((routine) => (
            <section className="card routine-card" key={routine.id}>
              <span className="badge">
                {routine.exercises.length}개 운동 ·{" "}
                {routine.exercises.reduce((n, item) => n + item.sets, 0)}세트
                계획
              </span>
              <h2>{routine.name}</h2>
              <ol className="routine-preview">
                {routine.exercises.map((item, index) => (
                  <li key={index}>
                    <span>{item.exercise.name}</span>
                    <small>{item.sets}세트</small>
                  </li>
                ))}
              </ol>
              <UnstyledButton
                className="button primary full"
                onClick={() => void start(routine.id)}
              >
                <Play size={16} />이 루틴으로 시작
              </UnstyledButton>
              <div className="button-row">
                <UnstyledButton
                  className="text-button"
                  onClick={() => setEditor(routine)}
                >
                  편집
                </UnstyledButton>
                <UnstyledButton
                  className="text-button"
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
                >
                  <Copy size={14} />
                  복사
                </UnstyledButton>
                <UnstyledButton
                  className="text-button danger"
                  onClick={() => setDeleting(routine)}
                >
                  삭제
                </UnstyledButton>
              </div>
            </section>
          ))}
        </div>
      )}
      {editor && (
        <RoutineEditor
          ownerId={profile.ownerId}
          routine={editor === "new" ? undefined : editor}
          run={run}
          onClose={() => setEditor(null)}
        />
      )}
      {deleting && (
        <Modal title="루틴 삭제" onClose={() => setDeleting(null)}>
          <p>
            ‘{deleting.name}’을 루틴 목록에서 삭제합니다. 이 루틴으로 수행한
            운동 기록은 보존됩니다.
          </p>
          <div className="button-row">
            <UnstyledButton
              className="button secondary"
              onClick={() => setDeleting(null)}
            >
              취소
            </UnstyledButton>
            <UnstyledButton
              className="button danger-button"
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
            >
              루틴 삭제
            </UnstyledButton>
          </div>
        </Modal>
      )}
    </>
  );
}
