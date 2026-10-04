import { NativeSelect, SegmentedControl } from "@mantine/core";
import { useMemo, useState } from "react";
import { dateInZone, type Profile, type Session } from "../domain/models";
import {
  changePercent,
  trendSegments,
  volumeConditions,
  volumeDays,
  volumeVersion,
  type VolumeDay,
  type VolumeMetric,
  type VolumePeriod,
} from "../domain/volume";
import { Empty } from "./shared";
import {
  conditionChoices,
  conditionLabel,
  formatMetric,
  metricLabels,
} from "./volume-format";

function TrendGraph({
  days,
  metric,
}: {
  days: VolumeDay[];
  metric: VolumeMetric;
}) {
  const segments = trendSegments(days, metric);
  const points = segments.flat();
  if (!points.length)
    return (
      <Empty title="이 지표는 표시할 값이 없어요">
        N/A는 0으로 그리지 않습니다. 다른 지표를 선택해보세요.
      </Empty>
    );
  const maximum = Math.max(1, ...points.map((p) => p.value));
  const x = (ratio: number) => 64 + ratio * 552;
  const y = (value: number) => 174 - (value / maximum) * 132;
  const description = `${metricLabels[metric].label} 추이. ${points.length}개 날짜의 값. 수치는 아래 표에서 확인할 수 있습니다.`;
  return (
    <figure className="volume-figure">
      <svg
        viewBox="0 0 640 220"
        role="img"
        aria-label={description}
        className="volume-chart"
      >
        <line x1="64" y1="174" x2="616" y2="174" className="chart-axis" />
        <line x1="64" y1="42" x2="616" y2="42" className="chart-grid" />
        <text x="56" y="46" textAnchor="end">
          {formatMetric(maximum)}
        </text>
        <text x="56" y="178" textAnchor="end">
          0
        </text>
        <text x="64" y="205">
          {days[0]!.date}
        </text>
        {days.length > 1 && (
          <text x="616" y="205" textAnchor="end">
            {days.at(-1)!.date}
          </text>
        )}
        {segments.map((segment) => (
          <g key={segment[0]!.date}>
            {segment.length > 1 && (
              <polyline
                className="chart-line"
                points={segment
                  .map((p) => `${x(p.x).toFixed(2)},${y(p.value).toFixed(2)}`)
                  .join(" ")}
              />
            )}
            {segment.map((p) => (
              <circle
                key={p.date}
                cx={x(p.x)}
                cy={y(p.value)}
                r="4"
                className="chart-dot"
              >
                <title>
                  {p.date}: {formatMetric(p.value, metricLabels[metric].unit)}
                </title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      <figcaption>
        단위: {metricLabels[metric].unit} · 날짜 사이의 실제 간격을 표시합니다.
        기록 없는 날은 생략하고 N/A에서 선을 끊습니다.
      </figcaption>
    </figure>
  );
}
export function VolumeReport({
  profile,
  sessions,
  now,
}: {
  profile: Profile;
  sessions: Session[];
  now: Date;
}) {
  const [selection, setSelection] = useState("daily");
  const [period, setPeriod] = useState<VolumePeriod>("28");
  const [metric, setMetric] = useState<VolumeMetric>("volume");
  const today = dateInZone(now, profile.timeZone);
  const conditions = useMemo(
    () => volumeConditions(sessions, profile.ownerId, today),
    [sessions, profile.ownerId, today],
  );
  const condition = conditions.find((c) => c.key === selection) ?? null;
  const days = useMemo(
    () =>
      volumeDays(
        sessions,
        profile.ownerId,
        today,
        period,
        condition?.key ?? null,
      ),
    [sessions, profile.ownerId, today, period, condition?.key],
  );
  const change =
    days.length < 2
      ? null
      : changePercent(days[0]![metric], days.at(-1)![metric]);
  return (
    <section className="card volume-report" aria-labelledby="volume-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR RECORD, OVER TIME</p>
          <h2 id="volume-heading">볼륨과 기록 추이</h2>
        </div>
        <span className="badge">{days.length}일 기록</span>
      </div>
      <div className="volume-controls">
        <NativeSelect
          label="비교할 기록"
          value={condition?.key ?? "daily"}
          onChange={(event) => setSelection(event.currentTarget.value)}
          data={[
            { value: "daily", label: "일별 전체 · 총 중량 방식 부분합" },
            ...conditionChoices(conditions),
          ]}
        />
        <div>
          <span className="control-label" id="volume-period-label">
            조회 기간
          </span>
          <SegmentedControl
            aria-labelledby="volume-period-label"
            value={period}
            onChange={(value) => setPeriod(value as VolumePeriod)}
            data={[
              { value: "28", label: "28일" },
              { value: "84", label: "84일" },
              { value: "all", label: "전체" },
            ]}
            fullWidth
          />
        </div>
      </div>
      <div className="metric-control">
        <span className="control-label" id="volume-metric-label">
          그래프 지표
        </span>
        <SegmentedControl
          aria-labelledby="volume-metric-label"
          value={metric}
          onChange={(value) => setMetric(value as VolumeMetric)}
          data={(
            Object.entries(metricLabels) as [
              VolumeMetric,
              { label: string; unit: string },
            ][]
          ).map(([value, { label }]) => ({ value, label }))}
          fullWidth
        />
      </div>
      <p className="hint">
        {condition
          ? condition.exercise.loadMode === "per_hand"
            ? "한 손에 입력한 중량 기준입니다. 두 배로 환산하지 않습니다."
            : condition.exercise.loadMode === "machine"
              ? "머신에 표시된 중량의 기록량입니다. 실제 힘이나 작업량을 뜻하지 않습니다."
              : ["bodyweight", "assisted", "timed"].includes(
                    condition.exercise.loadMode,
                  )
                ? "이 방식의 중량 볼륨은 N/A입니다. 본세트·반복·시간으로 기록을 확인하세요."
                : "같은 운동·장비·중량 방식·좌우의 기록입니다."
          : "일별 중량 볼륨은 ‘총 중량’ 방식만 합산합니다. 덤벨 한 손·머신·맨몸·보조·시간 방식은 중량 합계에서 제외합니다."}{" "}
        kg/lb는 kg로 환산합니다.
      </p>
      {days.length ? (
        <>
          <TrendGraph days={days} metric={metric} />
          <p className="hint">
            첫 기록 → 최근 기록 변화율:{" "}
            {change === null
              ? "비교 보류 (두 날짜의 값과 0이 아닌 기준값 필요)"
              : `${formatMetric(change)}%`}{" "}
            · 선택한 기간의 두 기록을 비교하며 운동 효과를 평가하지 않습니다.
          </p>
          <div
            className="volume-table-wrap"
            role="region"
            aria-label="날짜별 수치 표"
            tabIndex={0}
          >
            <table className="volume-table">
              <caption>
                날짜별 완료 본세트 기록 ·{" "}
                {condition ? conditionLabel(condition) : "일별 전체"}
              </caption>
              <thead>
                <tr>
                  <th scope="col">기록일</th>
                  <th scope="col">본세트</th>
                  <th scope="col">반복</th>
                  <th scope="col">시간</th>
                  <th scope="col">볼륨</th>
                  <th scope="col">볼륨 포함 행</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day.date}>
                    <th scope="row">{day.date}</th>
                    <td>{day.workingRows}개</td>
                    <td>{formatMetric(day.reps, "회")}</td>
                    <td>{formatMetric(day.seconds, "초")}</td>
                    <td>{formatMetric(day.volume, "kg·회")}</td>
                    <td>
                      {day.volumeRows}/{day.workingRows}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Empty title="선택한 기간에 완료한 본세트가 없어요">
          운동을 기록하거나 조회 기간을 넓혀보세요.
        </Empty>
      )}
      <p className="hint">
        입력 행을 세며 좌우 별도 행은 각각 포함합니다. 동일 이름·장비라도 실제
        머신과 가동범위가 같은지 확인하세요. 준비·미완료·취소·삭제·미래 기록은
        제외합니다. 계산 {volumeVersion}.
      </p>
    </section>
  );
}
