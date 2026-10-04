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
  at: "2026-10-04T16:59:17+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "사용자 요청"
  - id: "official"
    resource: "../sources/SRC-045-cloudflare-agent-setup.md"
    title: "공식 지침"
  - id: "check"
    resource: "../../raw/research/2026-10-04-cloudflare-setup.json"
    title: "확인 결과"
---

# Cloudflare 연결과 정적 PWA 배포

## 현재 상태

공식 스킬16개를 ~/.agents/skills에 설치했고 Codex config에 공식 MCP5개를 등록했다. cloudflare-docs는 인증이 필요 없다. 나머지는 각각 OAuth가 필요하며 **등록을 인증 완료로 표시하지 않는다**. 계정 조회1회는 기존 plugin session으로 성공했지만 새 MCP의 broad OAuth 승인은 자동 검토가 거부했다. 사용자 권한 선택이 pending이다. 새 도구를 agent에 반영하려면 재시작이 필요할 수 있으며 진행 중 작업을 임의 reset하지 않는다.

Wrangler4.147.0을 app 개발 의존성으로 pin했다. 별도 cf beta/global CLI는 설치하지 않았다. 로그는 임시 디렉터리로 지정하고 OAuth credential은 repo/vault에 기록하지 않는다. 권한 거부를 기존 connector나 다른 CLI 경로로 우회하지 않는다.

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
