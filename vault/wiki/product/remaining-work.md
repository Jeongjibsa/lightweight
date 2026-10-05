---
type: "Remaining Work"
title: "현재 구현에서 운동 MVP까지 남은 작업"
description: "구현/검증/미완료를 구분하고 하네스부터 데이터·개인화·근거·실사용까지 순서를 정리한다."
tags:
  - "product"
  - "implementation"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-05T10:16:15+09:00"
sources:
  - id: "cf-recheck"
    resource: "../../raw/research/2026-10-04-cloudflare-setup-recheck.json"
    title: "Cloudflare 공식 설정과 OAuth 재확인"
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-007.md"
    title: "CONV-0007 원문"
  - id: "progress"
    resource: "implementation-progress.md"
    title: "현재 증분"
  - id: "backlog"
    resource: "implementation-backlog.md"
    title: "세부 작업/의존성"
  - id: "harness"
    resource: "../operations/testing-harness.md"
    title: "검증 개선"
  - id: "cloud-request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "이번 요구"
  - id: "cloud"
    resource: "supabase-integration.md"
    title: "현재 연결"
  - id: "volume-mvp"
    resource: "volume-history-mvp.md"
    title: "추가 범위"
  - id: "volume-check"
    resource: "../../raw/research/2026-10-04-volume-history-verification.json"
    title: "볼륨/후보 구현 검사"
  - id: "settings-loop"
    resource: "../../raw/research/2026-10-04-settings-restore-loop.json"
    title: "복원 입력 회귀/수정"
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
  - id: "iphone-user-report"
    resource: "../../raw/research/2026-10-04-iphone-install-user-report.json"
    title: "실제 iPhone 설치·실행·로그인 사용자 확인"
  - id: "routine-recovery-check"
    resource: "../../raw/research/2026-10-04-routine-recovery-loop.json"
    title: "삭제 루틴 보존·실화면 검사"
  - id: "routine-recovery"
    resource: "../operations/routine-recovery.md"
    title: "복구 계약"
  - id: "recovery-release"
    resource: "../../raw/research/2026-10-04-routine-recovery-release.json"
    title: "루틴 복구 CI·운영/preview 일치"
  - id: "ended-recovery-check"
    resource: "../../raw/research/2026-10-04-ended-record-recovery-loop.json"
    title: "종료 기록/집계 보존 검사"
  - id: "ended-recovery"
    resource: "../operations/ended-record-recovery.md"
    title: "삭제 복구 계약"
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
version: "0.4.3"
approval_status: "proposal"
change_id: "CHG-0035"
---

# 남은 작업 한눈에 보기

2026-10-05 / PRD0.9.3. **운동 MVP 전체는 진행 중**이며 식단·3D는 후순위다.

[운영 앱](https://lightweight-training.pages.dev) · [DB 연결 없는 preview](https://preview.lightweight-training.pages.dev) · [세부 백로그](implementation-backlog.md).

종료 기록 삭제/복구까지 main1db637d로 push/배포했다.90 Vitest·Node8·browser24·GitHub3job success, 실제 공개24파일 hash/헤더 일치를 확인했다. 등록1/허용1·실제 desktop Chrome 빈 프로필의 클라우드 저장/조회/같은 기기 적용도 확인했다.

| 순서 | 남은 작업 | 현재 완료한 부분 | 완료에 필요한 것 | ID |
|---|---|---|---|---|
| 1 | 실제 운동 기록·새 기기 로그인/동기화 | Auth/허용 목록/RLS·수동 snapshot/CAS·공개 가입OFF·반환 주소 저장 | 지정 계정 허용·실제 Chrome 빈 프로필 저장/조회/적용 완료; 실제 운동 기록/새 저장소 복원·로그아웃 검증 필요 | SYNC02/05, HAR02/06 |
| 2 | 다기기 편집·충돌/실패 복구 | manual CAS/retry/ACK·교체 전 백업 | A/B·만료/권한 회수/응답 유실·서로 다른 편집 명시 해결·삭제 재등장 방지·크기 정책 | SYNC03~05 |
| 3 | 기록 편의 완성 | 이전값·재시작·미완료 종목 교체·종료 수정·운동 순서/CAS·삭제 루틴 복구·종료 기록 삭제/복구 | 메모·머신/ROM 및 서버 필드 승인/적용·합성 RPC 28개 완료; 새 배포·다기기/운동 중 입력 UX | LOG03~06 |
| 4 | 설명 가능한 개인화 완성 | 볼륨/추이·기록 참고 후보·주간 입력 점검/직접 수정 | 검토된 직접/간접 매핑·저장 report/입력·정책·근거 버전·근거 기반 다음 행동 | REP01~06, SCI03B |
| 5 | 근거 운동 정보·시각·티어·추천 | 기록용34종목/바벨18·초기 연구/3D 검토·공개 JSON gate(승인0개) | 등록부 실제 승인/규칙 연결·전문/전문가/권리 검토→설명/시각→조건 추천/티어, 승인 콘텐츠만 제공 | SCI01~04, PRE01, LOG02 |
| 6 | 실제 iPhone/PWA·접근성/보존 | iPhone 홈 화면 설치/실행/로그인 사용자 보고 완료·반응형·browser24·백업 보존 | 키보드/VoiceOver/확대/가로/잠금·실제offline/update·physical quota/eviction·64MiB초과 분할복구 | RESP01, REL02, HAR04 |
| 7 | 운영·배포/복구 마무리 | Pages HTTPS·운영/preview DB 분리·24file hash/헤더·main push | 실Auth/메일/비밀번호복구·백업 drill·승인 credential 기반 CI자동배포·도메인/Access 선택 | REL01/03, Q08/16/17 |
| 8 | 본인 파일럿→지인 제공 | 앱/검사 기반 준비 | 실제4주 관찰/입력누락·오해 개선→회귀, 계정 독립/복원·G3/G4 관문 | PIL01/02 |
| 후순위 | 식단/영양·3D·선택 AI 설명 | 요구/3D feasibility 문서 | 음식DB/license·기록/계산·검토 공식/결측, 3Dasset/rig/clip/권한/전문검토/실기기성능 | NUT01~04, VIS3D02/03, AI01 |

삭제 루틴 복구는86개/22browser·최종목록2와 실제 좁은 화면 및 GitHub3job/운영·preview24file 일치 검사를 완료했다. 종료 기록 삭제/복구도90개/24browser·실제 좁은 화면·GitHub3job·운영/preview24file 일치를 완료했다. 메모/장비·가동범위 기록은 로컬 구현/검사를 완료했다. 서버 validator SQL은 명시 승인 뒤 적용/검사28개를 완료했고 새 Git 배포 검증을 이어간다. 실제 운동의 새 기기 복원·계정 A/B/만료·메일/권한 검증은 병행한다. 실제 iPhone 설치·실행·로그인은 사용자 보고로 완료했으며 키보드/VoiceOver/잠금/offline/update/quota 검증은 별도다.

과학 승인 설명은0개다. 콘텐츠 공개 gate는 실제 전문/전문가·자산 권리 검토를 대신하지 않는다.4주 파일럿도 자동검사로 대체하지 않는다. lint exit0/기존 effect경고6개가 남는다. 개인 기록·비밀번호/token/ID는 공개 vault에 넣지 않는다.

[진행](implementation-progress.md) · [하네스](../operations/testing-harness.md) · [순서/가림 루프](../operations/workout-order.md) · [현재 배포 증거](../../raw/research/2026-10-04-ended-record-release.json) · [실제 Auth 범위](../../raw/research/2026-10-04-auth-profile-roundtrip.json).

[실제 기기 사용자 보고와 미검증 범위](../../raw/research/2026-10-04-iphone-install-user-report.json).

[삭제 루틴 복구 계약/실제 화면](../operations/routine-recovery.md).

[종료 기록 삭제/복구·집계 보존](../operations/ended-record-recovery.md).

[실제 iPhone 다음 과업 체크리스트](../operations/iphone-pilot-checklist.md). 운동 저장→재실행→수동 전송은 [CONV0021](../conversations/2026-10-04-021.md)에 따라 다음 운동 후 사용자 확인 예정이다. 실제 결과는 not_run이며 새 저장소 복원은 별도 확인한다.

## CONV0022 구현/검토 — 2026-10-04

34종목/바벨18·큰 부위 아래 세부 분류/장비·별칭 필터와 사용자 추가 선택을 적용했다. 기본1분·즐겨찾기3~4개·완료 자동 시작·pause/resume/stop·deadline 재실행·profile/outbox/백업 보존을 구현했다. 다섯 H1 outline을 제거하고 programmatic focus는 유지했다.98개/19파일·Node8·전체30browser/최종문구6·build/types/format/artifact25, lint기존6경고. 실제 좁은 화면에서 문구 잘림을 찾아 수정했다. [계약/실행](../operations/catalog-rest-timer.md).

GitHub source=Jeongjibsa/lightweight·main·자동 배포 활성화를 읽었고 dependency 설치/Node24·승인된 production 공개 연결/빈 preview를 보완했다. 새 commit의 자동 Git 배포/원격 CI는 기록 시점 별도다. [배포 운영](../operations/pages-git-integration.md). Google OAuth는 가능하며 현재providerOFF/callback없음·credential/동일UID 연결/가입 차단·실기기 복귀가 필요하다. [검토](google-oauth-review.md). 과학 승인 콘텐츠0개/실제 운동·새 기기/나머지 G3/메일·운영·파일럿/P2 관문과 다음 운동 후 사용자 확인 일정은 유지한다.

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
