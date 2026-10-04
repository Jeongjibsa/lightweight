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
  at: "2026-10-04T22:03:27+09:00"
sources:
  - id: "cf-recheck"
    resource: "../../raw/research/2026-10-04-cloudflare-setup-recheck.json"
    title: "Cloudflare 공식 설정과 OAuth 재확인"
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
  - id: "volume-check"
    resource: "../../raw/research/2026-10-04-volume-history-verification.json"
    title: "볼륨/후보 구현 검사"
  - id: "settings-loop"
    resource: "../../raw/research/2026-10-04-settings-restore-loop.json"
    title: "복원 입력 회귀/수정"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
  - id: "design-verification"
    resource: "../../raw/research/2026-10-04-mantine-geist-design-verification.json"
    title: "UI 실행"
  - id: "tone-request"
    resource: "../../raw/conversations/2026-10-04-011.md"
    title: "Monokai/Mantine 톤 변경 요구"
  - id: "tone-verification"
    resource: "../../raw/research/2026-10-04-charcoal-theme-verification.json"
    title: "차콜 증분 실행"
  - id: "component-request"
    resource: "../../raw/conversations/2026-10-04-012.md"
    title: "컴포넌트 재점검/3D 요구"
  - id: "component-check"
    resource: "../../raw/research/2026-10-04-component-review.json"
    title: "실제 페이지별 관찰"
  - id: "profile-backup-loop"
    resource: "../../raw/research/2026-10-04-profile-backup-dom-loop.json"
    title: "HAR-02 최초 실패·실제 수정·59개 검사"
  - id: "e2e-request"
    resource: "../../raw/conversations/2026-10-04-013.md"
    title: "다음 순차 구현 요청"
  - id: "e2e-run"
    resource: "../../raw/research/2026-10-04-e2e-harness-verification.json"
    title: "9과업·27반복·최초 실패 증거"
  - id: "storage-request"
    resource: "../../raw/conversations/2026-10-04-014.md"
    title: "순차 요청"
  - id: "storage-run"
    resource: "../../raw/research/2026-10-04-storage-recovery-verification.json"
    title: "저장 보존 검사"
  - id: "ci-receipt"
    resource: "../../raw/research/2026-10-04-github-ci-37184261544.json"
    title: "GitHub CI 증거"
  - id: "cf-request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "Cloudflare 요청"
  - id: "cf-setup"
    resource: "../operations/cloudflare-setup.md"
    title: "연결 운영"
  - id: "gzip"
    resource: "../operations/compressed-backup.md"
    title: "압축 복구 계약"
  - id: "gzip-check"
    resource: "../../raw/research/2026-10-04-compressed-backup-verification.json"
    title: "실행"
  - id: "record-reuse"
    resource: "../operations/record-reuse.md"
    title: "재사용 계약"
  - id: "record-check"
    resource: "../../raw/research/2026-10-04-record-reuse-verification.json"
    title: "실행"
  - id: "pages-scope"
    resource: "../../raw/research/2026-10-04-pages-scoped-auth.json"
    title: "Pages 연결 확인"
  - id: "coverage"
    resource: "../operations/report-coverage.md"
    title: "기록 점검 계약"
  - id: "coverage-check"
    resource: "../../raw/research/2026-10-04-report-coverage-verification.json"
    title: "실행"
  - id: "email-complete"
    resource: "../../raw/conversations/2026-10-04-017.md"
    title: "사용자 이메일 인증 완료"
  - id: "deployment-check"
    resource: "../../raw/research/2026-10-04-pages-deployment.json"
    title: "실제 HTTPS 배포"
  - id: "redirect"
    resource: "../sources/SRC-047-auth-production-origin.md"
    title: "Auth 반환 주소"
  - id: "publication"
    resource: "../operations/content-publication.md"
    title: "공개 계약"
  - id: "publication-check"
    resource: "../../raw/research/2026-10-04-content-publication-gate.json"
    title: "검사"
  - id: "account-progress"
    resource: "../../raw/conversations/2026-10-04-018.md"
    title: "직접 등록 의사"
  - id: "final-release"
    resource: "../../raw/research/2026-10-04-release-account-gate.json"
    title: "최종 배포/권한 관문"
  - id: "account-approved"
    resource: "../../raw/conversations/2026-10-04-019.md"
    title: "지정 계정 SQL 승인·로그인"
  - id: "real-profile-roundtrip"
    resource: "../../raw/research/2026-10-04-auth-profile-roundtrip.json"
    title: "실제 빈 프로필 저장/조회/적용"
  - id: "workout-order-check"
    resource: "../../raw/research/2026-10-04-workout-order-loop.json"
    title: "종목 순서/가림 개선 확인"
  - id: "workout-order"
    resource: "../operations/workout-order.md"
    title: "기록 보존 계약"
  - id: "order-release"
    resource: "../../raw/research/2026-10-04-workout-order-release.json"
    title: "운동 순서 CI·실제 배포 일치"
version: "0.6.14"
approval_status: "proposal"
change_id: "CHG-0025"
---

# 운동 PWA 구현 백로그와 완료 기준

> 계획 v0.6.0. 반응형·사용자별 설정을 반영한 로컬 구현을 진행했다. **운동 먼저, 식단 다음**은 사용자 선택이고 상세 항목은 구현 제안이다. 상태: `ready`는 착수 후보, `planned`는 선행 조건/선택이 남음, `in_progress`·`blocked`·`done`은 실제 진행 후 기록한다. 로컬 증분의 완료/부분 진행은 아래와 [실행 결과](implementation-progress.md)에 기록한다. 원래 작업의 전체 기준이 남으면 in_progress를 유지한다.

## 기준과 책임

각 작업의 범위는 작은 증분으로 나눌 수 있다. 개발 담당이 구현/시험하고, 사용자 확인이 필요한 미결은 [Q 목록](open-questions.md)으로 추적한다. SCI 작업의 내용 검토와 REL 작업의 실제 기기 확인은 코드 리뷰와 별도다. `done`으로 바꿀 때 산출물·실행한 검사·버전·결과를 아래 실행 기록에 남긴다. 코드 없는 문서/디자인 작업에는 그에 맞는 검토 결과를 쓴다.

이 표는 의존성을 설명하는 백로그이며 병렬 에이전트 실행 지시가 아니다. SCI-01 근거 검토는 PRE-03 이후부터 다른 개발 증분과 겹쳐 진행할 수 있다. [전체 단계/공수](implementation-plan.md).

## 운동 MVP

UI-01은 당시 부분 Mantine/Spoqa/스택 명시 증분으로 done이었다. CONV-0010에서 전체 UI/Geist로 supersede하여 UI-02로 추적한다. FR-12에 연결하며 정확한 버전/적용 범위는 [스택](technology-stack.md). FR-13/SYNC의 연결 증분은 [Supabase 계약](supabase-integration.md).

| ID | 단계 | 작업과 산출물 | 선행 조건 | 완료 기준 | 상태 |
|---|---|---|---|---|---|
| UI-02 | M0~M2 | 전체 Mantine·Geist/차콜·하단5탭·클릭 단축·별도 branch | CONV-0010→0011/FR-12·16 | 디자인 계약/감사·키보드/빠른 추가/연속 선택·55개/빌드·25폭/화면 조합 관찰; 실기기는 RESP-01 | done |
| UI-03 | M0~M2 | Mantine 공식 예시 재감사·Select/Accordion·여백/중첩 표면·실제 페이지 캡처 | CONV-0012/FR-12·16 | 다섯 페이지 before/after·펼친 상세/선택창·20폭/화면 관찰·기존55계약 | done |
| PREF-01 | M0~M2 | 프로필별 목표/횟수/분할·시간/장비/단위/시간대 입력·수정·보존 | FR-11, 로컬 계약 | 새 사용자 미설정, A/B 다른 설정·기록 분리, 변경 시 과거 스냅샷 보존 | done |
| RESP-01 | M1~M6 | 기종 무관 화면 재배치·입력/초점·safe area | FR-10 | 주요 화면320~1440px, 가로/키보드/확대·실제 Safari 검증 | in_progress |
| PRE-01 | M0 | 기록/단위·집계·소유 관계·동기화·삭제·복원 계약과 가짜 표본 | 현재 PRD/상세 | 계획8/완료6/준비2·0/결측·좌우·보조·재시도·충돌의 예상 결과 정의 | in_progress |
| PRE-02 | M0 | 반응형 5개 화면과 사용자별 설정·한 손 입력·빈/오류/오프라인 시안 | 현재 흐름 | 탐색→루틴→완료→리포트 연결, 큰 화면/키보드에서도 완료 버튼 조작·세트 수정 과업 리뷰 | in_progress |
| PRE-03 | M0 | 사용자 조건별 종목 후보/검토 목록, 본인 표본 주3~4회·무분할~3분할, 공개 저장소/미결 관리 | 현재 library/Q | 골격근량 증대 목표 반영, 경험/종목/장비/시간 미결과 콘텐츠/비밀 경계·검토 책임 기록 | in_progress |
| BASE-01 | M1 | app TypeScript/React/Vite·Zod 후보·Vitest/Playwright·검사/CI | PRE-01 | 지원 런타임/버전 lockfile·strict 타입 검사·빌드·핵심 계약 검사 통과; 실제 비밀 없음 | done |
| BASE-02 | M1 | 공통 화면·PWA manifest/서비스 워커·업데이트 안내 | BASE-01, PRE-02 | 작은 화면/키보드 조작, 준비 후 오프라인 앱 실행, 업데이트 제어 시안 | in_progress |
| LOG-01 | M2 | 부위·장비/이름 필터·운동/변형·사용자 추가 운동 | BASE-02, PRE-03 | 선택 ID/변형 유지; 미등록 부위/사용자 운동의 검토 상태 표시 | in_progress |
| LOG-02 | M2 | 운동 상세·2D 근육 지도·수행 그림/대체 텍스트 | LOG-01 | 주/보조 역할을 색 외에도 설명; 자극% 미표시·콘텐츠/권한 상태 구분 | in_progress |
| LOG-03 | M2 | 루틴 작성·복사·정렬·편집·이전 세션 재사용 | LOG-01, PRE-01 | 직접 재시작/미완료 종목 교체 구현·원본 snapshot 보존; 루틴/오늘 종목 순서 구현·83개/22browser; 메모 등 후속 | in_progress |
| LOG-04 | M2 | 오늘 세션·이전 값·중량/횟수·완료/수정/취소 | BASE-02, PRE-01; 전체 연결은 LOG-03 | 이전 빈 값/종료 명시 수정·CAS/시각 보존 구현·72개/20browser; 오늘 종목 순서/CAS 보존 구현·83개/22browser; 남은 입력 UX/장비 식별 후속 | in_progress |
| LOG-05 | M2 | Dexie 트랜잭션/outbox·재개·휴식 타이머 | LOG-04 | 저장 실패 시 성공 금지, 중복 탭 0중복, 재시작/잠금 후 상태 복귀 | in_progress |
| LOG-06 | M2 | JSON 내보내기·가져오기/복원·삭제 흐름 | LOG-05 | 가짜 데이터 빈 저장소 복원 동일, 형식/계정/중복/삭제 정책; 미전송 포함 표시 | in_progress |
| SYNC-01 | M3 | SQL migrations·제약·필요 grants/RLS·형식/범위 계약 | PRE-01, LOG-05 | 부모/자식 소유 일치·타인 user_id 대입/변경 차단, DB 초기 구성 재현 | in_progress |
| SYNC-02 | M3 | 초대 Auth·실제 로그인 경로·계정별 로컬 DB·로그아웃 | SYNC-01; Q-15 | 가입/익명 차단·메일/복구 시험, 계정 전환 비노출/오전송, 만료 시 로컬 대기 유지 | in_progress |
| SYNC-03 | M3 | outbox 전송/확인·중복 처리·서버 변경 내려받기 | SYNC-02 | 같은 operation 재시도/응답 유실 0중복, 서버 확정 기준/페이지 경계에서 변경 누락 없음 | in_progress |
| SYNC-04 | M3 | 편집/삭제 충돌·복원 병합·오래된 응답 처리 | SYNC-03, LOG-06 | 두 편집 보존, 사용자 해결 추적, 오프라인 재접속 삭제 재등장 없음 | in_progress |
| SYNC-05 | M3 | A/B/비로그인 API·동기화/복원 통합 검증 | SYNC-01~04 | 구현된 CRUD·RPC·내보내기·부모 바꾸기 차단, 새 기기 동기화분 복원; 후속 리포트 API는 REL-02 재검사 | in_progress |
| REP-01 | M4 | 세션/주간·계획 대비·직접/간접·동일 조건 추세 계산 | LOG-05, PRE-01 | 고정 표본 합계/단위 일치, 분모0 N/A, 직접/간접 중복 없음 | in_progress |
| REP-02 | M4 | 리포트 화면·충분성·기간/입력revision·오래된 결과 | REP-01, SYNC-03 | 주간 입력 점검/revision/직접 수정 진입 구현·78개/20browser; 저장 report/검토 매핑 후속 | in_progress |
| REP-03 | M4 | 관찰/한계/다음 행동 템플릿 | REP-02, SCI-01의 해당 주장/정책 검토 | 기록 관찰/한계/바로가기 구현, 근거 기반 다음 행동은 검토 후; 자동 변경 없음 | in_progress |
| REP-04 | M4 | 운동/일별 볼륨·조건/단위/coverage 계산 | LOG-05, HAR-01 | 소유자/준비·삭제·0/N/A/kg/lb/한손·머신/시간 독립 계약 검사 | done |
| REP-05 | M4 | 기간/운동/지표 그래프·표·재계산 | REP-04, HAR-02 | 날짜 간격·결측 보류·유효1점·narrow UI/기간/조건 선택·reload | done |
| REP-06 | M4 | 오늘 사용자 루틴/과거 수행량 참고 후보 | REP-04, PREF-01, LOG-03 | 최근 종료/같은 설정·장비·자료 부족/오늘/진행 보류, 명시 선택·과거량 표시 | done |
| SCI-03B | M5 | 과거 수행 기반 권장 운동량 조정 | REP-06, SCI-01~03; 경험/effort/불편감 | 검토된 정책·충분성/보류·이유·사용자 채택, 자동 증량/최적량 단정 없음 | planned |
| SCI-01 | M0~M5 | 논문/해부학·정정/철회·대상/측정/비교·제안 수치 검토 등록 | PRE-03 | 공개 주장별 출처/읽은 범위/제약/검토자/일자·전문 공백 기록; 미검토 정책 제공 차단 | planned |
| SCI-02 | M5 | 공개 콘텐츠/규칙 등록부와 앱 JSON 빌드 | SCI-01, LOG-02 | registry/선택 JSON·receipt/hash/ID/full_review/asset gate 구현·승인0개; 실검토/UI/추천 규칙 연결 후속 | in_progress |
| SCI-03 | M5 | 프로필별 목표·횟수·분할 조건 루틴/대체·시간/장비 검사·채택 저장 | SCI-02, LOG-03, REP-01; Q-01/06 | 검토된 규칙만 사용, 3↔4회/분할 변경·누락·장비/시간 처리·입력/출력/근거 버전 재현 | planned |
| SCI-04 | M5 | 한 부위 조건 티어·이유·근거 배지·갱신일 | SCI-02, REP-03 | 직접 비교 없는 경우 보류/동등 허용, 목표/장비별 일관성·단일 연구 자동S 금지 | planned |
| REL-01 | M6 | Pages preview/운영·HTTPS origin·환경/인증 URL 분리 | BASE-02, SYNC-05; Q-08/16/17 | Pages/HTTPS/정확한 Auth 반환 URL·현재 앱 24file hash 확인 완료; 실제 운동/새 기기 Auth·Access/자동 배포·메일/복구 후속 | in_progress |
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
| HAR-03 | 버전 고정 browser runner·빌드 preview·핵심 E2E | HAR-01; 입력 계약은 HAR-02 연결 | E2E01~04·E2E06부분, Chromium5/WebKit4·독립context, 9과업×3회27통과·종료 수정 후9재확인 | done |
| HAR-04 | 저장 실패·큰 백업·migration·V1/V2 업데이트 | HAR-03, LOG-05/06 | 본 증분: quota 주입/native rollback·schema10→20·14,400세트/10MiB 경계·실제 waiting SW/업데이트 보존. gzip24,000세트/새context/손상거부 완료. 남음:64MiB초과 분할·physical quota/eviction·실기기·서버복구 | in_progress |
| HAR-05 | CI 검사 분리·실패 trace/console/실행 메타데이터 | HAR-01/03 | 187c47c GitHub check/Chromium/WebKit 성공·artifact 다운로드/첫실패trace 확인, 새HAR04는 local 검사 | done |
| HAR-06 | 보존/권한/계산/근거의 scenario 추적·원격/콘텐츠 평가 | HAR-01; 원격은 SYNC, 콘텐츠는 SCI | 계약→검사/검토→증거 연결, 미지원 not_run, 잘못된 계산/주장/타인 접근 반례 | in_progress |

## 운동 MVP 다음

| ID | 범위 | 선행 조건 | 완료 기준 | 상태 |
|---|---|---|---|---|
| VIS-3D-01 | FR-17 Web 3D/자산/권한·성능 가능성 검토만 | CONV-0012 | 일차 자료·읽은 범위·구현/자산 검수 미수행·후순위 계획 | done |
| VIS-3D-02 | P2 한 운동/변형의 asset·근육 분리/rig/clip·검토/예산 선정 | 운동 MVP/기록 안정화·SCI-01~02·VIS-3D-01 | rights·content 검토·파일 성능·renderer/budget 선택 | planned |
| VIS-3D-03 | P2 3D prototype·재생/정지·근육 설명·fallback·검토된 운동부터 확대 | VIS-3D-02·실기기 사용 가능 | 실제 Safari/GPU/기록 입력 영향·오프라인 용량·접근성 확인 | planned |
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
| FR-12 UI/글꼴/스택 | UI-01→UI-02→UI-03 | 전체 Mantine/Geist·한글 fallback·정확한 의존성 문서 |
| FR-16 native형 톤/하단/빠른 접근 | UI-02/03, RESP-01, REL-02 | 차콜/노란 강조·전 폭 하단·빠른 시작/추가, 실기기 후속 |
| FR-13 클라우드/가입 제한 | SYNC-01~05 | 연결 증분·실계정 검증 |
| FR-14 볼륨/그래프 | REP-04/05 | 관찰 계산/조건·N/A·재계산/표 |
| FR-15 오늘/권장량 | REP-06, SCI-03B | 기록 참고 후보와 검토된 조정 구분 |
| FR-17 3D 해부학 애니메이션 | VIS-3D-01~03, SCI-01~02 | 검토만 완료/P2후순위; asset/권한/내용·실기기 관문 |
| QA-01 하네스·반복 개선 | HAR-01~06 | 계층별 재현·실패 증거·회귀, 실기기/근거 검토 별도 |
| KM-01/02 vault·이력 | 모든 의미 변경 | OKF 구조 검사·raw/CONV/CHG/PRD snapshot 유지 |

## 실행 기록

## HAR-03/05 현재 증분 — 2026-10-04

`codex/e2e-harness`에서 @playwright/test1.63.0 runner·독립 production build/preview·빈 context·실제 UI 입력/파일 다운로드/복원·Chromium SW 오프라인을 추가했다. **Chromium5/WebKit4의9과업을 세 번씩27회 통과**했고, 종료 처리 수정 후9회 재확인했다. Vitest59개/13파일·lint 경고0/build/E2E typecheck/format도 통과했다. [불변 실행](../../raw/research/2026-10-04-e2e-harness-verification.json).

HAR-03은 로컬 runner 기준 done이다. HAR-05는 engine별 CI·실패 trace/화면/console/환경·고유 실행ID/코드 해시·7일보관 설정과 로컬 실패 probe를 완료했으나 **새 GitHub workflow 실행은 미확인이라 in_progress**다. 의도적 실패1개와 runner exit1을 부모 probe가 검증한 뒤 exit0으로 끝내며 정상9과업에는 probe를 넣지 않는다. E2E06은 다섯 화면×네 실제 폭/정보창 키보드·Escape focus 부분만 확인했다.

개인 기록·Auth·Supabase 외부 요청 없이 별도4188/빈 브라우저 context에서 가짜 자료만 생성했다. desktop WebKit은 실제 Safari/iPhone이 아니며 PWA는 Chromium에서만 검사한다. 실제 Auth/과학 콘텐츠/기기·HTTPS 관문과 HAR04 업데이트/quota/큰 백업은 남았다. PRD0.7.1은 현황 정정 PATCH, app0.2.0/schema2·기능 요구는 유지한다. 아래 문단은 이전 증분 이력이다.

## HAR-02 후속 — 로컬 프로필/파일 재시도 완료

CONV-0012의 순차 작업으로 실제 App/SettingsView·Mantine·Dexie/liveQuery를 연결했다. 백업 읽기 실패 후 같은 파일 재선택, A→B→A 설정/루틴 보존, 저장 중 프로필 전환/생성 차단, B 초기화 완료/조회 지연 중 A 입력 비노출의4개 DOM 계약을 추가했다. 세 제품 실패를 먼저 재현하고 FileButton resetRef·pending guard·workspace owner 확인으로 수정했다. [최초 실패/검사 원본](../../raw/research/2026-10-04-profile-backup-dom-loop.json).

현재 **unit19/integration25/ui15·59개/13파일**, lint 경고0/build/format:check 통과. 전용4177 가짜 화면에서 잘못된 파일의 한국어 오류→같은 경로의 정상 파일 재선택→복원 미리보기·취소를 확인했고,390px 복원 버튼 글자 잘림도 responsive SimpleGrid로 수정/재캡처했다. 실제 복원/DB 보존은 DOM 계약에서 확인했다. 본 후속 browser 실행에서는 미리보기에서 취소했다.

HAR-02의 **로컬 파일·프로필 DOM 부분**은 완료했으며 실제 Auth 전환은 남아 전체 상태를 in_progress로 유지한다. Auth client와 SW hook은 test-only 대체이며 실제 로그인/RLS/오프라인을 시험한 것이 아니다. 다음 순서는 HAR-03/05 자동 browser/CI 증거, 이어 HAR-04·실계정 SYNC·콘텐츠 SCI·실기기 REL 관문이다. PRD는0.7.0이고 기능 요구/데이터 schema/원격 설정 변경은 없다.


CONV-0012/UI-03: 이전 UI-02 완료는 당시 증분 이력이다. 사용자 불만으로 Select/Accordion·spacing·surface를 재점검해 수정했고 현재 감사에서 다섯 페이지/펼친 화면 캡처를 직접 확인했다.55개·lint/build/format·20폭/화면 overflow0. [재감사](component-review.md). VIS-3D-01은 검토 문서만 done이며 구현02/03은 후순위 planned다. 후속 HAR-02 로컬 file retry/profile DOM 계약은 위59개 증분에서 완료했고, 실제 Auth 전환/자동 browser는 남는다.

CONV-0011: UI-02의 팔레트만 차콜/노란 강조로 수정. theme/컴포넌트·PWA 색/아이콘,55개·lint/build/format·선택 화면320/390/1440px 확인. [원본](../../raw/research/2026-10-04-charcoal-theme-verification.json). 아래25조합/빠른 입력 검사는 CONV-0010 당시 이력이다.

UI-02: 별도 `codex/mantine-blue-dark` branch, 전체 Mantine·Geist·전 폭 하단탭/빠른 과업을 구현했다. unit19/integration25/ui11·55개/12파일·lint 경고0/build/format, 5화면×5실제 iframe폭 overflow0. UI 증분은 done이며 RESP-01/PRE-02/REL-02의 실제 Safari/키보드/확대/설치는 남는다. [감사](design-audit.md) · [원본](../../raw/research/2026-10-04-mantine-geist-design-verification.json).

LOOP-SETTINGS-RESTORE-01: 78e5cb1 이후 복원 입력 잔류를 실제 DOM/Store로 재현·수정. same-owner/revision 복원 재저장·unrelated session draft 보존2개 회귀. 전체52개/11파일·lint/build/format, 최종CUA update/리포트/폭 검사 통과. 실제browser 복원/계정 전환은 남아 HAR-02/LOG-06은 in_progress. [원본](../../raw/research/2026-10-04-settings-restore-loop.json).

REP-04/05/06 done: 계산/그래프·표/오늘 참고 후보와 독립unit13·Store 재계산1·DOM3을 추가. 합계50개/10파일, lint/build/format·가짜 CUA/리포트320/375/1440px 통과. SCI-03B planned; 실제 Auth/자동 E2E/실기기는 별도. [검사 원본](../../raw/research/2026-10-04-volume-history-verification.json). 복원 설정 입력 잔류가 발견돼 위 LOOP-SETTINGS-RESTORE-01에서 회귀 수정했다.

HAR-02: DOM 입력/transaction 실패·재시도/결측수정3과업을 추가했다. unit6/integration24/ui3·lint/build/format 통과. backup/Auth 전환/실browser 과업은 남아 in_progress. [원본](../../raw/research/2026-10-04-dom-harness-verification.json).

2026-10-04 CONV-0008: UI-01/HAR-01 완료, SYNC-01~05 in_progress. private RPC/RLS/allowlist·CAS/idempotency·manual snapshot/recovery/schema2 및 공개 가입 차단 적용. unit6/integration24/원격SQL16·HTTP401·format/lint/build 통과. 실제 Auth E2E와 자동 병합/대용량/삭제·DOM/E2E/외부 CI는 남아 있어 SYNC 전체를 done으로 바꾸지 않았다. HAR-04 schema1→2·HAR-06 원격 계약 일부 in_progress. [증거](../../raw/research/2026-10-04-mantine-supabase-verification.json).

2026-10-03 / app0.1.0 / CHG-0006. PREF-01의 로컬 범위와 BASE-01 구현/로컬 검사는 완료했다. CI는 설정했으며 외부 실행 미확인. M2 주요 기능·기초 집계·PWA/백업은 구현했으나 각 작업의 이전 값/과학 시각/실기기/계정 범위가 남아 in_progress다. [실행 결과](implementation-progress.md)에 산출물·검사·미완료를 기록했다. SYNC/SCI/REL/NUT 완료로 변경하지 않았다.

기록 양식: 작업 ID / 상태 / 산출물 경로·버전 / 실행일·기기 / 검증과 결과 / 남은 문제 / 관련 변경 기록. 실패 시 해당 항목을 다시 열고 선행 조건을 변경하면 이유를 적는다.

[구현 계획](implementation-plan.md) · [PRD](prd.md) · [검증](validation-plan.md) · [CONV-0005](../conversations/2026-10-03-005.md) · [CHG-0005](../../history/changes/CHG-0005.md)

## 현재 운영/계정 준비

96bbb74 main/GitHub3job·Pages/preview24file 일치 완료. Auth 등록1개/허용1개: exact account/SQL 방식 명시 승인 뒤 실제 Chrome 빈 프로필의 저장 ACK/revision1·조회/적용 완료. 실제 운동 기록·새 기기/A·B/만료/로그아웃·메일은 남는다. 실제 Auth/다기기·SCI/기기/파일럿 관문 상태를 유지한다.

## 현재 검증 배포

운동 순서 e912f0c main/GitHub3job success·운영/preview24file hash 일치 확인 완료.83 Vitest/Node8/browser22. 실제 Auth 빈 프로필 왕복은 확인했으나 운동/새 기기·A/B/만료·기기/SCI/운영/파일럿 관문은 유지한다.
