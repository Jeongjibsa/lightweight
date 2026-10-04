---
type: "Validation Plan"
title: "제품 검증과 출시 조건"
description: "사용성·근거·계산·예외 흐름의 검증 계획."
tags:
  - "product"
  - "validation"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T16:22:01+09:00"
sources:
  - id: "platform"
    resource: "platform-distribution.md"
    title: "iOS 사용과 설치"
  - id: "technology"
    resource: "technology-data-storage.md"
    title: "계정/동기화 검증"
  - id: "deployment"
    resource: "deployment-security.md"
    title: "배포·보안 추천"
  - id: "implementation-request"
    resource: "../../raw/conversations/2026-10-03-005.md"
    title: "계획 요청과 운동 우선 선택"
  - id: "implementation-plan"
    resource: "implementation-plan.md"
    title: "단계별 작업계획"
  - id: "implementation-backlog"
    resource: "implementation-backlog.md"
    title: "작업 ID와 의존성"
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
    title: "CONV-0007 요청"
  - id: "harness"
    resource: "../operations/testing-harness.md"
    title: "현재 검증 구조/개선"
  - id: "current-cloud"
    resource: "supabase-integration.md"
    title: "현재 연결 증분"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
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
---

# 제품 검증과 출시 조건

## 현재 구현 상태 — 2026-10-04

app0.2.0의 unit19/integration25/ui15·59개/13파일·lint/build/E2E타입/format, 자동browser9과업/27반복·최종9·실패probe를 확인했다. 기존 원격SQL16/비로그인HTTP401과 수동CUA 이력은 별도다. [이번 실제 범위](implementation-progress.md). SQL role/JWT는 실제 Auth E2E가 아니며 DOM/browser runner 로컬 검사는 완료했고 실제 iPhone·새 외부CI·운영배포/근거전문검토는 미완료다. 아래 출시 조건은 전체 통과를 의미하지 않는다.


app0.1.0의 로컬 시안과 기본 자동 검사는 구현했다. 아래 실사용/출시 조건은 전체 미통과이며 실제 결과는 [실행 보고](implementation-progress.md)와 [현재 하네스](../operations/testing-harness.md)에서 범위를 구분한다. [기획서](prd.md).

| 가설 | 과업 | 관찰 |
|---|---|---|
| 시각 설명이 선택을 돕는다 | 종목 선택 후 대상 근육·이유 설명 | 이해도·자극 개념 오해 |
| 기록이 빠르다 | 이전 값·새 값·수정·대체 | 시간·오류·손 이동 |
| 추천을 조정할 수 있다 | 일정/장비 변경 | 채택·설명 이해 |
| 리포트에서 행동을 고른다 | 부분 기록 주간 리포트 | 한계 이해·다음 행동 |
| 식단을 유지할 수 있다 | 한 끼 검색·식사 복사 | 검색 실패·양 수정 |

첫 검증은 본인의 실제 iPhone에서 진행한다. 홈 화면 설치 → 루틴 준비 → 실제 운동 기록 → 주간 리포트 → 백업 복원을 잇는 과업과 4주 사용 관찰을 제안한다. 안정된 후 지인 2~3명 정도의 설치·기록 과업으로 확장하는 제안이다. 한 명의 관찰은 사용성 문제를 찾는 근거이며 일반 효과 검증이 아니다.

## iPhone 설치·저장 검증

- 대상 iOS 버전에서 홈 화면 설치·독립 실행·화면 크기·키보드·한 손 입력 확인.
- 준비 완료 후 비행기 모드에서 루틴/운동 열람과 세트 저장, 온라인 복귀 시 중복 방지.
- 화면 잠금·앱 전환·강제 종료 후 기록과 휴식 타이머 상태 복귀.
- 캐시/DB 버전 업데이트 후 기록 보존; 저장 실패 표시·재시도.
- JSON 백업을 빈 저장소에 복원하여 세션·루틴·중량 방식·시간대 일치.
- 지인 제공 시 기록 독립성; 서버 도입 시 다른 사용자 데이터 접근 차단.
- PWA 채택 확정. 서비스 워커 업데이트를 운동 기록 중 적용해도 입력 손실이 없도록 저장/업데이트 시점 검증.

위는 계획이며 PWA에 자동으로 충족되는 기능이 아니다. [플랫폼 검토](platform-distribution.md).

## 운동 MVP 출시 조건

- 공개 콘텐츠의 해부학·동작·권한 검토.
- 티어 조건·비교 근거·보류 상태 일치.
- 추천 정책/시작값 전문 검토, 장비·시간 조건 일치.
- 계획8/완료6/준비2 등 표본의 집계 일치.
- 단측·kg/lb·덤벨·보조·머신 변경·RIR 결측 처리.
- 오프라인·중복 탭·강제 종료·재연결·편집·삭제 기록 보존.
- AI의 없는 수치/근거 차단과 장애 시 기록 열람.
- 내보내기·삭제·접근 제한 확인.

## 계정 DB 동기화 채택 시 검증 조건

- 사용자 A/B·비로그인 각각으로 조회·생성·수정·삭제와 부모/자식 소유자 불일치 차단.
- 동일 operation 재시도·서버 반영 후 응답 유실·앱 재시작에서도 중복 0건.
- 기록/outbox 트랜잭션 실패 시 성공 표시 금지, 대기 기록 보존.
- 인증 만료·무료 서버 일시 중단·통신 실패 후 재로그인/재연결로 전송 복구.
- 계정 전환 시 이전 데이터 비노출·이전 큐의 타 계정 전송 금지.
- 두 기기 같은 기록 편집·삭제 충돌·오래된 확인 응답에서 내용 손실 방지.
- 새 기기 로그인 시 동기화된 기록 복구, 미전송 기록의 한계 표시.
- 클라우드 삭제 후 오프라인 기기 복귀 시 삭제된 기록이 재등장하지 않음.
- 사용자 JSON 복원과 별도 DB 백업 복구를 구분해 검증.
- 브라우저 번들·로그에 서버 secret/service_role·AI 서비스 비밀 없음.

[기술 제안](technology-data-storage.md)의 구현 계약이다. 앱의 로컬 저장은 구현했으나 계정/원격 DB가 없어 이 절의 서버/권한/동기화 검사는 미시험이다.

## 배포·보안 검증 조건 제안

기본 스택 방향은 합의했다. 호스트/접근 설정은 제안이며 운영 호스트/활성 DB가 없어 아래 운영 검사는 미시험이다. 로컬 preview의 기본 헤더만 확인했다. [배포·보안 상세](deployment-security.md).

- 초대 사용자만 로그인: 일반 가입·익명 로그인·허용하지 않은 이메일·메일 전달 확인.
- 비로그인/A/B로 Data API·리포트·동기화·RPC·AI·파일·백업 직접 접근 검사.
- grants·RLS·views·권한이 높은 함수·user_id/부모 변경 우회 검토와 DB advisors 실행.
- 배포 dist·JS·로그에 vault/건강 기록/서버 secret/AI 키가 포함되지 않음.
- preview 접근 제한과 운영/개발 DB 분리, 인증 URL 범위를 확인.
- 메모/AI/Markdown의 XSS 입력, CSP·헤더·캐시와 계정 전환 흐름 검증.
- API 인증·회원 권한 회수·세션 만료·반복 요청/AI 비용 제한 확인.
- 운영 사이트 Access 선택 시 모든 도메인·우회 URL·iPhone 설치/로그인/오프라인 과업 확인.
- 화면 배포 복귀와 DB 마이그레이션 복구를 구분하여 백업 복원 확인.

## 식단 추가 조건

DB 권한/스키마·한국 음식·커버리지·0/결측·조리/기준량 검증. KDRI 정오표와 기준 전사 확인. 필요량 공식·활동 중복 처리·평가 문구 영양 검토.

PWA 기본 스택과 운동 우선 순서는 합의했다. iPhone 16 Pro Max/iOS 27.0.1·골격근량 증대·주3~4회·무분할~3분할을 본인 파일럿 표본으로 쓰며 앱 전역 기본값으로 고정하지 않는다. 종목/장비/시간·콘텐츠 검토/제작·논문 접근·계정/메일·호스트/비용은 필요한 단계 전에 정한다. [구현 관문 G0~G5](implementation-plan.md)와 [작업 ID](implementation-backlog.md)에 연결한다. 개발 공수 가설과 검토 대기/4주 사용 관찰을 구분하며 출시 날짜는 미정이다.

실행 증거에는 앱/DB/콘텐츠 버전·기기/iOS·시나리오·결과를 남긴다. Vitest16개와 개발 Chromium 검증은 수행했다. 프로젝트 E2E/CI 브라우저 회귀와 원격 API 검사는 미구현/미시험이다. WebKit 자동 시험과 실제 iPhone 검증을 별도로 기록한다. 3↔4회 일정·무분할~3분할 변경/기구 대체/부분 완료에서 계획·집계·추천 조건이 일치하는지 확인한다.

## 테스트 계층과 반복 개선

QA-01을 [HAR-01~06](implementation-backlog.md)과 [우선6개 시나리오](../operations/testing-harness.md)로 상세화한다. 입력/계산 unit, Dexie 저장소 integration, 사용자 입력 DOM integration, 빌드 기반 browser E2E, 실제 iOS, 원격 API/권한, 콘텐츠 전문 검토를 나누어 기대값과 증거를 기록한다. 실패→재현→작은 수정→관련 회귀→이력의 [루프](../operations/loop-engineering.md)를 제안한다. 단위/통합 검사 수·coverage·폭 검사의 성공만으로 G2/G3나 전문 검토를 통과시키지 않는다.

이번에는 기존 lint/16개/strict build를 재검사하고 문서화했다. 새 HAR 구현은 미착수다. [실행 원본](../../raw/research/2026-10-04-harness-audit.json).

## Related

[미결](open-questions.md) · [근거 정책](../operations/evidence-policy.md)

## CONV-0006 이후 현재 구현 경계

특정 iPhone 모델에 한정하지 않는 반응형과 각 사용자별 목표·주당 횟수·분할·시간·장비·단위·시간대 설정을 요구사항으로 추가했다. 본인의 조건은 하나의 시험 표본이다. Supabase 프로젝트가 없으므로 로컬부터 구현한다는 사용자 선택을 반영했다. [로컬 계약](implementation-contracts.md) · [실행 결과](implementation-progress.md).

로컬 프로필/기록·루틴 스냅샷·백업·사실 집계·PWA는 구현했으며 계정/RLS·서버 전송·실제 iOS·검토된 시각/설명·추천/티어·완전한 개인화·배포는 미완료다. 기존 실사용/지인 제공 관문은 유지한다. 로컬 프로필을 인증 계정으로, 개념도를 자극 범위로, 분류별 행 수를 근육 성장량으로 표시하지 않는다.

## CONV-0010 UI/UX 변경

추가 UI 과업: keyboard 하단 현재 위치/한 번 추가·정보 분리·Escape 복귀/연속 루틴 저장. 실제 iframe25조합 width/scroll/nav target을 확인했다. iPhone/Safari soft keyboard·가로/200% 확대·safe area·VoiceOver·production offline/update는 실제 기기 과업으로 남는다. [디자인 규칙](design-system.md) · [감사](design-audit.md).

## CONV0014 현재 후속

187c47c push/GitHub CI3job·artifact 수신 완료(HAR05 done). HAR04 local64개·browser16/새21회·실패probe 완료, quota합성/native rollback·큰파일/schema/update 보존. 실제iPhone/physical quota·10MiB초과 독립복구·실Auth/SCI/REL은 남았다. 새HAR04 CI는 미실행. [현재검증](../../raw/research/2026-10-04-storage-recovery-verification.json) · [다음순서](remaining-work.md).
