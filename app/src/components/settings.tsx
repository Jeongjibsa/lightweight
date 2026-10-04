import { UnstyledButton, NativeSelect, TextInput } from "@mantine/core";
import { errorMessage } from "../domain/errors";
import { useState, type FormEvent } from "react";
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
    <form onSubmit={submit} className="form-stack">
      <label>
        프로필 이름
        <TextInput
          value={name}
          maxLength={40}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <fieldset>
        <legend>운동 목표</legend>
        <div className="choice-grid">
          {Object.entries(goals).map(([value, label]) => (
            <label
              className={`choice ${goal === value ? "selected" : ""}`}
              key={value}
            >
              <input
                type="radio"
                name="goal"
                value={value}
                checked={goal === value}
                required
                onChange={() => setGoal(value as Preferences["goal"])}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {goal === "custom" && (
        <label>
          나의 목표
          <TextInput
            required
            value={customGoal}
            maxLength={100}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="예: 등과 하체의 근력 늘리기"
          />
        </label>
      )}
      <fieldset>
        <legend>주당 운동 횟수</legend>
        <div className="two-columns">
          <label>
            최소 횟수
            <NativeSelect
              required
              value={min}
              onChange={(e) => setMin(e.target.value)}
            >
              <option value="">선택</option>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n}회
                </option>
              ))}
            </NativeSelect>
          </label>
          <label>
            최대 횟수
            <NativeSelect
              required
              value={max}
              onChange={(e) => setMax(e.target.value)}
            >
              <option value="">선택</option>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n}회
                </option>
              ))}
            </NativeSelect>
          </label>
        </div>
        <p className="hint">같은 횟수로 고정하거나 범위를 설정할 수 있어요.</p>
      </fieldset>
      <div className="two-columns">
        <label>
          분할 방법
          <NativeSelect
            required
            value={split}
            onChange={(e) => setSplit(e.target.value as Preferences["split"])}
          >
            <option value="">선택</option>
            {Object.entries(splits).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </label>
        <label>
          운동 시간 · 선택
          <TextInput
            type="number"
            min={10}
            max={240}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="분"
          />
        </label>
      </div>
      {split === "custom" && (
        <label>
          나의 분할
          <TextInput
            required
            value={customSplit}
            maxLength={100}
            onChange={(e) => setCustomSplit(e.target.value)}
            placeholder="예: 상체 / 하체 / 전신"
          />
        </label>
      )}
      <fieldset>
        <legend>사용할 수 있는 장비 · 선택</legend>
        <div className="chips">
          {equipmentOptions.map((item) => (
            <label
              className={`choice ${equipment.includes(item) ? "selected" : ""}`}
              key={item}
            >
              <input
                type="checkbox"
                checked={equipment.includes(item)}
                onChange={() =>
                  setEquipment((prior) =>
                    prior.includes(item)
                      ? prior.filter((value) => value !== item)
                      : [...prior, item],
                  )
                }
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="two-columns">
        <label>
          중량 단위
          <NativeSelect
            value={unit}
            onChange={(e) => setUnit(e.target.value as Profile["unit"])}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </NativeSelect>
        </label>
        <label>
          기록 시간대
          <TextInput
            value={timeZone}
            required
            onChange={(e) => setTimeZone(e.target.value)}
            placeholder="Asia/Seoul"
          />
        </label>
      </div>
      <p className="hint">
        바뀐 설정은 다음 운동부터 적용됩니다. 지난 기록의 단위와 당시 설정은
        보존됩니다.
      </p>
      <UnstyledButton
        className="button primary"
        disabled={saving}
        type="submit"
      >
        {saving ? "저장 중…" : "훈련 설정 저장"}
      </UnstyledButton>
    </form>
  );
}

export function SettingsView({
  profile,
  profiles,
  run,
  switchProfile,
  createProfile,
}: {
  profile: Profile;
  profiles: Profile[];
  run: Run;
  switchProfile: (id: string) => void;
  createProfile: () => Promise<void>;
}) {
  const { store, accountId } = useTraining();
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
    try {
      if (file.size > 10 * 1024 * 1024)
        throw new Error("10MB 이하의 백업 파일을 선택해주세요.");
      setBackup(store.parseBackup(await file.text()));
    } catch (error) {
      setFileError(errorMessage(error));
    }
  }
  return (
    <div className="settings-grid">
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MY PREFERENCES</p>
            <h2>나에게 맞는 훈련</h2>
          </div>
          <span className="badge">프로필별 설정</span>
        </div>
        <ProfileForm
          key={JSON.stringify(profile)}
          profile={profile}
          run={run}
        />
      </section>
      <div className="stack">
        {!accountId && (
          <section className="card">
            <h2>기기 프로필</h2>
            <p className="muted">
              각 프로필의 설정·루틴·기록을 따로 관리합니다. 이 기기에서 누구나
              전환할 수 있어요.
            </p>
            <label>
              현재 프로필
              <NativeSelect
                value={profile.ownerId}
                onChange={(e) => switchProfile(e.target.value)}
              >
                {profiles.map((item) => (
                  <option value={item.ownerId} key={item.ownerId}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </label>
            <UnstyledButton
              className="button secondary full"
              onClick={() => void createProfile()}
            >
              <Plus size={18} />새 프로필 만들기
            </UnstyledButton>
          </section>
        )}
        <section className="card">
          <ShieldCheck className="card-icon" size={25} />
          <h2>내 기록 보관하기</h2>
          <p className="muted">
            현재 기록은 이 브라우저의 기기에 저장됩니다. 브라우저 데이터 삭제나
            기기 변경에 대비해 백업해주세요.
          </p>
          <div className="stack small-gap">
            <UnstyledButton
              className="button secondary"
              onClick={() => void exportBackup()}
            >
              <Download size={18} />
              현재 프로필 백업
            </UnstyledButton>
            <label className="button secondary file-button">
              <Upload size={18} />
              백업 가져오기
              <input
                type="file"
                accept="application/json,.json"
                aria-label="백업 파일 선택"
                onChange={(e) => {
                  void importFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {fileError && (
            <p role="alert" className="error-text">
              {fileError}
            </p>
          )}
          <p className="hint">
            백업에는 개인 기록이 들어 있습니다. 공유할 때 내용을 확인해주세요.
          </p>
        </section>
        <section className="card subtle">
          <span className="status-dot" />
          <strong>기기 저장 모드</strong>
          <p className="muted">
            {accountId
              ? "이 계정의 기록을 기기에 저장합니다. 클라우드 저장 상태는 계정 연결 영역에서 확인하세요."
              : "기기 프로필 전환은 인증 기능이 아닙니다. 계정 로그인을 사용하면 계정별 저장소를 별도로 사용합니다."}
          </p>
        </section>
      </div>
      {backup && (
        <Modal
          title="백업을 복원할까요?"
          onClose={() => {
            if (!restoring) setBackup(null);
          }}
        >
          <p>
            <strong>{backup.profile.name}</strong>의 백업 ·{" "}
            {backup.exportedAt.slice(0, 10)}
          </p>
          <div className="summary-strip">
            <span>
              루틴 {backup.routines.filter((item) => !item.deletedAt).length}개
            </span>
            <span>
              운동 {backup.sessions.filter((item) => !item.deletedAt).length}개
            </span>
          </div>
          <p>
            현재 프로필의 설정·루틴·기록을 이 백업으로 교체합니다. 다른 로컬
            프로필은 유지됩니다. 먼저 현재 기록을 백업하는 것을 권장합니다.
          </p>
          <div className="button-row">
            <UnstyledButton
              className="button secondary"
              disabled={restoring}
              onClick={() => setBackup(null)}
            >
              취소
            </UnstyledButton>
            <UnstyledButton
              className="button primary"
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
            </UnstyledButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
