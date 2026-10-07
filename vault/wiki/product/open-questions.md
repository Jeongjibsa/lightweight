---
type: "Open Questions"
title: "미결 사항과 다음 대화"
description: "질문·임시 가정·영향 문서를 관리한다."
tags:
  - "product"
  - "conversation"
  - "decision"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T22:26:53+09:00"
sources:
  - id: "cf-recheck"
    resource: "../../raw/research/2026-10-04-cloudflare-setup-recheck.json"
    title: "Cloudflare 공식 설정과 OAuth 재확인"
  - id: "request"
    resource: "../../raw/conversations/2026-10-03-002.md"
    title: "CONV-0002"
  - id: "pwa-choice"
    resource: "../../raw/conversations/2026-10-03-003.md"
    title: "PWA 선택"
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
  - id: "local-progress"
    resource: "implementation-progress.md"
    title: "실행 결과와 남은 작업"
  - id: "harness-request"
    resource: "../../raw/conversations/2026-10-04-007.md"
    title: "하네스/루프 요청"
  - id: "ui-cloud-request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "요구/가입 차단 승인"
  - id: "volume-request"
    resource: "../../raw/conversations/2026-10-04-009.md"
    title: "요구"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
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
  - id: "pages-scope"
    resource: "../../raw/research/2026-10-04-pages-scoped-auth.json"
    title: "Pages 연결 확인"
  - id: "email-complete"
    resource: "../../raw/conversations/2026-10-04-017.md"
    title: "사용자 이메일 인증 완료"
  - id: "deployment-check"
    resource: "../../raw/research/2026-10-04-pages-deployment.json"
    title: "실제 HTTPS 배포"
  - id: "redirect"
    resource: "../sources/SRC-047-auth-production-origin.md"
    title: "Auth 반환 주소"
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
  - id: "order-release"
    resource: "../../raw/research/2026-10-04-workout-order-release.json"
    title: "운동 순서 CI·실제 배포 일치"
  - id: "iphone-user-report"
    resource: "../../raw/research/2026-10-04-iphone-install-user-report.json"
    title: "실제 iPhone 설치·실행·로그인 사용자 확인"
  - id: "ended-release"
    resource: "../../raw/research/2026-10-04-ended-record-release.json"
    title: "종료 기록 CI·운영/preview 일치"
  - id: "iphone-checklist"
    resource: "../operations/iphone-pilot-checklist.md"
    title: "다음 실제 기기 과업"
  - id: "next-workout"
    resource: "../../raw/conversations/2026-10-04-021.md"
    title: "다음 운동 후 확인 응답"
  - id: "request22"
    resource: "../../raw/conversations/2026-10-04-022.md"
    title: "카탈로그·휴식·제목·Git·Google 요청"
  - id: "request22-loop"
    resource: "../../raw/research/2026-10-04-catalog-rest-timer-loop.json"
    title: "실행/캡처"
  - id: "git-google"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "Git 구성/Google 검토"
  - id: "git-release22"
    resource: "../../raw/research/2026-10-04-catalog-rest-git-release.json"
    title: "0f6381d CI/Git build/production asset verification"
  - id: "request23"
    resource: "../../raw/conversations/2026-10-05-023.md"
    title: "다음 구현/한도 요청"
  - id: "details-loop"
    resource: "../../raw/research/2026-10-05-record-details-loop.json"
    title: "로컬 검사/서버 보류"
  - id: "validator-human-approval"
    resource: "../../raw/conversations/2026-10-05-024.md"
    title: "검증 함수 SQL 승인과 재개"
  - id: "record-details-git-release"
    resource: "../../raw/research/2026-10-05-record-details-git-release.json"
    title: "서버 승인 뒤 CI/Git 운영 배포"
  - id: "workout-ux-request"
    resource: "../../raw/conversations/2026-10-07-025.md"
    title: "운동 접기/휴식 접근 요구"
  - id: "workout-ux-git-release"
    resource: "../../raw/research/2026-10-07-workout-ux-git-release.json"
    title: "운동 UX CI/운영 배포 확인"
  - id: "unit-chg-0039"
    resource: "../../raw/conversations/2026-10-07-026.md"
    title: "세 종목 추가와 순차 작업 요구"
---

# 미결 사항과 다음 대화

| ID | 질문 | 현재 제안 | 상태 |
|---|---|---|---|
| Q-01 | 본인의 운동 경험·현재 루틴·장비는? | 주3~4회·무분할~3분할, 경험/종목/장비/시간 미결 | 일정/분할 보고 CONV-0005·부분 확인 |
| Q-02 | 근비대·근력·건강 중 우선? | 골격근량 증대 목표 | 사용자 보고 확인 CONV-0005 |
| Q-03 | 플랫폼과 구현 방식은? | 모바일·iPhone/iOS 우선, PWA 진행 | 확정 CONV-0003 |
| Q-04 | 식단을 첫 출시부터? | 운동 기능 먼저 완성, 식단은 다음 출시 | 사용자 선택 확정 CONV-0005 |
| Q-05 | 추천/자유 기록 비중? | 두 경로, 기록 우선 진입 | 미확정 |
| Q-06 | 연구·해부학·영양 검토 인력/예산? | 역할 필요 | 미확정 |
| Q-07 | S/A/B/C 이해를 돕는 방식? | 적합도 + 근거 배지 | 검증 필요 |
| Q-08 | 개인 도구의 운영비 허용 범위는? | 구독 검증은 후순위 제안; 호스팅·AI·필요시 개발자 등록비 비교 | 예산 미결 |
| Q-09 | 백업·동기화·계정은? | 기기+Supabase 방향 합의, 독립 백업 유지 | 동기화·백업·계정 상세 미결 |
| Q-10 | 2D·영상·3D 중 먼저? | 2D와 짧은 동작 자료 | 미확정 |
| Q-11 | 건강 앱·Apple Watch 연동은 처음부터 필요한가? | 필수이면 네이티브부터 검토; 우선순위는 사용자 선택 | 미확정 |
| Q-12 | 실제 iPhone 모델·iOS 버전은? | 보고된 기기는 하나의 파일럿 표본, 반응형 확장 요구 | CONV-0006 특정 기종 한정 해제; 실제 기기/지원 하한 미검증 |
| Q-13 | TypeScript·React/Vite·Dexie를 사용할까? | 기본 스택 방향 합의 | 동의 확인 CONV-0004 |
| Q-14 | Supabase 계정 DB를 사용할까? | 프로젝트 제공/연결 완료 증분 | CONV-0008 Auth/DB/RPC 적용; 실계정 검증/배포 남음 |
| Q-15 | 로그인·초대·여러 기기 동시 사용 범위는? | 공개 가입 차단 승인/적용, 익명OFF, 등록계정 password 초기 구현 | 본인 계정 등록/허용 목록·실제 login/복원·최종 로그인/복구/SMTP·다기기 해결 남음 |
| Q-16 | 호스팅과 고정 운영 도메인은? | Cloudflare + Supabase, 고정 HTTPS 주소 | CONV0017 Pages 생성/HTTPS 배포·고정 origin/반환 경로 저장 완료; 도메인/Access/운영 관문 후속 |
| Q-17 | 사이트 화면도 초대자만 열게 할까? | 기본 로그인/DB 권한 제한, preview Access; 운영 Access는 추가 선택 | 미확정 |

기본 스택과 운동 우선 순서는 합의했고 개인 조건은 하나의 시험 표본이다. 반응형과 각 사용자 설정은 CONV-0006 요구로 확정했다. 로컬부터 진행한 뒤 CONV-0008에서 Supabase를 연결했다. 공개 가입 차단은 명시 승인/적용했다. 로그인/수동 snapshot 상세는 초기 구현 정책이다. [실행 결과](implementation-progress.md). [구현 계획](implementation-plan.md)은 가짜 데이터로 착수한다. 종목/장비/시간/경험은 Q-01, 로그인은 Q-15, 배포는 Q-08/16/17을 필요한 단계 전에 정하고 실제 기기 동작은 REL-02에서 검증한다. 상세 설계는 제안이다. [언어·개인 데이터 저장 의견](technology-data-storage.md)을 먼저 검토한다. PWA 선택 이후 건강 앱·Watch는 별도 범위 질문으로 남긴다. 미응답을 승인으로 간주하지 않는다.

CONV-0007의 현황/하네스 문서화는 추가 결정 없이 진행했다. [남은 작업](remaining-work.md)의 검증 개선을 다음 증분으로 제안한다. 새로운 상세 기준을 사용자 승인으로 표시하지 않고 기존 Q를 필요한 구현 단계에 연결한다.

CONV-0008: Mantine UI·Spoqa Han Sans Neo·실제 스택 명시를 요구로 추가했고 [현재 스택](technology-stack.md)/[계정 준비](supabase-integration.md)를 작성했다. 실제 계정 비밀번호를 대화에 요청하지 않는다.

답변 후 갱신: [PRD](prd.md), 관련 기능, [결정](../decisions/decision-register.md), [변경](../../history/changes/index.md). 질문 ID를 이어서 부여한다.

CONV-0009: 볼륨/그래프·오늘 운동/권장량 요구를 추가했다. [계산/후보 초기 정책](volume-history-mvp.md). 불편감/effort·운동 경험·실제 머신/ROM 식별 입력은 권장량 조정 전 구체화한다. 28/84일·한 손 기준 등 상세는 구현 정책이며 최적성 승인으로 간주하지 않는다. local commit 지속 요청은 [운영](../operations/commit-workflow.md)에 기록했다.

## CONV-0010 UI/UX 변경

현재 글꼴·하단 메뉴는 CONV-0010의 Geist/전 폭 하단이다. 톤은 CONV-0011의 Monokai/Mantine 참고 요청으로 차콜/노란 강조를 적용해 이전 blue-dark를 대체했다. 구체 팔레트는 구현 선택이며 이전 Spoqa 선택도 supersede했다. 색상/radius·iOS형 세부 조작성 만족은 파일럿에서 확인한다. Q-12의 실제 기기/지원 OS 검증, 키보드/VoiceOver·가로/확대는 미해결이다. 다른 사용자 기본 목표/횟수/분할은 여전히 강제하지 않는다. [디자인 규칙](design-system.md) · [감사](design-audit.md).

## CONV-0012 후순위 미결

FR-17은 사용자 명시 3D 애니메이션 요구이며 지금은 검토만/후순위다. [검토](anatomy-3d-feasibility.md)의 asset 제작/구매·근육 분리/rig/clip·license·전문 검토자·실기기 성능·예산은 미정이다. UI-03 실제 페이지에서 개선을 확인했으나 사용자 최종 디자인 승인·실제 iPhone/접근성 관문은 별도다.

## CONV0013 후속 상태

새 제품입력 미결은 추가하지 않았다. HAR03 로컬9과업·27반복을 완료했다. 새GitHub CI실행·실제Auth/iPhone은 남았다. 다음 HAR04는 계정없이 진행가능하다. Q15계정/메일·Q12실기기·Q08/16/17운영·Q01/06과학조건/검토 관문을 유지한다. [현재우선순위](remaining-work.md).

## CONV0014 현재 후속

187c47c push/GitHub CI3job·artifact 수신 완료(HAR05 done). HAR04 local64개·browser16/새21회·실패probe 완료, quota합성/native rollback·큰파일/schema/update 보존. 실제iPhone/physical quota·10MiB초과 독립복구·실Auth/SCI/REL은 남았다. 새HAR04 CI는 미실행. [현재검증](../../raw/research/2026-10-04-storage-recovery-verification.json) · [다음순서](remaining-work.md).

## CONV-0015 권한·실행 경계

당시 Cloudflare 공식 MCP는 broad read/write OAuth를 요구해 자동 검토가 Continue를 거부했다. full 승인 또는 Pages 배포 제한 권한 질문이 pending이었다. 실제 고정 URL/배포·Auth/iPhone·SCI·운영 gate와 후순위 자산/식단 선택은 유지한다. 사용량 제한은 발생하지 않았으며 quota reset 가능 여부는 실제 서비스 기능으로 확인한다.

## CONV-0016 현재 인증과 선택

`codex mcp login cloudflare`의 성공과 현재 main 계정 읽기 HTTP200을 확인해 main MCP의 pending을 갱신했다. 사용자가 beta cf 생략·기존 Wrangler 유지를 명시했다. 특화 MCP3개와 Wrangler 인증·Q-16 고정 origin/실제 배포·Q-15 앱 Auth는 각각 확인이 남았다. [실행](../../raw/research/2026-10-04-cloudflare-setup-recheck.json) · [운영](../operations/cloudflare-setup.md).

## CHG0018 당시 외부 관문

Wrangler Pages 제한 인증은 성공했다. Cloudflare Pages project 생성은 API8000077 이메일 인증 필요로 거부됐으며 사용자 인증 완료 답변을 기다린다. 실제 앱 Auth 등록/비밀번호는 사용자가 준비하며 대화로 수집하지 않는다. 콘텐츠 전문/전문가·자산 권한과 실제 iPhone 관문을 자동 검사 완료로 대체하지 않는다.

## 현재 외부 관문 — CHG0020

이메일 인증/Pages 생성/HTTPS·Auth URL 저장을 완료했다. 본인 계정0개로 실제 login/허용 목록/다기기 검증은 계정 등록을 기다린다. password 입력은 사용자가 직접 수행하고 대화로 수집하지 않는다. 과학 전문/전문가·자산/실제iPhone·파일럿 관문은 유지한다.

## 최신 계정/운영 관문 — CHG0022

Pages/preview·현재앱96bbb74 CI/배포/24file hash를 완료했다. Auth user1개/허용0개. 자동 승인 검토가 exact account/SQL 방식 승인 부재로 권한 등록을 거부했으며, 해당 명시 승인 질문이 pending이다. 실제 login/전송·복원은 다음이다. 개인 ID/비밀번호를 vault에 저장하지 않는다.

## 현재 권한/로그인 관문 — CHG0023

지정 계정 SQL 허용 승인 후 등록1/허용1·실제 Chrome 로그인/빈 프로필 revision1 저장·조회·명시 적용을 확인했다. CHG0022의 승인 pending은 해소됐다. 실제 운동 기록·새 기기/계정 A·B/만료·로그아웃·메일/iPhone은 후속이다. 개인 ID/credential을 공개 문서에 넣지 않는다.

## 실제 기기 확인 대기 — CHG0025

e912f0c CI/운영·preview24file 일치를 완료했다. 물리 iPhone 홈 화면 설치·실행·로그인 확인을 요청했으며 저장 시점 응답 대기다. WebKit 통과를 실제iPhone 통과로 표시하지 않는다. 기록/과학/메일·운영/파일럿·P2 관문은 유지한다.

## 실제 iPhone 확인 — 사용자 보고, 2026-10-04

사용자가 운영 앱의 iPhone 홈 화면 설치·실행·로그인에 “홈 화면 실행·로그인 완료”라고 응답했다. [CONV0020](../conversations/2026-10-04-020.md)·[확인 범위](../../raw/research/2026-10-04-iphone-install-user-report.json). 해당 세 과업은 사용자 보고로 확인했으며 에이전트의 직접 기기 관찰·OS 재측정은 아니다. 앞선 ‘응답 대기’ 문단은 당시 이력이다.

REL02는 부분 진행이다. 실제 운동/모바일 클라우드 왕복·새 기기 복원·키보드/VoiceOver/확대/가로/잠금·오프라인/업데이트/physical quota/eviction 검사는 남는다. 설치·로그인 확인을 G3 전체 통과로 확대하지 않는다. 운영 앱은 e912f0c이며 진행 중인 루틴 복구는 아직 배포하지 않았다.

## 다음 실사용 확인 — CHG0030

iPhone 설치/홈 화면/로그인은 CONV0020 사용자 보고로 확인했다. 실제 운동 저장→재실행→수동 클라우드 전송 확인을 요청했으며 저장 시점 응답 대기다. 개인 수치/백업/계정 식별자/비밀번호는 수집하지 않는다. [과업](../operations/iphone-pilot-checklist.md). 메모/장비·과학/실Auth/나머지 기기/운영/파일럿/P2 관문은 유지한다.

## 현재 실사용 확인 시점 — CHG0031

사용자가 “다음 운동 후 확인”이라고 응답했다. 운동 기록 저장→재실행→수동 클라우드 전송은 다음 운동 이후 사용자 확인 예정이며, 실제 결과는 not_run이다. 구체 날짜는 정하지 않았다. [CONV0021](../conversations/2026-10-04-021.md)·[체크리스트](../operations/iphone-pilot-checklist.md). CHG0030의 응답 대기는 당시 상태다. 확인 시점의 답변을 완료 결과로 표시하지 않는다. 새 저장소 복원/실Auth/나머지 G3/운영/과학 검토/4주 파일럿은 별도 관문이다.

## CONV0022 현재 미결

Google 계정 로그인은 기술적으로 가능하지만 검토 요청만 처리했다. Google web client/동의 화면·기존 계정 이메일 관계·provider/callback 구현·동일 UID 및 가입OFF/허용 목록·실제 iPhone 복귀 검증은 남는다. [검토](google-oauth-review.md). 휴식 default1분/즐겨찾기3~4개는 명시 요구이며 초깃값60/90/120/180·15~1800초는 구현 정책이다. 물리 잠금/알림 관문은 완료하지 않았다. 새 Git 자동 배포 성공/정적 자산 일치는 후속 receipt에서 확인한다.

## 현재 운영 배포 — Git0f6381d

0f6381d main push의 GitHub37210829022 check/Chromium/WebKit 세 job이 모두 success다. Pages trigger=github:push·같은 source commit의 build/deploy success를 확인했고 [운영 앱](https://lightweight-training.pages.dev)의 공개24file hash/보안 헤더가 최종 build와 일치한다. 검토 시점 Git/CI 대기는 이 실행으로 해소됐다. [불변 확인](../../raw/research/2026-10-04-catalog-rest-git-release.json).

이번 확인은 production이다. preview 환경은 DB 설정 없이 유지했고 이번 작업에서 새 preview branch는 push하지 않았다.98개/Node8/전체30browser·마지막문구6·9PNG·build/types/format/artifact25(lint기존6경고)는 feature source의 검증이다. 이어지는 문서 commit은 앱 bundle을 바꾸지 않는다. Google provider/callback은 검토만이며 실제 iPhone 운동/잠금/클라우드·나머지 Auth/SCI/운영/파일럿/P2는 유지한다.

## CONV0023 로컬 기록 편의 — 2026-10-05

운동 메모·장비/가동범위 전체 또는 세트별 조건, owner/revision/atomic 보존·재시작/추가/교체·비교/이전값 분리를 구현했다.106개/Node10·32browser/신규반복6·build/types/format/artifact25·실제 가짜 PNG4개를 확인했다(lint기존6경고). [계약](../operations/record-details.md)·[실행](../../raw/research/2026-10-05-record-details-loop.json).

서버 strict validator는 신규 필드를 거부함을 읽기 전용 가짜 자료로 확인했다. 준비한 optional-field migration은 자동 승인 검토가 명시 승인 부족으로 거부하여 **미적용/승인 대기**다. 이 단위는 local commit만 하며 push/Git 배포는 보류한다. 이전0f6381d 기능 배포는 그 당시 증거이며 새 선택 필드 클라우드 전송 보장으로 쓰지 않는다. 과학/실제 운동·다기기/기기/파일럿/후순위 관문은 유지한다.

사용량 초기화 뒤 조건부 일회 재개를03:00 KST로 예약했다. 실제 한도 중단이 없거나 완료/승인 대기만 있으면 작업하지 않는다. [예약](../operations/usage-resumption.md).

## CONV0024 승인된 서버 변경 — 2026-10-05

인간 사용자의 명시 승인 후 준비된 `training_optional_record_fields` SQL을 같은 Supabase MCP 경로로 적용했다. 기존 함수 identity·owner·security invoker/빈 search_path·ACL, private 세 테이블의 RLS/force RLS·ACL·정책은 그대로다. 기존 형식 및 새 메모/장비·가동범위·휴식 즐겨찾기·세부 분류/별칭을 RPC 저장→조회와 idempotent retry로 확인했다. 잘못된 소유자·중복·길이/입력/시각을 포함한 **28개 서버 검사**가 통과했고 테스트 계정·기록·임시 권한은 모두 rollback했다. 실제 본인 운동 기록이나 실제 브라우저 Auth 왕복의 검증으로 확대하지 않는다.

자동 검토의 앞선 승인 대기/거부는 당시 이력이며 이 명시 승인과 적용으로 해소됐다. app0.2.0/IndexedDB2/backup1, 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)를 유지한다. 신규 서버 검증 뒤 main push/새 GitHub CI/Pages 배포 검증을 이어간다. 실제 iPhone/운동·다기기/다버전·과학 승인0개·운영복구/파일럿/P2 관문은 남는다.

[인간 승인](../conversations/2026-10-05-024.md) · [불변 서버 확인](../../raw/research/2026-10-05-cloud-validator-approved.json).

## 현재 운영 배포 — 메모·비교 조건

인간 SQL 승인 뒤 dbddbda를 main에 push했다. GitHub37250900828의 check/Chromium/WebKit 세 job이 모두 success이며 artifact를 실제 수신해 **17+15=32 browser**와 의도적 최초 실패 probe의 증거 보존을 확인했다. Pages github:push의 동일 source build/deploy가 success이고 운영 공개24file SHA256/보안 헤더가 검증한 build와 일치한다. 서버 선택 필드 RPC/부정 입력·권한28개 rollback과 기존 ACL/RLS 보존도 완료했다.

메모/장비·가동범위·휴식 즐겨찾기/세부 분류·별칭의 서버 미지원 및 이 단위의 승인/push/배포 대기는 해소됐다. 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)이다. preview DB는 비어 있으며 이번에 새 preview branch/asset 검사를 하지 않았다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.

[운영 앱](https://lightweight-training.pages.dev) · [불변 배포 증거](../../raw/research/2026-10-05-record-details-git-release.json). 실제 본인 운동/iPhone 저장·재실행·수동 전송/새 저장소 복원·다기기/다버전 Auth·과학 승인 콘텐츠0개/운영 복구·4주 파일럿/P2 관문은 남는다.

## CONV0025 미결

접기/고정 타이머 로컬 구현은 완료했다. 실제 iPhone 키보드/VoiceOver·잠금 복귀는 남는다. Watch 알림/Live Activity는 가능성 검토만 요구했다. [P2 검토](rest-alert-feasibility.md)의 PWA push 또는 native AlarmKit/WidgetKit 선택·지원OS/Watch·배포 방식·부드러운 알림/강한 알람 정책은 미정이다. 이 선택을 현재 운동 MVP 완료 조건으로 추가하지 않는다.

## 운동 접기/고정 휴식 운영 반영 — 2026-10-07

48c0f44를 main에 push하고 GitHub37622605794 세 job success와 **Chromium18/WebKit16=34** artifact·의도적 최초 실패 probe를 실제 수신했다. 같은 source의 Pages `github:push` build/deploy가 성공했고 운영 공개24파일 SHA256·보안 헤더가 로컬 검증 빌드와 일치한다. [불변 배포 확인](../../raw/research/2026-10-07-workout-ux-git-release.json).

108Vitest/Node10·로컬browser34/관련12반복·최종10PNG/문서 검증(기존6lint경고)을 유지한다. 새 서버/Auth/스키마/의존성을 변경하지 않았다. preview DB 환경은 비어 있고 새 preview branch 배포/asset 검증은 하지 않았다. Watch/Web Push·native AlarmKit/Live Activity는 **검토만/P2**다. 실제 운동/iPhone/Watch·다기기 Auth·SCI/운영/파일럿 관문은 남는다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.

## CONV0026 후속 관문

세 종목 추가는 구현/가짜 browser 검사 완료다. 별도 제품 입력을 요구하지 않는다. 실제 Smith 머신의 봉/원판 표기 기준은 사용자 장비 조건으로 기록한다. 다음 SYNC 증분은 합성 두 기기/오래된 응답 검사이며 실제 Auth/권한 회수·새 기기·iPhone/SCI 관문은 계속 남는다.
