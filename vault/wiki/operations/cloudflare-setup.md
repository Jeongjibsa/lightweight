---
type: "Playbook"
title: "Cloudflare 연결과 정적 PWA 배포 운영"
description: "공식 설치·인증 상태·최소 권한·배포 전 검사와 확인 순서."
tags:
  - "operations"
  - "cloudflare"
  - "deployment"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T21:48:06+09:00"
sources:
  - id: "cf-recheck"
    resource: "../../raw/research/2026-10-04-cloudflare-setup-recheck.json"
    title: "Cloudflare 공식 설정과 OAuth 재확인"
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "사용자 요청"
  - id: "official"
    resource: "../sources/SRC-045-cloudflare-agent-setup.md"
    title: "공식 지침"
  - id: "check"
    resource: "../../raw/research/2026-10-04-cloudflare-setup.json"
    title: "확인 결과"
  - id: "scope-check"
    resource: "../../raw/research/2026-10-04-pages-scoped-auth.json"
    title: "Pages 확인"
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
---

# Cloudflare 연결과 정적 PWA 배포

## 최신 운영 상태 — 2026-10-04

운영/DB 연결 없는 preview에 검증한96bbb74를 배포했다. GitHub37201900937의3job success·78 Vitest/Node8·Chromium11/WebKit9, 실제 공개24파일 hash/헤더 일치를 확인했다. 과학 승인 설명은0개다. 후속 문서 commit은 앱 bundle을 바꾸지 않는다. [확인](../../raw/research/2026-10-04-release-account-gate.json).

사용자가 지정 계정의 SQL 등록을 명시 승인한 뒤 허용 목록에 적용했고 enabled=true·등록1/허용1을 확인했다. 사용자가 직접 로그인한 Chrome에서 빈 기본 프로필의 실제 전송 ACK→서버 revision1→조회/명시 기기 적용·대기0·교체 전 복구 수단을 확인했다. 같은 기기 빈 프로필 시험이며 실제 운동 기록/새 기기/A·B/만료/로그아웃/메일·iPhone 검증은 남는다. [최신 확인](../../raw/research/2026-10-04-auth-profile-roundtrip.json). 개인 식별자/비밀번호/token은 vault에 보관하지 않는다.


## 첫 HTTPS 배포 — 2026-10-04 현재

운영: [lightweight-training.pages.dev](https://lightweight-training.pages.dev). preview: [운영 DB 연결 없는 미리보기](https://preview.lightweight-training.pages.dev). 화면과 기기 기록을 바로 사용할 수 있다. 공개 페이지이며 계정 데이터 접근은 Supabase 허용 목록/RLS로 제한한다. site-wide Access는 미설정이다.

이메일 완료 답변 뒤 project 생성 성공, 검증된3bc6022를 main에 fast-forward/push했다. GitHub3job success 후 app/dist만 배포했다. 24파일 artifact gate, 실제 공개23파일(index/PWA/font/JS/CSS)의 SHA256 일치와 보안 헤더를 운영/preview에서 확인했다. 다섯 실제 HTTPS 화면을 캡처/직접 확인했다. [실행](../../raw/research/2026-10-04-pages-deployment.json).

Supabase Site URL과 정확한 root 반환 경로 하나를 저장했다. Auth settings200/signupDisabled=true, 비로그인 read/write RPC401을 재확인했다. Auth 계정0개: 본인 등록/비밀번호는 사용자가 직접 준비, 허용 UUID·실제 로그인/복원/A-B/만료는 다음 단계다. 비밀번호 복구 UI는 아직 없다.

78개 Vitest + 배포 계약3개·build/format/E2E타입 통과, lint exit0이지만 기존WorkoutView effect 경고6개는 남는다. pages:verify는 읽기 전용으로 실제 헤더/파일 hash를 검사하며 네트워크/불일치에 실패한다. 실제 iPhone/과학 검토/운영 복구 관문은 유지한다. 다음 독립 구현은 공개 콘텐츠 registry/검토 gate와 기록 편의의 남은 범위다. 아래 증분은 당시의 상태다.


## 현재 상태

CONV-0016에서 공식 prompt 전체를 다시 확인했고 기존 수집본과 SHA256이 같았다. 공식 installer로 ~/.agents/skills의 스킬16개를 갱신하고 각 SKILL.md를 확인했다. Codex config의 공식 MCP5개는 정확한 URL/enabled 상태를 확인해 기존 등록을 유지했다. installer는 PromptScript global 미지원도 출력했으므로 다른 모든 agent의 성공을 주장하지 않는다.

`codex mcp login cloudflare`가 exit0/성공을 반환했고 현재 main MCP의 계정 읽기는 HTTP200이었다. public cloudflare-docs 검색도 성공했다. **main MCP OAuth는 성공 확인**, bindings/builds/observability3개의 별도 OAuth와 Wrangler 인증은 당시 미검증이었다. 이전 broad OAuth 자동 검토 거부·만료 이력은 [첫 기록](../../raw/research/2026-10-04-cloudflare-setup.json)에 보존하고 이번 [재확인](../../raw/research/2026-10-04-cloudflare-setup-recheck.json)을 구분한다. 브라우저 승인 동작은 직접 관찰·자동화하지 않았다.

특화 MCP는 공식 지침에 따라 첫 사용 시 OAuth를 진행한다. 등록된 전체 MCP와 갱신한 스킬을 반영하려면 agent를 재시작한다. 진행 중 작업을 임의 reset하지 않는다.

Wrangler4.147.0을 app 개발 의존성으로 pin했다. CONV-0016에서 사용자가 기존 Wrangler 유지·cf 생략을 선택해 별도 cf beta/global CLI는 설치하지 않았다. 로그는 임시 디렉터리로 지정하고 OAuth credential은 repo/vault에 기록하지 않는다. 권한 거부를 기존 connector나 다른 CLI 경로로 우회하지 않는다.

## 배포 경계와 순서

1. 계정·project를 확인하고 Pages 프로젝트 lightweight-training/main을 생성한다. 이름은 구현 선택이며 생성 결과가 확인되기 전 확정 URL을 제공하지 않는다.
2. production은 공개용 Supabase URL/publishable key만 build에 사용한다. preview는 VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY를 빈 override로 build해 production DB에 연결하지 않는다. 운영 DB 연결 없는 preview를 가짜 자료로 검증한다.
3. npm run check, format:check, pages:check 및 vault validation을 통과한 코드만 배포한다. pages:check는 **실제 dist**의 private 경로/symlink/source map/서버코드/privileged JWT/secret key·test marker, PWA 파일과 주요 보안 헤더를 검사한다. SDK에 있는 역할 이름 자체를 credential로 판정하지 않는다.
4. npm run pages:deploy는 build→artifact gate→Wrangler로 app/dist만 전송한다. 수동 명령은 사용자 배포 요청 범위에서 실행한다. root/vault/output/.env를 전송하지 않는다. credential이나 개인 백업을 공개 파일에 넣지 않는다.
5. 원격 HTTPS에서 manifest/SW/CSP/nosniff/frame 제한과 다섯 화면을 확인한다. Auth site_url/redirect는 확정한 고정 origin으로 별도 설정하고 실제 로그인/로그아웃/권한을 시험한다.
6. 설치/오프라인/업데이트/keyboard/VoiceOver/잠금은 실제 iPhone의 별도 G3 관문이다. desktop Chromium/WebKit으로 대체하지 않는다.

Direct Upload 프로젝트는 Git 연동으로 전환할 수 없으므로 향후 CI도 Wrangler 경로를 사용한다. 자동 production 배포는 승인된 credential/CI gate가 준비된 뒤 구성한다. full MCP 권한 대신 배포만 허용하려면 Pages 권한·account/user read 등 실제 필요한 OAuth scope 또는 해당 account의 Pages Edit token을 쓴다. broad approval과 최소 배포 approval은 구분한다.

## 복귀·운영

고정 origin은 IndexedDB/설치의 기준이므로 이후 임의로 바꾸지 않는다. 이전 Pages deployment로 화면을 되돌려도 DB schema/기기 기록이 되돌아간다고 주장하지 않는다. 본인/지인 전송은 허용 목록과 RLS를 그대로 유지한다. custom domain·site-wide Access·메일 제공자는 미정이며 이번 연결만으로 설정했다고 표시하지 않는다.

[공식 근거](../sources/SRC-045-cloudflare-agent-setup.md) · [현재 결과](../../raw/research/2026-10-04-cloudflare-setup.json) · [배포/보안](../product/deployment-security.md) · [남은 작업](../product/remaining-work.md)

## Pages 제한 인증의 현재 결과

Wrangler 로그인/계정 확인에 성공했다. 실제 scope는 user:read/account:read/pages:write/offline_access 네 개다. 계정 전체 관리 권한을 CLI에 추가하지 않았다. Pages project 목록은 빈 배열이었고 생성 요청은 이메일 인증 필요(API8000077)로 거부됐다. 이메일 인증 후 한 번 다시 진행한다. 원격 URL/배포/Auth site_url은 아직 없다. 첫 생성에서 CLI4.147.0이 Workers로 자동 위임해 entrypoint 오류가 나, 설치된 코드의 create force 의미를 확인하고 직접 Pages 생성만 선택했다. 삭제/덮어쓰기/권한 검토 우회가 아니다. [불변 확인](../../raw/research/2026-10-04-pages-scoped-auth.json).

## 실제 배포 일치 검사

app에서 npm run pages:verify -- https://lightweight-training.pages.dev dist, preview는 해당 origin과 dist-preview를 지정한다. bare HTTPS origin만 허용하고 root/asset redirect를 거부한다. _headers는 서버 처리용이라 원격 파일 비교에서 제외한다. 누락 헤더/정책 차이/파일 hash 차이·통신 실패는 검사 실패다. test:deploy의3계약이 npm run check와 GitHub CI에 포함된다. 자동 CI 배포 credential은 만들지 않았으므로 push만으로 Pages 배포되지 않는다.
