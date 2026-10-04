---
type: "Feature Specification"
title: "개인화 리포트와 계산 계약"
description: "관찰·해석·행동 및 계산/결측 기준."
tags:
  - "product"
  - "personalization"
  - "report"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T20:32:03+09:00"
sources:
  - id: "volume"
    resource: "../sources/SRC-004-volume-frequency.md"
    title: "세트 집계 모델"
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
  - id: "record-reuse"
    resource: "../operations/record-reuse.md"
    title: "재사용 계약"
  - id: "record-check"
    resource: "../../raw/research/2026-10-04-record-reuse-verification.json"
    title: "실행"
---

# 개인화 리포트와 계산 계약

FR-07·FR-09. [기획서](prd.md). 관찰 사실/기간 → 비교 조건·불확실성 → 행동 1~3개 → 근거/규칙 순서로 제공한다. 지속한 행동도 알려준다. 기록량이 적다고 낮은 건강 점수로 평가하지 않는다.

## 계산 정책 초안

| 지표 | 정의 | 예외 |
|---|---|---|
| 완료 세션 | 완료/부분 완료, 본세트 ≥1 | 취소·계획 제외 |
| 루틴 이행 | 완료한 계획 본세트 / 주 계획 본세트 | 자유 운동 별도, 분모 0이면 N/A |
| 직접 부위 세트 | 해당 근육을 직접 대상으로 한 완료 본세트 | 준비·삭제·생략·미확인 매핑 별도 |
| 간접 세트 | 보조 근육에 매핑된 완료 본세트 | 같은 근육을 직접/간접 중복 처리 금지 |
| 참고 지표 | 직접 + 0.5 × 간접 | 검토된 매핑만, 성장 비율 아님 |
| 부위 빈도 | 해당 부위 본세트가 기록된 날짜 수 | 같은 날 여러 세션은 1일 |
| 중량/횟수 추세 | 같은 변형·장비·단위 방식·범위 비교 | 조건 변경 표시 |
| 체중 추세 | 같은 조건의 반복 측정·기간 평균 | 결측은 0kg이 아님 |

참고 지표는 [Pelland 연구](../sources/SRC-004-volume-frequency.md)의 집계 모델을 검토하는 후보이며 모든 근육의 간접 기여가 정확히 50%라는 의미는 아니다. 직접/간접/참고 값을 함께 공개하고 매핑 버전을 남긴다.

톤수는 필요 시 같은 운동의 외부 중량×반복으로 제한한다. 다른 머신·맨몸·보조 운동을 전신 성과 점수로 합치지 않는다. e1RM은 MVP 필수에서 제외하고 추후 공식/조건을 검토한다.

## 데이터 충분성 초안

첫 세션부터 요약. 같은 운동의 비교 가능한 기록 두 번부터 관찰 차이. 운동량 조정은 최근 2주 계획·수행·노력·불편감이 충분한 경우 검토. 부족한 데이터는 요약만 제공하며 성장/정체를 확정하지 않는다.

영양 주간 요약의 후보 UX 기준: 7일 중 사용자 완료 표시 4일 이상. 미달 시 기록일 요약. 4일은 검증된 영양 진단 기준이 아니다. 성분 커버리지 부족은 영양소 평가 보류이며 임계값은 파일럿에서 확정한다.

## 문구 예시와 AI 계약

‘이번 주 가슴 직접 본세트 6세트, 계획은 8세트, 금요일 부분 완료’ → ‘누락 가능성이 있어 부족으로 확정할 수 없음’ → ‘기록 확인 후 유지/시간을 줄인 대체안 선택’.

계산은 결정적 코드. AI 입력은 승인된 집계·충분성·규칙·근거 ID. 출력 숫자를 입력과 대조하고 없는 수치/근거/금지 단정을 거부하면 고정 템플릿으로 표시한다. 설명 실패에도 숫자와 기록을 보여준다.

저장: 생성 시각·기간·사용 데이터 수정 버전·루틴/운동 매핑/계산/근거 버전·충분성·집계·제안/선택. 기록 수정 시 이전 리포트는 오래된 결과로 표시하고 새로 생성한다.

## Related

[영양](nutrition.md) · [추천](routine-engine.md) · [검증](validation-plan.md)

## CONV-0006 이후 현재 구현 경계

특정 iPhone 모델에 한정하지 않는 반응형과 각 사용자별 목표·주당 횟수·분할·시간·장비·단위·시간대 설정을 요구사항으로 추가했다. 본인의 조건은 하나의 시험 표본이다. Supabase 프로젝트가 없으므로 로컬부터 구현한다는 사용자 선택을 반영했다. [로컬 계약](implementation-contracts.md) · [실행 결과](implementation-progress.md).

로컬 프로필/기록·루틴 스냅샷·백업·사실 집계·PWA는 구현했으며 계정/RLS·서버 전송·실제 iOS·검토된 시각/설명·추천/티어·완전한 개인화·배포는 미완료다. 기존 실사용/지인 제공 관문은 유지한다. 로컬 프로필을 인증 계정으로, 개념도를 자극 범위로, 분류별 행 수를 근육 성장량으로 표시하지 않는다.

## CONV-0009 볼륨·추이·오늘 안내

[새 MVP 계약](volume-history-mvp.md)에 FR-14/15와 REP-04~06/SCI-03B를 연결했다. 관찰 계산/그래프와 과거 수행량 참고부터 제공하고 자동 증량/권장 세트는 충분성/노력/불편감·전문 검토 이후다. CONV-0006의 프로젝트 없음 표기는 당시 이력이며 현재 Supabase 연결 상태는 [진행 보고](implementation-progress.md)를 따른다.

## 종료 수정과 현재 재계산

실제 browser에서20kg×8 기록을40kg×6으로 명시 수정한 뒤 같은 조건 볼륨240kg·회로 바뀌는 것을 확인했다. 완료/시각은 그대로이며 준비 세트 변경은 본세트 집계에서 제외된다. 현재 리포트는 liveQuery의 최신 기록을 계산하므로 오래된 저장 report를 노출하지 않는다. 저장 report/충분성/정책 version·검토 매핑은 후속이다. [재사용/수정 계약](../operations/record-reuse.md).
