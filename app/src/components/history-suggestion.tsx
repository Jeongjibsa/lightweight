import { UnstyledButton } from "@mantine/core";
import { todayCandidate, historyVersion } from "../domain/history";
import {
  dateInZone,
  type Profile,
  type Routine,
  type Session,
} from "../domain/models";
import {
  completedWorking,
  conditionKey,
  totalSets,
  volumeConditions,
} from "../domain/volume";
import { conditionLabel, formatMetric } from "./volume-format";

const reasons = {
  settings: "목표·횟수·분할을 설정하면 기록 참고 후보를 확인할 수 있어요.",
  equipment:
    "사용 가능한 장비를 설정해주세요. 장비가 비어 있으면 후보를 정하지 않습니다.",
  active: "진행 중인 운동이 있어 오늘의 추가 후보는 보류했어요.",
  today: "오늘 완료한 본세트 기록이 있어 추가 후보는 보류했어요.",
  history:
    "현재 설정과 일치하는 최근 28일의 종료 기록이 아직 없어요. 나의 루틴을 직접 선택해 기록을 쌓아보세요.",
  routines:
    "현재 설정·장비에 맞는 나의 루틴이 없어요. 루틴과 장비 설정을 확인해주세요.",
};
export function HistorySuggestion({
  profile,
  routines,
  sessions,
  now,
  start,
}: {
  profile: Profile;
  routines: Routine[];
  sessions: Session[];
  now: Date;
  start: (id?: string) => Promise<void>;
}) {
  const result = todayCandidate(profile, routines, sessions, now);
  return (
    <section
      className="card history-suggestion"
      aria-labelledby="candidate-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">BASED ON YOUR HISTORY</p>
          <h2 id="candidate-heading">오늘의 루틴 후보</h2>
        </div>
        <span className="badge">과거 기록 참고</span>
      </div>
      {result.state === "held" ? (
        <p className="muted">{reasons[result.reason]}</p>
      ) : (
        <>
          <h3>{result.routine.name}</h3>
          <p className="muted">
            현재 설정·장비에 맞는 나의 루틴 중 최근 28일에 수행하지 않았거나
            마지막 기록이 가장 오래된 루틴입니다. 검토에 사용한 종료 기록{" "}
            {result.historyCount}개.
          </p>
          <div className="candidate-numbers">
            <p>
              <strong>
                {result.routine.exercises.reduce(
                  (sum, entry) => sum + entry.sets,
                  0,
                )}
                개
              </strong>
              <span>현재 계획 세트</span>
            </p>
            <p>
              <strong>
                {result.previous
                  ? `${completedWorking(result.previous.sets).length}개`
                  : "기록 없음"}
              </strong>
              <span>
                {result.previous
                  ? `${result.previous.localDate} 실제 본세트 · ${result.previous.status === "partial" ? "일부 완료" : "완료"}`
                  : "이 루틴의 최근 실제 본세트"}
              </span>
            </p>
          </div>
          {result.previous && (
            <div
              className="volume-table-wrap"
              role="region"
              aria-label="이 루틴의 과거 운동별 기록"
              tabIndex={0}
            >
              <table className="volume-table">
                <caption>최근 같은 루틴의 과거 운동 조건과 기록량</caption>
                <thead>
                  <tr>
                    <th scope="col">운동 조건</th>
                    <th scope="col">본세트</th>
                    <th scope="col">기록 볼륨</th>
                  </tr>
                </thead>
                <tbody>
                  {volumeConditions(
                    [result.previous],
                    profile.ownerId,
                    dateInZone(now, profile.timeZone),
                  ).map((condition) => {
                    const totals = totalSets(
                      result.previous!.sets.filter(
                        (set) => conditionKey(set) === condition.key,
                      ),
                    );
                    return (
                      <tr key={condition.key}>
                        <th scope="row">{conditionLabel(condition)}</th>
                        <td>{totals.workingRows}개</td>
                        <td>{formatMetric(totals.volume, "kg·회")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <UnstyledButton
            className="button dark"
            onClick={() => void start(result.routine.id)}
          >
            이 루틴 선택해 시작
          </UnstyledButton>
        </>
      )}
      <p className="hint">
        {result.state === "candidate" ||
        result.reason === "history" ||
        result.reason === "routines"
          ? `목표·횟수·분할·시간·장비 설정이 달라 제외한 종료 기록 ${result.changedRecords}개.`
          : "오늘의 수행/진행 상태 또는 설정 조건 때문에 과거 기록 검토를 보류했습니다."}{" "}
        과거 기록은 권장량이 아닙니다. 회복이나 최적 운동량을 판단하지 않으며
        자동 증량하지 않습니다. 한 손·머신은 입력 중량 기준이고 맨몸·보조·시간의
        볼륨은 N/A입니다. 규칙 {historyVersion}.
      </p>
    </section>
  );
}
