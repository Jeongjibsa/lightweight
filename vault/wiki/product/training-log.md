---
type: "Feature Specification"
title: "루틴과 간편 운동 기록"
description: "세트 입력·단위·오프라인·예외 경험."
tags:
  - "product"
  - "training"
  - "logging"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T23:46:05+09:00"
sources:
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "local-contract"
    resource: "implementation-contracts.md"
    title: "로컬 구현 계약"
  - id: "local-progress"
    resource: "implementation-progress.md"
    title: "실행 결과와 남은 작업"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
  - id: "record-reuse"
    resource: "../operations/record-reuse.md"
    title: "재사용 계약"
  - id: "record-check"
    resource: "../../raw/research/2026-10-04-record-reuse-verification.json"
    title: "실행"
  - id: "request22"
    resource: "../../raw/conversations/2026-10-04-022.md"
    title: "카탈로그·휴식·제목·Git·Google 요청"
  - id: "request22-loop"
    resource: "../../raw/research/2026-10-04-catalog-rest-timer-loop.json"
    title: "실행/캡처"
  - id: "git-google"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "Git 구성/Google 검토"
---

# 루틴과 간편 운동 기록

FR-05·FR-06. [기획서](prd.md). 루틴은 이름·요일·운동 순서·세트/반복·메모를 저장한다. 복사, 지난 세션으로 만들기, 운동 추가/삭제/정렬, 대체, 버전을 제공한다. 수정이 과거 세션에 소급되지 않는다.

## 기록 경험

오늘 루틴·진행, 운동별 이전 값·현재 중량/횟수·준비/본세트·완료·휴식. 상세는 펼쳐 입력한다. 직전 값 복사, 중량 +/−, 숫자 키패드, 다음 세트 포커스, 완료 취소/수정을 지원한다. RIR은 선택 입력하고 개념을 교육한다. 생략 세트는 미수행으로 남기며 계획값을 실제 수행으로 자동 확정하지 않는다.

| 상황 | 입력 기준 |
|---|---|
| 바벨 | 봉 포함 총 외부 중량인지 표시 |
| 덤벨 | 한 손 중량·장비 개수 분리 |
| 머신 | 표시 중량·머신 ID, 다른 머신 비교 제한 |
| 맨몸 | 체중/추가 중량 구분, 체중 미입력 허용 |
| 보조 운동 | 보조량/추가량 구분 |
| 단측 | 좌우·각 측 반복·세트 쌍 기준 |
| 시간 운동 | 초, 반복 지표와 구분 |
| 준비 세트 | 기록 가능, 본세트 집계 제외 |

kg/lb 전환에도 원 입력과 정규화 값 보존. 유효한 0과 결측 구별. RIR 누락은 0으로 채우지 않는다. 드롭/슈퍼세트 확장 전 자유 메모를 집계상 별도 세트로 오인하지 않는다.

## 예외 흐름

기구 사용 중에는 세션만 대체/루틴도 변경을 고른다. 전화/종료 후 진행 복원. 오프라인 기록·타이머 지속 후 중복 없이 동기화. 완료/부분 완료/취소 구분. 삭제에는 취소/복구 경로와 리포트 재계산을 제공한다.

## 수용 기준

이전 값이 있으면 완료 탭으로 저장한다. 중복 탭/동기화 재시도는 동일 세트를 중복 생성하지 않는다. 수정/취소 후 집계가 일치한다. 작은 화면에서도 조작할 수 있다.

## Related

[리포트](reports.md) · [데이터](data-model.md) · [검증](validation-plan.md)

## CONV-0006 이후 현재 구현 경계

특정 iPhone 모델에 한정하지 않는 반응형과 각 사용자별 목표·주당 횟수·분할·시간·장비·단위·시간대 설정을 요구사항으로 추가했다. 본인의 조건은 하나의 시험 표본이다. Supabase 프로젝트가 없으므로 로컬부터 구현한다는 사용자 선택을 반영했다. [로컬 계약](implementation-contracts.md) · [실행 결과](implementation-progress.md).

로컬 프로필/기록·루틴 스냅샷·백업·사실 집계·PWA는 구현했으며 계정/RLS·서버 전송·실제 iOS·검토된 시각/설명·추천/티어·완전한 개인화·배포는 미완료다. 기존 실사용/지인 제공 관문은 유지한다. 로컬 프로필을 인증 계정으로, 개념도를 자극 범위로, 분류별 행 수를 근육 성장량으로 표시하지 않는다.

## CONV-0010 UI/UX 변경

오늘 시작/재개·루틴 행 바로 시작·운동 행 한 번 추가·새 루틴 연속 선택·세트 기본 입력과 상세 Accordion·운동 add/end dock. 데이터 영향 확인은 보존하고 이전 값/설정 snapshot·outbox 계약을 유지한다. [디자인 규칙](design-system.md) · [감사](design-audit.md).

## 현재 재사용·수정 증분

[재사용 계약](../operations/record-reuse.md)을 적용했다. 이전 값을 명시 불러오고 종료 운동을 오늘 계획으로 복사하며, 세션 안의 미완료 종목만 교체할 수 있다. 종료 기록은 명시 수정/CAS로 완료·시각을 보존하고 리포트를 다시 계산한다. 기존 계획 정렬/메모·삭제 복구·세밀한 장비 조건과 실제iPhone은 후속이다.

## CONV0022 구현/검토 — 2026-10-04

34종목/바벨18·큰 부위 아래 세부 분류/장비·별칭 필터와 사용자 추가 선택을 적용했다. 기본1분·즐겨찾기3~4개·완료 자동 시작·pause/resume/stop·deadline 재실행·profile/outbox/백업 보존을 구현했다. 다섯 H1 outline을 제거하고 programmatic focus는 유지했다.98개/19파일·Node8·전체30browser/최종문구6·build/types/format/artifact25, lint기존6경고. 실제 좁은 화면에서 문구 잘림을 찾아 수정했다. [계약/실행](../operations/catalog-rest-timer.md).

GitHub source=Jeongjibsa/lightweight·main·자동 배포 활성화를 읽었고 dependency 설치/Node24·승인된 production 공개 연결/빈 preview를 보완했다. 새 commit의 자동 Git 배포/원격 CI는 기록 시점 별도다. [배포 운영](../operations/pages-git-integration.md). Google OAuth는 가능하며 현재providerOFF/callback없음·credential/동일UID 연결/가입 차단·실기기 복귀가 필요하다. [검토](google-oauth-review.md). 과학 승인 콘텐츠0개/실제 운동·새 기기/나머지 G3/메일·운영·파일럿/P2 관문과 다음 운동 후 사용자 확인 일정은 유지한다.
