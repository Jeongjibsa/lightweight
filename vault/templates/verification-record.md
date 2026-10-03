---
type: "Template"
title: "문제 재현과 회귀 검사 기록 양식"
description: "원래 실패·독립 기대값·환경·수정·재검증·남은 제한을 기록하는 반복 개선 양식."
tags:
  - "template"
  - "testing"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T00:33:00+09:00"
sources:
  - id: "loop"
    resource: "../wiki/operations/loop-engineering.md"
    title: "루프 운영 제안"
---

# 문제 재현과 회귀 검사 기록 양식

문제별 기록을 새 파일로 만든다. raw의 확정 실행 기록은 덮어쓰지 않는다. 값이 없으면 `not_run`/`unknown`을 쓰고 성공으로 취급하지 않는다. 실제 기록/토큰은 제외한다.

| 항목 | 작성 내용 |
|---|---|
| 문제/실행 ID·시각 | 문제 ID + 서로 다른 run ID, ISO 시각/시간대 |
| 분류·상태 | defect / risk / harness / environment / contract; open / reproduced / fixed / verified |
| 요구·계약·작업 | FR·HAR/LOG/SYNC/SCI ID와 계약 문서 |
| 환경 | git revision + dirty 여부/변경 diff 식별, app/schema/rule/content 버전, lockfile hash, runtime/browser/device/OS/viewport/origin |
| 초기 조건 | fixture ID/version, 고정 시각·시간대, DB/cache/SW/network 상태 |
| 기대 결과 | 독립적으로 정의한 값/상태·허용 오차/정규화 항목 |
| 재현 | 실행 명령/사용자 동작/seed와 최초 실패 증거 |
| 실제 결과 | UI/DB/revision/outbox/오류 비교, pass / fail / flaky / not_run |
| 원인·수정 | 검증한 원인/가설, 변경 범위·코드/계약 |
| 재검증·회귀 | 원래 표본·반례·관련 검사 결과, test/spec 위치 |
| 종료·제한 | 완료 기준 충족 여부, 미지원/미시험, 후속 작업/이력 링크 |

기대 결과를 대상 계산 함수를 호출해서 채우지 않는다. 예: 계획 본세트8·완료6·준비2 표본의 기대값8/6/1일/1세션은 수기로 정의하고 실제 함수 결과와 비교한다. UI ‘성공’과 저장소 상태를 함께 확인한다. 실패 trace·스크린샷은 접근이 제한된 artifact로 보관하고 vault에는 가짜 표본/비식별 요약과 식별 경로를 남긴다.

[개선 루프](../wiki/operations/loop-engineering.md) · [현재 하네스](../wiki/operations/testing-harness.md)
