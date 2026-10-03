---
type: "Recommendation Policy"
title: "루틴 추천과 조정 규칙"
description: "입력·제약·검증할 시작값·수행 후 조정."
tags:
  - "product"
  - "training"
  - "personalization"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:15:39+09:00"
sources:
  - id: "acsm"
    resource: "../sources/SRC-003-acsm-2026.md"
    title: "ACSM"
  - id: "volume"
    resource: "../sources/SRC-004-volume-frequency.md"
    title: "운동량"
  - id: "rir"
    resource: "../sources/SRC-005-rir.md"
    title: "RIR"
  - id: "implementation-request"
    resource: "../../raw/conversations/2026-10-03-005.md"
    title: "계획 요청과 운동 우선 선택"
  - id: "implementation-plan"
    resource: "implementation-plan.md"
    title: "단계별 작업계획"
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "local-contract"
    resource: "implementation-contracts.md"
    title: "로컬 구현 계약"
  - id: "local-progress"
    resource: "implementation-progress.md"
    title: "실행 결과와 남은 작업"
  - id: "volume-request"
    resource: "../../raw/conversations/2026-10-04-009.md"
    title: "새 요구"
  - id: "volume-mvp"
    resource: "volume-history-mvp.md"
    title: "단계/계산"
---

# 루틴 추천과 조정 규칙

FR-03. [기획서](prd.md). 입력: 목표·경험·일정·시간·장비·선호/제외·최근 기록·불편감. 출력: 일정·운동/대체·본세트/반복·노력·휴식·이유·규칙/근거 버전.

## 본인 파일럿 조건

CONV-0005에서 골격근량 증대·주3~4회·무분할~3분할을 보고했다. [SCI-03 구현 과업](implementation-backlog.md)은 3↔4회/분할 변경·시간/장비·부분 수행 조건을 검증한다. 경험·주요 종목·장비·회당 시간은 미결이며 아래 초보 시작값을 본인의 확정 처방으로 사용하지 않는다. 주어진 횟수/분할에서 최적인 루틴이 이미 증명되었다고 표현하지 않는다.

## 추천 흐름

적용 범위 확인 → 일정 후보 → 검토된 종목 배치 → 직접/보조 세트 점검 → 시간 초과 조정 → 규칙 결과 고정 → 설명 → 사용자 채택 후 루틴 버전 저장. 기록이 없는 사람에게 개인 반응을 분석했다고 표현하지 않는다. 입력 부족 시 직접 루틴을 허용한다.

## 시작값 제안

아래는 **검증 전 제품 가설**이며 연구의 보편적 최적 처방이 아니다. 실제 제공 전 전문 검토한다.

| 정책 | 시작 후보 | 확인할 사항 |
|---|---|---|
| POL-R01 | 초보 주 2~3회 가능 시 전신 일정 | 지속 가능 시간·경험 |
| POL-R02 | 주요 부위 직접 본세트 주 4~6세트 출발 후보 | 낮은 시작량은 제품 가설 |
| POL-R03 | 기록/회복 확인 후 필요 시 주 약 10세트 수준 검토 | 직접/간접 집계와 개인 반응 |
| POL-R04 | 근비대 후보 8~12회, 보조 10~15회 | 학습용 시작값, 최적성 주장 금지 |
| POL-R05 | 초보 RIR 2~3 선택 안내 | 추정 교육, 정확한 최적 RIR 미확정 |
| POL-R06 | 휴식 120초 기본, 조정 가능 | 편의값, 종목/노력/시간 검토 |

근거: [ACSM](../sources/SRC-003-acsm-2026.md), [운동량/빈도](../sources/SRC-004-volume-frequency.md), [RIR](../sources/SRC-005-rir.md). 고찰 출판일과 검색 종료일을 구분한다. 빈도 증가에 따라 세트를 무조건 늘리지 않는다. 근력 목표는 특정 운동 연습을 별도로 다룬다.

## 루틴 시안 예시

45분·일반 헬스장·초보·근비대 가정의 검토 전 시안: 월/수/금 A/B/A, 다음 주 B/A/B. A/B는 무릎 중심 하체·상체 밀기·당기기를 공통으로 포함하고 하체 뒤쪽/보완을 번갈아 배치한다. 종목/실제 세트는 콘텐츠와 시간 검증 후 확정한다. 특정 개인에 대한 처방은 아니다.

## 기록 후 조정

POL-R07 제안: 같은 운동/장비/범위에서 연속 두 번 본세트 목표 상한을 달성하고 노력 목표와 맞으며 불편감이 없으면 최소 증량 단위를 제안한다. 보조량 감소와 추가 중량 증가를 구분한다. 유지도 선택 가능하다.

반복 미달만으로 정체를 판정하지 않는다. 출석·조건 변화·노력·누락·불편감을 함께 확인한다. 세트/중량을 동시에 자동 증가시키지 않는다. 불편감 보고 시 자동 증량을 중단하고 사용자 수정/중단을 기록한다. 변경 이유·관찰 수·유지 대안을 표시하고 이전 루틴을 보존한다.

## 수용 기준

미검토 정책/존재하지 않는 장비를 추천하지 않는다. 시간 초과·장비 부족·결측을 다룬다. 동일 조건 재현이 가능하다. AI 장애에도 직접 루틴/기록이 가능하다.

## Related

[티어](tier-system.md) · [기록](training-log.md) · [리포트](reports.md)

## CONV-0006 이후 현재 구현 경계

특정 iPhone 모델에 한정하지 않는 반응형과 각 사용자별 목표·주당 횟수·분할·시간·장비·단위·시간대 설정을 요구사항으로 추가했다. 본인의 조건은 하나의 시험 표본이다. Supabase 프로젝트가 없으므로 로컬부터 구현한다는 사용자 선택을 반영했다. [로컬 계약](implementation-contracts.md) · [실행 결과](implementation-progress.md).

로컬 프로필/기록·루틴 스냅샷·백업·사실 집계·PWA는 구현했으며 계정/RLS·서버 전송·실제 iOS·검토된 시각/설명·추천/티어·완전한 개인화·배포는 미완료다. 기존 실사용/지인 제공 관문은 유지한다. 로컬 프로필을 인증 계정으로, 개념도를 자극 범위로, 분류별 행 수를 근육 성장량으로 표시하지 않는다.

## CONV-0009 볼륨·추이·오늘 안내

[새 MVP 계약](volume-history-mvp.md)에 FR-14/15와 REP-04~06/SCI-03B를 연결했다. 관찰 계산/그래프와 과거 수행량 참고부터 제공하고 자동 증량/권장 세트는 충분성/노력/불편감·전문 검토 이후다. CONV-0006의 프로젝트 없음 표기는 당시 이력이며 현재 Supabase 연결 상태는 [진행 보고](implementation-progress.md)를 따른다.
