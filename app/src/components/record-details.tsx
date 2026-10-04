import {
  Button,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { useTraining } from "../context/training";
import type { Session, TrainingSet } from "../domain/models";
import { Modal, type Run } from "./shared";

export function SessionNoteEditor({
  session,
  run,
  onClose,
}: {
  session: Session;
  run: Run;
  onClose: () => void;
}) {
  const { store } = useTraining();
  const [revision] = useState(session.revision);
  const [note, setNote] = useState(session.note ?? "");
  const [saving, setSaving] = useState(false);
  return (
    <Modal
      title="운동 메모"
      onClose={() => {
        if (!saving) onClose();
      }}
    >
      <Stack gap="md">
        <Textarea
          label="오늘 운동 메모"
          description="그날의 컨디션이나 기억할 내용을 남겨보세요."
          autosize
          minRows={4}
          maxRows={8}
          maxLength={1000}
          value={note}
          disabled={saving}
          onChange={(e) => setNote(e.target.value)}
        />
        <Text size="xs" c="dimmed" ta="right">
          {note.length} / 1000자
        </Text>
        <Group grow>
          <Button variant="default" disabled={saving} onClick={onClose}>
            취소
          </Button>
          <Button
            loading={saving}
            onClick={async () => {
              setSaving(true);
              const ok = await run(
                () =>
                  store.saveSessionNote(
                    session.ownerId,
                    session.id,
                    revision,
                    note,
                  ),
                "운동 메모를 저장했습니다.",
              );
              setSaving(false);
              if (ok) onClose();
            }}
          >
            메모 저장
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
function ConditionForm({
  session,
  targets,
  run,
  onClose,
  saving,
  setSaving,
}: {
  session: Session;
  targets: TrainingSet[];
  run: Run;
  onClose: () => void;
  saving: boolean;
  setSaving: (value: boolean) => void;
}) {
  const { store } = useTraining();
  const first = targets[0]?.comparison;
  const mixed = targets.some(
    (s) =>
      (s.comparison?.equipmentLabel ?? "") !== (first?.equipmentLabel ?? "") ||
      (s.comparison?.rangeOfMotion ?? "") !== (first?.rangeOfMotion ?? ""),
  );
  const [equipmentLabel, setEquipmentLabel] = useState(
    mixed ? "" : (first?.equipmentLabel ?? ""),
  );
  const [rangeOfMotion, setRangeOfMotion] = useState(
    mixed ? "" : (first?.rangeOfMotion ?? ""),
  );
  return (
    <Stack gap="md">
      {mixed && (
        <Text size="sm" c="yellow.4">
          세트별 조건이 다릅니다. 저장하면 선택한 세트에 같은 조건이 적용됩니다.
        </Text>
      )}
      <TextInput
        label="장비 이름 · 선택"
        description="예: 헬스장 A 레그프레스 2번"
        maxLength={80}
        value={equipmentLabel}
        disabled={saving}
        onChange={(e) => setEquipmentLabel(e.target.value)}
      />
      <TextInput
        label="가동범위 · 선택"
        description="비교할 때 구분할 이름을 직접 입력하세요."
        maxLength={80}
        value={rangeOfMotion}
        disabled={saving}
        onChange={(e) => setRangeOfMotion(e.target.value)}
      />
      <Text size="xs" c="dimmed">
        장비 이름 또는 가동범위가 다르면 추이를 별도로 표시합니다. 두 칸을
        비우면 미입력 조건으로 저장합니다. 수행 수치와 완료 시각은 유지됩니다.
      </Text>
      <Group grow>
        <Button variant="default" disabled={saving} onClick={onClose}>
          취소
        </Button>
        <Button
          loading={saving}
          onClick={async () => {
            setSaving(true);
            const ok = await run(
              () =>
                store.saveSetConditions(
                  session.ownerId,
                  session.id,
                  session.revision,
                  targets.map((s) => s.id),
                  { equipmentLabel, rangeOfMotion },
                ),
              "비교 조건을 저장했습니다.",
            );
            setSaving(false);
            if (ok) onClose();
          }}
        >
          조건 저장
        </Button>
      </Group>
    </Stack>
  );
}
export function ExerciseConditionEditor({
  session,
  exerciseId,
  run,
  onClose,
}: {
  session: Session;
  exerciseId: string;
  run: Run;
  onClose: () => void;
}) {
  // Freeze the revision and target records while the user edits; a newer write must fail CAS.
  const [snapshot] = useState(session);
  const sets = snapshot.sets.filter((s) => s.exercise.id === exerciseId);
  const [selection, setSelection] = useState("all");
  const [saving, setSaving] = useState(false);
  return (
    <Modal
      title="운동 비교 조건"
      onClose={() => {
        if (!saving) onClose();
      }}
    >
      <Stack gap="md">
        <Text fw={600}>{sets[0]?.exercise.name}</Text>
        <Select
          label="적용할 세트"
          comboboxProps={{ withinPortal: false }}
          maxDropdownHeight={180}
          disabled={saving}
          value={selection}
          onChange={(v) => v && setSelection(v)}
          allowDeselect={false}
          data={[
            { value: "all", label: "이 운동 전체 세트" },
            ...sets.map((s, i) => ({
              value: s.id,
              label: `${i + 1}세트${s.completedAt ? " · 완료" : ""}`,
            })),
          ]}
        />
        <ConditionForm
          key={selection}
          session={snapshot}
          targets={
            selection === "all" ? sets : sets.filter((s) => s.id === selection)
          }
          run={run}
          onClose={onClose}
          saving={saving}
          setSaving={setSaving}
        />
      </Stack>
    </Modal>
  );
}
