---
type: "Data Model"
title: "데이터 모델 초안"
description: "핵심 관계·버전·개인 데이터 보존 기준."
tags:
  - "product"
  - "data"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:02:14+09:00"
sources:
  - id: "platform"
    resource: "platform-distribution.md"
    title: "개인 사용·백업 제안"
  - id: "storage"
    resource: "../sources/SRC-020-webkit-storage.md"
    title: "WebKit 저장소"
  - id: "technology"
    resource: "technology-data-storage.md"
    title: "계정·동기화 계약"
  - id: "stack-agreement"
    resource: "../../raw/conversations/2026-10-03-004.md"
    title: "스택 동의와 배포·보안 의견 요청"
  - id: "deployment"
    resource: "deployment-security.md"
    title: "배포·보안 추천"
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
  - id: "current-cloud"
    resource: "supabase-integration.md"
    title: "현재 연결 증분"
---

# 데이터 모델 초안

## 현재 구현 상태 — 2026-10-04

현재 서버는 사용자별 private members/workspaces/operations의 전체 JSON snapshot 증분이다. [연결 계약](supabase-integration.md)에 CAS/idempotency·교체/recovery를 적었다. 아래 정규화 entity 모델은 후속 설계이며 모두 서버 테이블로 구현된 것은 아니다. local DB schema2는 cloud 상태만 추가하고 기존 개인 기록을 보존했다.


PWA 진행은 확정했다. TypeScript·React/Vite·IndexedDB/Dexie·Supabase 기본 스택은 사용자 동의로 채택했다. [기술 상세](technology-data-storage.md)는 제안과 미결을 함께 관리한다. 아래는 [기획서](prd.md)의 논리 모델이다.

| 엔터티 | 핵심 데이터/관계 |
|---|---|
| Profile | 로컬 소유자 ID·선택 계정 user_id·목표·경험·일정·장비·선호·제약·단위·시간대 |
| Muscle | 근육 ID·이름·지도 영역·해부학 검토 |
| Exercise/Variant | ID·별칭·장비·조건·부하 방식·버전 |
| ExerciseMuscleMapping | 주/보조 역할·직접/간접·근거·버전 |
| Asset | 파일·권한·저작자·대체 텍스트·검토 |
| Study/Claim | DOI/PMID·대상·결과·한계·검토 범위, 연구↔주장↔정책 |
| Routine/Version | 일정·종목·세트/반복·변경 이유 |
| Session/Set | UUID·현지 날짜·루틴/운동 버전·부하 방식·원값/단위·횟수/초·종류·좌우·RIR·상태 |
| Recommendation | 입력 스냅샷·후보·규칙/근거 버전·사용자 선택 |
| Report | 기간·집계·충분성·데이터/계산/근거 버전 |
| Food/Nutrient | 출처·기준량·조리·성분별 값/결측 |
| Meal/Day | 음식 스냅샷·양·사용자 확정·하루 완료 |
| BodyMeasurement | 시각·측정 조건·체중·선택 측정 |
| SyncOutbox (제안) | operation_id·사용자/기기/기록 ID·변경·base_revision·대기/전송/확인/충돌·재시도 |
| ServerChange (제안) | 서버 발급 revision/커서·소유자·기록 ID·삭제 표시·반영된 operation |

계획/수행 분리. UTC 시각과 기록 당시 시간대를 보존. 중량 0/결측 구분. 세트 UUID로 재시도 중복 방지. 동기화 충돌의 수정 버전과 해결 결과를 추적한다. 구체 전략은 기술 설계에서 확정한다.

내보내기는 기록과 해석 기준을 포함하는 방향. 삭제는 활성 데이터·캐시·파생 리포트·백업 정책을 다룬다. 세부 법적 기준은 시장 확정 후 조사한다. 제품 지식은 vault, 실제 개인 건강 기록은 별도 앱 저장소로 관리한다. AI와 개발 로그에 불필요한 개인 원문을 보내지 않는다.

## 개인 사용과 백업 설계 제안

본인 한 기기부터 시작한다. Profile에 로컬 소유자 ID를 두고 루틴·세션·리포트의 소유 관계를 명확히 한다. 서버 동기화를 도입하면 인증된 사용자 ID와 연결하며 다른 지인의 기록이 섞이지 않도록 한다. 로그인 없는 프로필은 입력 시험의 제안이다. 이번에는 실제 기록 누적부터 계정 DB를 함께 두는 안을 우선 추천한다. Supabase 방향은 합의했으며 상세 설정은 미정이다.

Backup은 형식 버전·내보낸 시각·단위·시간대·운동/규칙 버전과 기록의 안정 ID를 포함하는 JSON을 제안한다. 가져오기는 형식 확인·중복 ID 처리·전체 복원/병합 선택을 설계하고 새 저장소에서 복원을 검증한다. CSV는 사람이 읽는 보조 형식이며 전체 복원 형식을 대체하지 않는다.

웹 로컬 저장만으로 영구 보존을 가정하지 않는다. 계정 DB 동기화를 우선 추천하되 독립 백업과 구분한다. 사용자 JSON 내보내기/복원과 운영 DB 백업의 소유·접근 범위를 분리한다. [플랫폼·배포](platform-distribution.md) · [WebKit 저장소](../sources/SRC-020-webkit-storage.md).

## 계정·동기화 계약 제안

개인 기록의 user_id를 인증 계정과 연결하고, 관계된 루틴/세션/세트의 소유자가 일치하도록 한다. Supabase의 필요한 grants와 RLS를 읽기·생성·수정·삭제에 적용하고 user_id 변경으로 권한이 이전되지 않게 한다. 실제 운영자의 전체 DB 접근과 사용자 간 권한 분리를 구분한다.

기기 저장과 outbox 등록은 한 트랜잭션이다. 서버는 operation_id로 재전송을 중복 처리하고 base_revision 충돌 시 두 편집을 보존한다. 응답 확인 전 미전송분은 기기에만 존재한다. 서버 커서로 변경·삭제 표시를 내려받고 동기화/백업 복원 시 중복과 삭제 재등장을 검증한다. 로컬 캐시와 큐는 계정별로 분리한다.

추천/리포트에는 입력 기록 ID/revision·대상 기간·계산/근거 버전과 데이터 기준(로컬 대기 포함/서버 동기화분)을 남긴다. 추세와 계산은 원기록으로 재현 가능해야 한다. [기술 저장 제안](technology-data-storage.md).

배포 노출 스키마·grants·RLS와 views/RPC를 함께 검증한다. 개인 파일·JSON 백업은 공통 운동 그림과 접근 정책을 분리한다. [배포·보안](deployment-security.md).

## 파일럿과 구현 과업

사용자가 보고한 골격근량 증대·주3~4회·무분할~3분할은 프로필/루틴 조건으로 반영한다. 실제 골격근량/체중/운동 기록은 vault가 아닌 계정별 앱 DB에서 관리한다. iPhone 16 Pro Max·iOS 27.0.1은 검증 환경이며 실제 동작 확인 전이다. [계획/데이터 계약](implementation-plan.md)·[PRE/LOG/SYNC/REP 작업](implementation-backlog.md).

## Related

[기록](training-log.md) · [리포트](reports.md) · [영양](nutrition.md)

## CONV-0006 이후 현재 구현 경계

특정 iPhone 모델에 한정하지 않는 반응형과 각 사용자별 목표·주당 횟수·분할·시간·장비·단위·시간대 설정을 요구사항으로 추가했다. 본인의 조건은 하나의 시험 표본이다. Supabase 프로젝트가 없으므로 로컬부터 구현한다는 사용자 선택을 반영했다. [로컬 계약](implementation-contracts.md) · [실행 결과](implementation-progress.md).

로컬 프로필/기록·루틴 스냅샷·백업·사실 집계·PWA는 구현했으며 계정/RLS·서버 전송·실제 iOS·검토된 시각/설명·추천/티어·완전한 개인화·배포는 미완료다. 기존 실사용/지인 제공 관문은 유지한다. 로컬 프로필을 인증 계정으로, 개념도를 자극 범위로, 분류별 행 수를 근육 성장량으로 표시하지 않는다.
