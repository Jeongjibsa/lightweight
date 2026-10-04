import { loadModes } from "../domain/models";
import type { ExerciseCondition, VolumeMetric } from "../domain/volume";

export const metricLabels: Record<
  VolumeMetric,
  { label: string; unit: string }
> = {
  workingRows: { label: "본세트", unit: "개" },
  reps: { label: "반복", unit: "회" },
  seconds: { label: "시간", unit: "초" },
  volume: { label: "기록 볼륨", unit: "kg·회" },
};
const numberFormatter = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 1,
});
export function formatMetric(value: number | null, unit = "") {
  return value === null
    ? "N/A"
    : `${numberFormatter.format(value)}${unit ? ` ${unit}` : ""}`;
}
export function conditionLabel(condition: ExerciseCondition) {
  const details = condition.comparison;
  const suffix =
    details?.equipmentLabel || details?.rangeOfMotion
      ? ` · ${details.equipmentLabel || "장비 이름 미입력"} · ${details.rangeOfMotion || "가동범위 미입력"}`
      : " · 비교 조건 미입력";
  return `${condition.exercise.name} · ${condition.exercise.group} · ${condition.exercise.equipment || "장비 미지정"} · ${loadModes[condition.exercise.loadMode]} · ${{ both: "양측", left: "왼쪽", right: "오른쪽" }[condition.side]}${suffix}`;
}
export function conditionChoices(conditions: ExerciseCondition[]) {
  const counts = new Map<string, number>();
  const seen = new Map<string, number>();
  for (const c of conditions) {
    const label = conditionLabel(c);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return conditions.map((c) => {
    const label = conditionLabel(c);
    const ordinal = (seen.get(label) ?? 0) + 1;
    seen.set(label, ordinal);
    return {
      value: c.key,
      label: counts.get(label)! > 1 ? `${label} · 종목 기록 ${ordinal}` : label,
    };
  });
}
