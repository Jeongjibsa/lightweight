---
type: "Data Contract"
title: "이전 기록 재사용과 종료 기록 수정"
description: "기록 보존·조건/단위·수정 충돌·실제 회귀 계약."
tags:
  - "operations"
  - "logging"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T20:32:03+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "남은 구현 요청"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-record-reuse-verification.json"
    title: "실행"
---

# 이전 기록 재사용과 종료 수정

운동 입력 횟수를 줄이는 기존 LOG03/04 후속이다. 사용자가 직접 선택한 운동을 기록하며 추천 처방을 새로 제공하지 않는다.

| 동작 | 현재 구현 | 보존 경계 |
|---|---|---|
| 이전 값 불러오기 | 같은 종목·이름·분류·장비·부하 방식·좌우·세트 종류의 최근 종료 기록, 빈 중량/반복/시간만 채움 | 기존 입력/완료 세트·과거 원본 유지; RIR/완료는 복사하지 않음 |
| 이 운동 다시 시작 | 실제 완료했던 행을 새 session/set ID의 오늘 계획으로 복사 | 현재 단위·시간대·설정, kg/lb 변환; 완료/RIR 비움; 동시 시작은 한 세션 |
| 다른 운동으로 교체 | 현재 세션의 미완료 행만 직접 선택한 종목으로 교체 | 완료 행·루틴 snapshot 유지; 새 부하/반복/시간/RIR 비움; 원래 루틴은 수정하지 않음 |
| 기록 수정 | 종료 기록의 중량/횟수/시간·종류·좌우/RIR을 명시 저장 | 수행/종료 시각·완료·ID/snapshot 유지, captured revision 충돌 거부·오류 rollback |

기록 수정 뒤 liveQuery를 통해 리포트를 즉시 다시 계산한다. 준비 세트/좌우/RIR의 상세 표시도 저장값과 맞춘다. 자료 부족/과학 검토 없이 과거량을 오늘의 권장량으로 표현하지 않는다. machine/per-hand의 입력 의미를 바꾸지 않고 kg/lb 숫자만 변환한다. 특정 머신 식별자는 아직 없으므로 정밀 비교/추천 정책은 후속이다.

## 실제 확인

72개(unit23/integration30/ui19)·lint/build/E2E 타입 검사/format·정적 artifact24 통과. browser20(Chromium11/WebKit9), 새 과업 두 엔진×3회6회 통과. 실제 화면에서20kg×8→40kg×6 수정 후240kg·회, 새 계획/이전값/종목 교체/reload와 다운로드 원본 동일을 확인했다. 첫 browser2실패는 실제 목록에 없는 종목을 선택한 test fixture였고 trace/화면/console을 보존했다. 추가 DOM assertion의 잘못된 role/모호한 label도 기록하고 실제 combobox로 고쳤다. 자동 retry0.

[불변 실행](../../raw/research/2026-10-04-record-reuse-verification.json). 실제 Auth/RLS·다기기·iPhone과 전체 LOG03/04 정렬/메모/삭제 복구·장비 식별은 남는다. schema2·server API/권한은 유지했다.
