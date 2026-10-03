---
type: "Implementation Backlog"
title: "운동 PWA 구현 백로그와 완료 기준"
description: "작업 ID·선행 조건·실제 검증 기준·상태·후속 식단/AI 범위를 추적한다."
tags:
  - "product"
  - "implementation"
  - "backlog"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:20:54+09:00"
sources:
  - id: "implementation-request"
    resource: "../../raw/conversations/2026-10-03-005.md"
    title: "계획 요청과 운동 우선 선택"
  - id: "implementation-plan"
    resource: "implementation-plan.md"
    title: "단계별 작업계획"
  - id: "validation"
    resource: "validation-plan.md"
    title: "검증 조건"
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "local-contract"
    resource: "implementation-contracts.md"
    title: "로컬 구현 계약"
  - id: "local-progress"
    resource: "implementation-progress.md"
    title: "실행 결과와 남은 작업"
  - id: "harness-request"
    resource: "../../raw/conversations/2026-10-04-007.md"
    title: "하네스 요청"
  - id: "harness"
    resource: "../operations/testing-harness.md"
    title: "현재/확장 구조"
  - id: "cloud"
    resource: "supabase-integration.md"
    title: "현재 연결"
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "이번 요구"
  - id: "volume-mvp"
    resource: "volume-history-mvp.md"
    title: "추가 MVP"
version: "0.4.0"
approval_status: "proposal"
change_id: "CHG-0009"
---

# 운동 PWA 구현 백로그와 완료 기준

> 계획 v0.3.0. 반응형·사용자별 설정을 반영한 로컬 구현을 진행했다. **운동 먼저, 식단 다음**은 사용자 선택이고 상세 항목은 구현 제안이다. 상태: `ready`는 착수 후보, `planned`는 선행 조건/선택이 남음, `in_progress`·`blocked`·`done`은 실제 진행 후 기록한다. 로컬 증분의 완료/부분 진행은 아래와 [실행 결과](implementation-progress.md)에 기록한다. 원래 작업의 전체 기준이 남으면 in_progress를 유지한다.

## 기준과 책임

각 작업의 범위는 작은 증분으로 나눌 수 있다. 개발 담당이 구현/시험하고, 사용자 확인이 필요한 미결은 [Q 목록](open-questions.md)으로 추적한다. SCI 작업의 내용 검토와 REL 작업의 실제 기기 확인은 코드 리뷰와 별도다. `done`으로 바꿀 때 산출물·실행한 검사·버전·결과를 아래 실행 기록에 남긴다. 코드 없는 문서/디자인 작업에는 그에 맞는 검토 결과를 쓴다.

이 표는 의존성을 설명하는 백로그이며 병렬 에이전트 실행 지시가 아니다. SCI-01 근거 검토는 PRE-03 이후부터 다른 개발 증분과 겹쳐 진행할 수 있다. [전체 단계/공수](implementation-plan.md).

## 운동 MVP

UI-01: Mantine/Spoqa/스택 명시 **done**. FR-12에 연결하며 정확한 버전/적용 범위는 [스택](technology-stack.md). FR-13/SYNC의 연결 증분은 [Supabase 계약](supabase-integration.md).

| ID | 단계 | 작업과 산출물 | 선행 조건 | 완료 기준 | 상태 |
|---|---|---|---|---|---|
| PREF-01 | M0~M2 | 프로필별 목표/횟수/분할·시간/장비/단위/시간대 입력·수정·보존 | FR-11, 로컬 계약 | 새 사용자 미설정, A/B 다른 설정·기록 분리, 변경 시 과거 스냅샷 보존 | done |
| RESP-01 | M1~M6 | 기종 무관 화면 재배치·입력/초점·safe area | FR-10 | 주요 화면320~1440px, 가로/키보드/확대·실제 Safari 검증 | in_progress |
| PRE-01 | M0 | 기록/단위·집계·소유 관계·동기화·삭제·복원 계약과 가짜 표본 | 현재 PRD/상세 | 계획8/완료6/준비2·0/결측·좌우·보조·재시도·충돌의 예상 결과 정의 | in_progress |
| PRE-02 | M0 | 반응형 5개 화면과 사용자별 설정·한 손 입력·빈/오류/오프라인 시안 | 현재 흐름 | 탐색→루틴→완료→리포트 연결, 큰 화면/키보드에서도 완료 버튼 조작·세트 수정 과업 리뷰 | in_progress |
| PRE-03 | M0 | 사용자 조건별 종목 후보/검토 목록, 본인 표본 주3~4회·무분할~3분할, 공개 저장소/미결 관리 | 현재 library/Q | 골격근량 증대 목표 반영, 경험/종목/장비/시간 미결과 콘텐츠/비밀 경계·검토 책임 기록 | in_progress |
| BASE-01 | M1 | app TypeScript/React/Vite·Zod 후보·Vitest/Playwright·검사/CI | PRE-01 | 지원 런타임/버전 lockfile·strict 타입 검사·빌드·핵심 계약 검사 통과; 실제 비밀 없음 | done |
| BASE-02 | M1 | 공통 화면·PWA manifest/서비스 워커·업데이트 안내 | BASE-01, PRE-02 | 작은 화면/키보드 조작, 준비 후 오프라인 앱 실행, 업데이트 제어 시안 | in_progress |
| LOG-01 | M2 | 부위·장비/이름 필터·운동/변형·사용자 추가 운동 | BASE-02, PRE-03 | 선택 ID/변형 유지; 미등록 부위/사용자 운동의 검토 상태 표시 | in_progress |
| LOG-02 | M2 | 운동 상세·2D 근육 지도·수행 그림/대체 텍스트 | LOG-01 | 주/보조 역할을 색 외에도 설명; 자극% 미표시·콘텐츠/권한 상태 구분 | in_progress |
| LOG-03 | M2 | 루틴 작성·복사·정렬·편집·이전 세션 재사용 | LOG-01, PRE-01 | 수정해도 이전 세션의 계획/종목 버전 보존, 세션 대체와 루틴 수정 구분 | in_progress |
| LOG-04 | M2 | 오늘 세션·이전 값·중량/횟수·완료/수정/취소 | BASE-02, PRE-01; 전체 연결은 LOG-03 | 부하 방식별 원값·단위·좌우·준비/본세트·상태 저장; 필수 값 오류 처리 | in_progress |
| LOG-05 | M2 | Dexie 트랜잭션/outbox·재개·휴식 타이머 | LOG-04 | 저장 실패 시 성공 금지, 중복 탭 0중복, 재시작/잠금 후 상태 복귀 | in_progress |
| LOG-06 | M2 | JSON 내보내기·가져오기/복원·삭제 흐름 | LOG-05 | 가짜 데이터 빈 저장소 복원 동일, 형식/계정/중복/삭제 정책; 미전송 포함 표시 | in_progress |
| SYNC-01 | M3 | SQL migrations·제약·필요 grants/RLS·형식/범위 계약 | PRE-01, LOG-05 | 부모/자식 소유 일치·타인 user_id 대입/변경 차단, DB 초기 구성 재현 | in_progress |
| SYNC-02 | M3 | 초대 Auth·실제 로그인 경로·계정별 로컬 DB·로그아웃 | SYNC-01; Q-15 | 가입/익명 차단·메일/복구 시험, 계정 전환 비노출/오전송, 만료 시 로컬 대기 유지 | in_progress |
| SYNC-03 | M3 | outbox 전송/확인·중복 처리·서버 변경 내려받기 | SYNC-02 | 같은 operation 재시도/응답 유실 0중복, 서버 확정 기준/페이지 경계에서 변경 누락 없음 | in_progress |
| SYNC-04 | M3 | 편집/삭제 충돌·복원 병합·오래된 응답 처리 | SYNC-03, LOG-06 | 두 편집 보존, 사용자 해결 추적, 오프라인 재접속 삭제 재등장 없음 | in_progress |
| SYNC-05 | M3 | A/B/비로그인 API·동기화/복원 통합 검증 | SYNC-01~04 | 구현된 CRUD·RPC·내보내기·부모 바꾸기 차단, 새 기기 동기화분 복원; 후속 리포트 API는 REL-02 재검사 | in_progress |
| REP-01 | M4 | 세션/주간·계획 대비·직접/간접·동일 조건 추세 계산 | LOG-05, PRE-01 | 고정 표본 합계/단위 일치, 분모0 N/A, 직접/간접 중복 없음 | in_progress |
| REP-02 | M4 | 리포트 화면·충분성·기간/입력revision·오래된 결과 | REP-01, SYNC-03 | 기록 수정 후 재계산, 조건 다른 추세 보류, 로컬 미전송 포함/서버 기준 구분 | in_progress |
| REP-03 | M4 | 관찰/한계/다음 행동 템플릿 | REP-02, SCI-01의 해당 주장/정책 검토 | 숫자/근거 생성 없음, 데이터 부족 요약 가능, 자동 루틴/중량 변경 없음 | planned |
| REP-04 | M4 | 운동/일별 볼륨·조건/단위/coverage 계산 | LOG-05, HAR-01 | 소유자/준비·삭제·0/N/A/kg/lb/한손·머신/시간 독립 계약 검사 | ready |
| REP-05 | M4 | 기간/운동/지표 그래프·표·재계산 | REP-04, HAR-02 | 날짜 간격·결측 보류·유효1점·narrow UI/기간/조건 선택·reload | planned |
| REP-06 | M4 | 오늘 사용자 루틴/과거 수행량 참고 후보 | REP-04, PREF-01, LOG-03 | 최근 종료/같은 설정·장비·자료 부족/오늘/진행 보류, 명시 선택·과거량 표시 | planned |
| SCI-03B | M5 | 과거 수행 기반 권장 운동량 조정 | REP-06, SCI-01~03; 경험/effort/불편감 | 검토된 정책·충분성/보류·이유·사용자 채택, 자동 증량/최적량 단정 없음 | planned |
| SCI-01 | M0~M5 | 논문/해부학·정정/철회·대상/측정/비교·제안 수치 검토 등록 | PRE-03 | 공개 주장별 출처/읽은 범위/제약/검토자/일자·전문 공백 기록; 미검토 정책 제공 차단 | planned |
| SCI-02 | M5 | 공개 콘텐츠/규칙 등록부와 앱 JSON 빌드 | SCI-01, LOG-02 | 검토·권한 확인한 파일만 출력, 링크/ID/버전/검토 상태 검사, vault 원문 번들 제외 | planned |
| SCI-03 | M5 | 프로필별 목표·횟수·분할 조건 루틴/대체·시간/장비 검사·채택 저장 | SCI-02, LOG-03, REP-01; Q-01/06 | 검토된 규칙만 사용, 3↔4회/분할 변경·누락·장비/시간 처리·입력/출력/근거 버전 재현 | planned |
| SCI-04 | M5 | 한 부위 조건 티어·이유·근거 배지·갱신일 | SCI-02, REP-03 | 직접 비교 없는 경우 보류/동등 허용, 목표/장비별 일관성·단일 연구 자동S 금지 | planned |
| REL-01 | M6 | Pages preview/운영·HTTPS origin·환경/인증 URL 분리 | BASE-02, SYNC-05; Q-08/16/17 | preview 제한·개발 데이터, app/dist만 배포, 도메인 우회와 API 별도 검사 | planned |
| REL-02 | M6 | 실제 iPhone 16 Pro Max/iOS 27.0.1·API·콘텐츠/보안 통합 검증 | M2~M5, REL-01; 실제 기기 사용 가능 | 설치→추천/루틴→오프라인 기록→재연결→리포트→복원·업데이트 G3 통과; 사용자 보고 OS 현장 확인 | planned |
| REL-03 | M6 | 본인 제공·운영/백업/복구·비용/회수 안내 | REL-02; Q-08/15 | 실제 기록/토큰 없는 안내, 사용자별 삭제/내보내기·운영 복원시험·장애 대응 증거 | planned |
| PIL-01 | M7 | 본인 사용 관찰·불편/기록 유실/리포트 해석 수정 | G3 | 4주 관찰 제안·실제 세션 대비 누락/실패/다음 행동 기록, 문제별 수정/재검증 | planned |
| PIL-02 | M7 | 소수 지인 계정·설치/메일/기록/복원 과업 | G4, 본인 핵심 과업 안정 | 초대 계정 독립성·실기기 과업 확인; 지인 수/확대 여부는 사용자 선택 | planned |

PRE와 화면/계산 개발은 미결인 종목/장비·호스팅 선택 전 가능한 범위를 진행한다. 본인 목표/일정/기기는 하나의 시험 표본으로 쓰고 새 사용자의 설정을 별도로 받는다. 경험/종목/장비/시간은 SCI-03 전에 확인한다. 호스팅 선택은 REL-01, 로그인/메일은 SYNC-02, 실제 기기 동작은 REL-02에서 검증한다. 지인 제공은 4주 경과만으로 자동 실행하지 않고 G4와 관찰된 안정성을 확인한다.

## 검증 하네스 개선 — CONV-0007 이후 제안

기존 BASE-01의 기본 구성 완료와 별도로, 자동 회귀 확대를 추적한다. HAR-01은 구현했고 HAR-04 migration/HAR-06 원격 계약 일부는 진행했다. 나머지 자동 UI/CI 증거 작업은 아직 구현하지 않았다. [구조/시나리오](../operations/testing-harness.md) · [루프](../operations/loop-engineering.md).

| ID | 작업 | 선행 조건 | 완료 기준 | 상태 |
|---|---|---|---|---|
| HAR-01 | 단위/통합 projects·fixture/독립 기대값·공통 명령 | BASE-01/현재16개 | 기존검사 보존, unit에 DB 불필요, 날짜/시간대 결정적, 로컬/CI 같은 명령 | done |
| HAR-02 | 세트 입력·오류·복원·프로필 전환 DOM 통합 | HAR-01 | blur/click·반복 클릭·실패 재시도·전환 중 저장 상태 확인, 사용자 라벨 기반 | in_progress |
| HAR-03 | 버전 고정 browser runner·빌드 preview·핵심 E2E | HAR-01; 입력 계약은 HAR-02 연결 | E2E-01~04, Chromium PWA/WebKit UI 경계·context 격리, 동일 환경3회 안정 제안 | planned |
| HAR-04 | 저장 실패·큰 백업·migration·V1/V2 업데이트 | HAR-03, LOG-05/06 | 최초 실패 증거·기존 데이터 보존·RISK-BACKUP-01 재현/정책·E2E-05·실기기 절차 | in_progress |
| HAR-05 | CI 검사 분리·실패 trace/console/실행 메타데이터 | HAR-01/03 | 실패해도 증거 보존·artifact 접근/보존·첫 실패 유지·외부 CI 실제 실행 결과 | planned |
| HAR-06 | 보존/권한/계산/근거의 scenario 추적·원격/콘텐츠 평가 | HAR-01; 원격은 SYNC, 콘텐츠는 SCI | 계약→검사/검토→증거 연결, 미지원 not_run, 잘못된 계산/주장/타인 접근 반례 | in_progress |

## 운동 MVP 다음

| ID | 범위 | 선행 조건 | 완료 기준 | 상태 |
|---|---|---|---|---|
| NUT-01 | 음식 DB 권한/표본 검색·기준량/조리/성분·커버리지 계약 | 운동 안정화·사용자 우선순위 | 실제 라이선스/API/누락 품질 검토·0/미분석 구별 | planned |
| NUT-02 | 식사 기록·양 수정·최근/즐겨찾기·하루 완료 | NUT-01 | 성분 스냅샷·양 계산/복원·동기화, 미기록을0 처리하지 않음 | planned |
| NUT-03 | KDRI/공식/단백질·활동/체중 추세 적용 검토 | NUT-01, 해당 전문 자료/검토자 | 기준/정오표/적용 범위·필수 입력·단위 표본과 과도한 진단 문구 검사 | planned |
| NUT-04 | 열량/영양 리포트·부족 가능성·커버리지/추천 음식 | NUT-02~03 | 합계 재현·누락/기준 종류별 보류·활동 중복 가산 없음·G5 통과 | planned |
| AI-01 | 선택: 서버 AI 설명·인증/비용 상한·검증/고정 템플릿 대체 | 운동 MVP 안정화·예산/제공자 선택 | 입력 숫자/근거 ID 검증·미로그인/타인 호출 차단·장애에도 원리포트 제공 | planned |

식단 단계 공수는 NUT-01 데이터/권한 표본 확인 후 별도로 추정한다. AI-01은 식단의 필수 선행 조건이 아니며, 현재 MVP의 규칙 기반 추천/티어/리포트와 구분한다.

## 요구사항 추적

| 요구 | 주요 작업 | 공개/실사용 조건 |
|---|---|---|
| FR-01 탐색 | LOG-01, SCI-02 | 파일럿 콘텐츠 범위·빈 상태 표시 |
| FR-02 시각/자극범위 | LOG-02, SCI-01~02 | 근육/동작/권한 검토·대체 텍스트 |
| FR-03 추천 | SCI-03 | 검토 규칙·조건·근거·사용자 채택 |
| FR-04 티어 | SCI-04 | 한 부위부터 조건/보류/근거 배지 |
| FR-05 루틴 | LOG-03 | 과거 계획 버전 보존 |
| FR-06 기록 | LOG-04~06, SYNC-01~05 | G2 보존·접근·복원 |
| FR-07 리포트 | REP-01~03 | 계산/충분성·버전/수정 재현 |
| FR-08 식사 | NUT-01~02 | 다음 출시, 원요구 유지 |
| FR-09 영양/열량 | NUT-03~04 | 다음 출시, 검토/성분 품질 |
| FR-10 반응형 PWA | RESP-01, BASE-02, REL-01~02 | 여러 폭 + 실제 기기 G3 |
| FR-11 사용자별 설정 | PREF-01, PRE-01, SCI-03 | 설정/기록 소유 분리·간편 변경·과거 조건 보존 |
| FR-12 UI/글꼴/스택 | UI-01 | Mantine/공식 WOFF2·정확한 의존성 문서 |
| FR-13 클라우드/가입 제한 | SYNC-01~05 | 연결 증분·실계정 검증 |
| FR-14 볼륨/그래프 | REP-04/05 | 관찰 계산/조건·N/A·재계산/표 |
| FR-15 오늘/권장량 | REP-06, SCI-03B | 기록 참고 후보와 검토된 조정 구분 |
| QA-01 하네스·반복 개선 | HAR-01~06 | 계층별 재현·실패 증거·회귀, 실기기/근거 검토 별도 |
| KM-01/02 vault·이력 | 모든 의미 변경 | OKF 구조 검사·raw/CONV/CHG/PRD snapshot 유지 |

## 실행 기록

HAR-02: DOM 입력/transaction 실패·재시도/결측수정3과업을 추가했다. unit6/integration24/ui3·lint/build/format 통과. backup/Auth 전환/실browser 과업은 남아 in_progress. [원본](../../raw/research/2026-10-04-dom-harness-verification.json).

2026-10-04 CONV-0008: UI-01/HAR-01 완료, SYNC-01~05 in_progress. private RPC/RLS/allowlist·CAS/idempotency·manual snapshot/recovery/schema2 및 공개 가입 차단 적용. unit6/integration24/원격SQL16·HTTP401·format/lint/build 통과. 실제 Auth E2E와 자동 병합/대용량/삭제·DOM/E2E/외부 CI는 남아 있어 SYNC 전체를 done으로 바꾸지 않았다. HAR-04 schema1→2·HAR-06 원격 계약 일부 in_progress. [증거](../../raw/research/2026-10-04-mantine-supabase-verification.json).

2026-10-03 / app0.1.0 / CHG-0006. PREF-01의 로컬 범위와 BASE-01 구현/로컬 검사는 완료했다. CI는 설정했으며 외부 실행 미확인. M2 주요 기능·기초 집계·PWA/백업은 구현했으나 각 작업의 이전 값/과학 시각/실기기/계정 범위가 남아 in_progress다. [실행 결과](implementation-progress.md)에 산출물·검사·미완료를 기록했다. SYNC/SCI/REL/NUT 완료로 변경하지 않았다.

기록 양식: 작업 ID / 상태 / 산출물 경로·버전 / 실행일·기기 / 검증과 결과 / 남은 문제 / 관련 변경 기록. 실패 시 해당 항목을 다시 열고 선행 조건을 변경하면 이유를 적는다.

[구현 계획](implementation-plan.md) · [PRD](prd.md) · [검증](validation-plan.md) · [CONV-0005](../conversations/2026-10-03-005.md) · [CHG-0005](../../history/changes/CHG-0005.md)
