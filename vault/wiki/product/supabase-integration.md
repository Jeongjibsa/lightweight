---
type: "Cloud Integration"
title: "Supabase 연결·계정·기록 전송 계약"
description: "실제 적용한 Auth/RPC/권한·계정별 DB·수동 snapshot/ACK/충돌/교체와 본인 계정 설정 절차."
tags:
  - "product"
  - "cloud"
  - "security"
  - "contract"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-05T10:24:45+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "요구/승인"
  - id: "technical"
    resource: "../sources/SRC-036-mantine-supabase.md"
    title: "공식 자료"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-mantine-supabase-verification.json"
    title: "실제 검사"
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
  - id: "recovery-release"
    resource: "../../raw/research/2026-10-04-routine-recovery-release.json"
    title: "루틴 복구 CI·운영/preview 일치"
  - id: "ended-release"
    resource: "../../raw/research/2026-10-04-ended-record-release.json"
    title: "종료 기록 CI·운영/preview 일치"
  - id: "iphone-checklist"
    resource: "../operations/iphone-pilot-checklist.md"
    title: "다음 실제 기기 과업"
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
version: "0.1.3"
change_id: "CHG-0036"
approval_status: "implemented-increment; policy-details-provisional"
---

# Supabase 연결·계정·기록 전송 계약

## 현재 운영 배포 — 종료 기록 1db637d

main push·GitHub37206666022 check/Chromium/WebKit 모두 success 뒤 [운영 앱](https://lightweight-training.pages.dev)·[DB 없는 preview](https://preview.lightweight-training.pages.dev)에 배포했다. 각 공개24file hash/보안 헤더가 검증한 빌드와 일치한다.90 Vitest/17파일·Node8·Chromium13/WebKit11=24·build/types/format/artifact25·vault 통과(lint기존6경고). [불변 배포](../../raw/research/2026-10-04-ended-record-release.json). 앞선 CI/배포 대기는 당시 이력이며 현재 완료했다.

iPhone 홈 화면 설치/실행/로그인은 사용자 보고 확인이다. 본인이 수행한 운동의 저장→재실행→수동 전송 결과를 요청했고 저장 시점 응답 대기다. [실사용 체크리스트](../operations/iphone-pilot-checklist.md)를 준비했다. 실제 운동/새 저장소 복원·A/B/만료/메일·나머지 G3/운영 복구·전문/전문가/자산·실제4주 파일럿·후순위 식단/3D는 유지한다. 다음 독립 기록 구현은 메모/장비 비교 조건이다. 이 문서 단위는 앱 bundle을 바꾸지 않는다.


## 현재 운영 배포 — 루틴 복구 86cc158

main push·GitHub37205447895 세 검사 success 뒤 [운영 앱](https://lightweight-training.pages.dev)과 [DB 없는 preview](https://preview.lightweight-training.pages.dev)에 배포했다. 각 공개24file hash/보안 헤더가 검증한 빌드와 일치한다.86 Vitest/Node8/전체browser22·최종목록2/build/types/format/artifact25·vault 검사 통과. [불변 배포](../../raw/research/2026-10-04-routine-recovery-release.json). 앞선 새 source CI/배포 대기는 당시 이력이며 현재 완료했다.

iPhone 홈 화면 설치/실행/로그인은 CONV0020의 사용자 보고로 확인했다. 실제 운동/새 저장소 클라우드 복원·A/B/만료/메일·나머지 기기 G3·SCI/운영/파일럿/P2는 남는다. 다음 로컬 단위는 종료 운동 기록 삭제/복구다. 이 후속 문서 commit은 앱 bundle을 바꾸지 않는다.


## 실제 iPhone 확인 — 사용자 보고, 2026-10-04

사용자가 운영 앱의 iPhone 홈 화면 설치·실행·로그인에 “홈 화면 실행·로그인 완료”라고 응답했다. [CONV0020](../conversations/2026-10-04-020.md)·[확인 범위](../../raw/research/2026-10-04-iphone-install-user-report.json). 해당 세 과업은 사용자 보고로 확인했으며 에이전트의 직접 기기 관찰·OS 재측정은 아니다. 앞선 ‘응답 대기’ 문단은 당시 이력이다.

REL02는 부분 진행이다. 실제 운동/모바일 클라우드 왕복·새 기기 복원·키보드/VoiceOver/확대/가로/잠금·오프라인/업데이트/physical quota/eviction 검사는 남는다. 설치·로그인 확인을 G3 전체 통과로 확대하지 않는다. 운영 앱은 e912f0c이며 진행 중인 루틴 복구는 아직 배포하지 않았다.


## 현재 운영 배포 — 2026-10-04

운동 순서/알림 가림 수정 e912f0c를 main에 commit/push하고 GitHub37203886001의3job success를 확인했다. [운영 앱](https://lightweight-training.pages.dev)·[DB 연결 없는 preview](https://preview.lightweight-training.pages.dev)에 배포했으며 각 공개24file hash/보안 헤더가 검증한 빌드와 일치한다. 83개 Vitest/Node8/Chromium12·WebKit10=22개, artifact25를 확인했다. [불변 배포](../../raw/research/2026-10-04-workout-order-release.json). 이 후속 문서 단위는 앱 bundle을 바꾸지 않는다.

등록1/허용1·실제 Chrome 빈 프로필 저장/조회/같은 기기 적용은 확인했다. 실제 운동/새 기기/A·B/만료/메일·iPhone·과학 검토/자산·운영 복구·파일럿은 남는다. 물리 iPhone 설치·실행·로그인 질문은 저장 당시 응답 대기다. LOG 메모/삭제 복구/장비 조건·리포트/검토 콘텐츠·P2는 이어갈 작업이며 전체 MVP 완료로 표시하지 않는다.


## 최신 운영 상태 — 2026-10-04

운영/DB 연결 없는 preview에 검증한96bbb74를 배포했다. GitHub37201900937의3job success·78 Vitest/Node8·Chromium11/WebKit9, 실제 공개24파일 hash/헤더 일치를 확인했다. 과학 승인 설명은0개다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다. [확인](../../raw/research/2026-10-04-release-account-gate.json).

사용자가 지정 계정의 SQL 등록을 명시 승인한 뒤 허용 목록에 적용했고 enabled=true·등록1/허용1을 확인했다. 사용자가 직접 로그인한 Chrome에서 빈 기본 프로필의 실제 전송 ACK→서버 revision1→조회/명시 기기 적용·대기0·교체 전 복구 수단을 확인했다. 같은 기기 빈 프로필 시험이며 실제 운동 기록/새 기기/A·B/만료/로그아웃/메일·iPhone 검증은 남는다. [최신 확인](../../raw/research/2026-10-04-auth-profile-roundtrip.json). 개인 식별자/비밀번호/token은 vault에 보관하지 않는다.


## 첫 HTTPS 배포 — 2026-10-04 현재

운영: [lightweight-training.pages.dev](https://lightweight-training.pages.dev). preview: [운영 DB 연결 없는 미리보기](https://preview.lightweight-training.pages.dev). 화면과 기기 기록을 바로 사용할 수 있다. 공개 페이지이며 계정 데이터 접근은 Supabase 허용 목록/RLS로 제한한다. site-wide Access는 미설정이다.

이메일 완료 답변 뒤 project 생성 성공, 검증된3bc6022를 main에 fast-forward/push했다. GitHub3job success 후 app/dist만 배포했다. 24파일 artifact gate, 실제 공개23파일(index/PWA/font/JS/CSS)의 SHA256 일치와 보안 헤더를 운영/preview에서 확인했다. 다섯 실제 HTTPS 화면을 캡처/직접 확인했다. [실행](../../raw/research/2026-10-04-pages-deployment.json).

Supabase Site URL과 정확한 root 반환 경로 하나를 저장했다. Auth settings200/signupDisabled=true, 비로그인 read/write RPC401을 재확인했다. Auth 계정0개: 본인 등록/비밀번호는 사용자가 직접 준비, 허용 UUID·실제 로그인/복원/A-B/만료는 다음 단계다. 비밀번호 복구 UI는 아직 없다.

78개 Vitest + 배포 계약3개·build/format/E2E타입 통과, lint exit0이지만 기존WorkoutView effect 경고6개는 남는다. pages:verify는 읽기 전용으로 실제 헤더/파일 hash를 검사하며 네트워크/불일치에 실패한다. 실제 iPhone/과학 검토/운영 복구 관문은 유지한다. 다음 독립 구현은 공개 콘텐츠 registry/검토 gate와 기록 편의의 남은 범위다. 아래 증분은 당시의 상태다.


2026-10-04 / app0.2.0 / IndexedDB schema2. 사용자 생성 프로젝트 **https://xmdbivohdjczpbjcujvu.supabase.co**에 Auth API와 DB/RPC를 연결했다. 수동 스냅샷 증분을 구현/검사했으며 **실제 본인 계정 로그인→클라우드 전송→다른 기기 복원은 아직 미시험**이다. [요구/가입 차단 승인](../../raw/conversations/2026-10-04-008.md) · [실제 검사](../../raw/research/2026-10-04-mantine-supabase-verification.json).

## 연결과 키

`app/.env`는 추적 제외·로컬600 권한이다. 브라우저에는 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_PUBLISHABLE_KEY`만 제공한다. 공개 키는 노출을 전제로 한 프로젝트 식별/요청 키이며 인증/개인 기록 권한을 대체하지 않는다. 실제 키는 vault에 수집하지 않는다. 잘못된 URL/secret key 입력은 클라이언트 설정 검증에서 거부하고 로컬 기록을 유지한다.

서버 검사/운영에만 `SUPABASE_DB_URL`과 기존 `SUPABASE_PASSWORD`를 사용한다. Session pooler host는 `aws-0-ap-northeast-2.pooler.supabase.com:5432`, user는 `postgres.xmdbivohdjczpbjcujvu`다. 직접 DB IPv6 주소는 현 환경에서 연결되지 않았다. 비밀번호를 URL encode하고 공식 CA를 `supabase/certs/prod-ca-2021.crt`에서 읽어 `rejectUnauthorized:true`로 인증서/hostname을 검증했다. 관리자 연결/pg 스크립트는 앱 번들에 포함하지 않는다.

## 인증·허용 목록·기기 경계

**공개 가입 차단은 사용자가 승인했고 Dashboard에 적용했다.** Auth API `signupDisabled:true` 확인. 익명 가입 OFF, 이메일 확인 ON을 유지했다. 현재 앱은 등록 계정의 이메일/비밀번호 로그인을 지원한다. 비밀번호 방식은 연결 검증용 초기 구현 선택이며 이메일 코드·초대·복구·SMTP 최종 운영 방식은 Q-15에 남긴다. 앱에서 새 가입/메일 발송을 구현하지 않았다. 해시 라우팅 앱의 비밀번호 경로에 맞춰 `detectSessionInUrl:false`다.

로그인만으로 기록 접근이 열리지 않는다. 서버 `training_private.members`에 등록된 `enabled=true` 계정만 RPC를 사용할 수 있다. 회원 UUID는 인증의 `auth.uid()`에서 얻고 입력한 ownerId를 권한으로 신뢰하지 않는다. 비로그인·anonymous claim·미등록/비활성 회원은 거부한다.

인증 계정 DB는 `lightweight-account-{auth UUID}-v1`, 기존 로컬 모드는 `lightweight-v1`이다. 실제 DB 버전은2이며 version1 테이블을 보존하고 cloud 상태 테이블을 추가했다. Auth 변경 시 앱 하위 트리를 재생성하고 다른 계정의 화면 상태를 유지하지 않는다. 진행 운동/기기 저장 중 로그인 전환을 막는다. 로컬 프로필 분리는 인증이 아니다. 로컬 자료는 로그인 시 자동 업로드하지 않고 사용자가 JSON 백업을 해당 계정에 명시적으로 가져와 이관한다.

기기 DB와 SDK 저장 세션은 브라우저 저장소에 있으며 앱 자체 암호화를 제공하지 않는다. 같은 기기의 개발자 도구/기기 관리자 및 DB 운영자에게도 읽을 수 없는 종단 간 암호화 구조는 아니다. 이 변경은 계정 간 앱 상태/원격 권한 경계를 검증하는 증분이다.

## 서버 구조와 권한

`supabase/migrations/20261003162808_training_cloud.sql`을 원격 적용했고 서버 migration 목록의 version/name과 파일명을 맞췄다. Supabase CLI로 생성한 파일의 임시 시각이 아니라 실제 적용 기록을 추적한다.

| 비공개 테이블 | 역할 | 경계 |
|---|---|---|
| members | Auth user FK·enabled 허용 목록 | 브라우저 직접 쓰기/읽기 권한 없음 |
| workspaces | user_id별 revision·JSON snapshot·server updated_at | 서버 CAS로 최신 버전 비교 |
| operations | user_id+operation UUID·요청 hash·expected/result revision | 응답 유실 시 같은 작업 재시도 |

모든 테이블 RLS enable+force 및 owner 정책, PUBLIC/anon/authenticated 직접 테이블 권한 회수. 공개 API에는 `training_snapshot_read/write`의 **invoker** wrapper만 두고 authenticated 실행권한을 명시했다. 비공개 definer는 `search_path=''`, 정규화한 테이블 이름, `auth.uid`/허용 목록을 직접 검사한다. definer는 소유자 권한으로 실행되므로 RLS만으로 이를 보호한다고 설명하지 않는다. 서버 권한은 execute ACL·명시 인증/소유자 검사·테이블 ACL/RLS를 함께 검증한다.

공식 보안 Advisor가 기존 `public.rls_auto_enable()` event_trigger helper의 anon/authenticated execute를 경고했다. 함수 본문과 반환형을 확인한 후 실행권한만 회수했다. 앱 migration 이후 security/performance `lints:[]` 확인. 기본 이벤트 트리거/관리자 실행을 제거한 것이 아니며 전체 보안 감사 통과를 뜻하지 않는다.

## 수동 전송·중복·충돌

1. 사용자가 ‘클라우드로 전송’을 선택하면 현재 계정의 설정·루틴·운동 기록을 한 snapshot으로 준비한다. 클라이언트 backupSchema/owner/10MiB 검사, 서버 JSON Schema와 중복ID·소유자·설정·완료 세트·시간대 등 교차필드를 다시 검사한다. 진행 세션은 먼저 종료한다.
2. 로컬 transaction에 `operationId/baseRevision/snapshot/queueIds`를 고정한다. 응답이 유실돼도 같은 자료/작업을 재시도한다. 대기 중의 새 변경은 별도 outbox로 보존한다.
3. 서버는 계정 row lock과 expected revision 비교로 저장한다. 같은 작업/같은 내용은 기존 결과를 돌려주고, 같은 작업ID의 다른 내용/기준 버전은 거부한다. 최신 버전이 다르면 conflict를 반환하고 덮어쓰지 않는다.
4. ACK가 현재 operation과 정확한 다음 revision인지 확인한 뒤 **캡처한 outbox ID만** 지운다. 전송 후 생긴 변경은 다음 전송에 남는다. 오래된 ACK는 다른 pending 작업을 지우지 않는다.

기기 저장 성공과 서버 ACK 완료를 구분한다. 가능한 브라우저에는 navigator.locks로 같은 계정의 탭 전송을 직렬화하고 서버 CAS/idempotency가 최종 정합성을 맡는다. 자동 per-record 동기화·페이지 cursor·실시간 전송·두 편집 자동 병합은 아직 구현하지 않았다. 10MiB의 클라이언트 JSON과 서버 jsonb 직렬화 바이트는 완전히 같은 표현이 아니므로 경계 자료는 서버에서 거부될 수 있다. 대용량 증가에는 레코드 동기화/별도 보관 정책이 필요하다.

## 내려받기·교체·복구

‘클라우드 기록 불러오기’는 계정/응답 스키마를 검증한 뒤 현재 로컬 서명을 보관해 미리보기를 보여준다. 미전송이 있으면 JSON 저장을 안내한다. 사용자가 체크 후 교체할 때 서버 revision을 다시 읽고, 로컬 자료가 미리보기 이후 바뀌지 않았는지 확인한다. 진행 운동/새 변경이 있으면 교체하지 않는다.

기기 기록 교체와 outbox 정리·baseRevision 갱신은 한 transaction이다. 교체 직전 자료 **한 묶음**을 cloud.recovery에 보관해 다운로드할 수 있다. 다음 교체 때 이전 recovery를 바꾸므로 장기/외부 백업은 아니다. 복원 오류는 전체 롤백한다. JSON import는 인증된 현재 owner로 명시 remap하고 새 전송 대기를 만들며 pending을 취소한다. 기존 로컬 모드 DB는 보존한다.

## 본인 계정을 실제 연결하는 절차

아직 등록된 실제 계정/허용 회원은0명이다. 개인 비밀번호는 대화나 문서에 보내지 않는다.

1. 사용자가 Supabase Dashboard → Authentication → Users에서 본인 계정을 등록한다. 비밀번호 입력/계정 확인은 사용자가 직접 수행한다. 메일 초대는 전달 환경을 정한 뒤 사용자가 선택한다.
2. 등록한 Auth user UUID의 DB 접근을 승인한 뒤, 로컬 `app`에서 `npm run cloud:allow-user -- <AUTH_USER_UUID>`를 실행한다. 준비된 스크립트는 기존 Auth user만 추가하며 임의 이메일/새 Auth 계정을 만들지 않는다. 이번에는 실행하지 않았다.
3. 앱 ‘내 설정’에서 로그인한다. 로컬 시안 기록이 있으면 먼저 로컬 JSON을 안전하게 내보내고 로그인 계정에서 가져온다. 실제 기록을 새 검증 origin으로 옮기거나 브라우저 저장소를 지우지 않는다.
4. 가짜 한 루틴/완료 세트로 전송→로그아웃/재로그인→다른 저장소에서 불러오기→기기 JSON 복원 과업을 먼저 확인한다. A/B 실계정·인증 만료·권한 회수·오프라인/충돌 UI까지 SYNC-05/HAR-03에서 고정한다.

회원 권한 회수는 서버 `members.enabled=false`로 기록 접근을 막는다. Auth 계정 삭제/개인 데이터 삭제·operation 보관 기간·비밀번호 복구는 별도 운영 설계다. 공개 가입 차단을 해제하는 것과 기존 계정 로그인/허용 목록은 서로 다른 설정이다.

## 실제 검사와 명령

`app`에서 `npm run cloud:probe`는 Auth 상태·공개 키만 사용한 비로그인 RPC 차단·TLS DB 연결을 확인한다. `npm run cloud:verify`는16개 SQL 계약을 transaction 내 가짜 사용자/임시 권한으로 검사하고 반드시 rollback한다. DDL의 실제 remote 적용은 MCP migration 작업, 서버 연결 검증은 Session pooler를 사용했다. 이 SQL role/JWT 표본 검사는 실제 Auth access token이나 브라우저 로그인 흐름이 아니다. 원격 Auth/members/workspaces/operations 잔여0을 확인했다.

본인 계정 준비 이후 실제 Auth E2E를 보완한다. 서버용 환경 파일은 CI 공개 로그에 넣지 않는다. 운영/preview 프로젝트 분리·RLS 변경 배포·실기기·외부 CI·HTTPS 호스팅은 아직 남았다.

[기술 스택](technology-stack.md) · [현재 하네스](../operations/testing-harness.md) · [남은 작업](remaining-work.md) · [공식 출처](../sources/SRC-036-mantine-supabase.md)

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

## 현재 운영 배포 — 메모·비교 조건

인간 SQL 승인 뒤 dbddbda를 main에 push했다. GitHub37250900828의 check/Chromium/WebKit 세 job이 모두 success이며 artifact를 실제 수신해 **17+15=32 browser**와 의도적 최초 실패 probe의 증거 보존을 확인했다. Pages github:push의 동일 source build/deploy가 success이고 운영 공개24file SHA256/보안 헤더가 검증한 build와 일치한다. 서버 선택 필드 RPC/부정 입력·권한28개 rollback과 기존 ACL/RLS 보존도 완료했다.

메모/장비·가동범위·휴식 즐겨찾기/세부 분류·별칭의 서버 미지원 및 이 단위의 승인/push/배포 대기는 해소됐다. 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)이다. preview DB는 비어 있으며 이번에 새 preview branch/asset 검사를 하지 않았다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다.

[운영 앱](https://lightweight-training.pages.dev) · [불변 배포 증거](../../raw/research/2026-10-05-record-details-git-release.json). 실제 본인 운동/iPhone 저장·재실행·수동 전송/새 저장소 복원·다기기/다버전 Auth·과학 승인 콘텐츠0개/운영 복구·4주 파일럿/P2 관문은 남는다.
