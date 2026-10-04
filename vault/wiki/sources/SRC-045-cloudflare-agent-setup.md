---
type: "Reference"
title: "Cloudflare — Codex 공식 설정·Pages Direct Upload"
description: "공식 설정과 배포 도구의 현재 문법·권한 경계를 확인한다."
tags:
  - "source"
  - "cloudflare"
  - "deployment"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T16:59:17+09:00"
sources:
  - id: "prompt"
    resource: "https://developers.cloudflare.com/agent-setup/prompt.md"
    title: "공식 설정"
  - id: "direct"
    resource: "https://developers.cloudflare.com/pages/get-started/direct-upload/"
    title: "Pages Direct Upload"
  - id: "ci"
    resource: "https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/"
    title: "Pages CI"
source_id: "SRC-045"
review_scope: "Full setup prompt and relevant Direct Upload/CI sections; local Wrangler CLI help; no remote deployment"
retrieved_at: "2026-10-04T16:59:17+09:00"
---

# Cloudflare — Codex 공식 설정과 Pages 배포

2026-10-04 공식 agent-setup prompt 전체를 fetch해 Codex/Other agents 부분을 읽었다. Pages Direct Upload/CI 문서와 설치한 Wrangler4.147.0의 login/scopes/pages deploy help를 확인했다. 전체 prompt의 hash와 실제 설치/CI 결과는 [수집 기록](../../raw/research/2026-10-04-cloudflare-setup.json)에 있다.

공식 프롬프트는 Cloudflare skills와 MCP5개를 요구한다. cf CLI beta는 선택이며 이번에는 설치하지 않았다. 코드 설정 등록과 OAuth 인증 성공은 구별한다. 자동 add의 broad OAuth Continue는 자동 승인 검토가 거부하여 사용자에게 전체 권한/Pages 제한 권한 선택을 요청했다. CLI 또는 기존 connector로 이 거부를 우회하지 않는다.

Pages 문서는 사전 빌드 산출물의 Direct Upload와 CI에서 Account/Cloudflare Pages/Edit token을 설명한다. Git 연동과 Direct Upload 사이를 같은 프로젝트에서 전환할 수 없으므로 생성 전에 배포 경로를 정한다. 이번 작은 정적 PWA는 검증한 app/dist를 Wrangler로 명시 배포하는 준비를 했으며 원격 생성/공개는 인증 이후다.

[공식 설정](https://developers.cloudflare.com/agent-setup/prompt.md) · [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) · [CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)

계정 email·OAuth URL/state/code/token은 기록하지 않는다. 공식 설명은 원격 실행/실기기 성공을 보장하지 않는다.
