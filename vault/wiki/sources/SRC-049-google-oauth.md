---
type: "Source Note"
title: "Supabase Google OAuth/linking/PKCE"
description: "공식 기술 문서의 확인 범위와 제품 검증 한계를 기록한다."
tags:
  - "source"
  - "technology"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T23:46:05+09:00"
sources:
  - id: "capture"
    resource: "../../raw/research/2026-10-04-git-oauth-review.json"
    title: "수집과 실제 설정 관찰"
source_id: "SRC-049"
review_scope: "Official documentation sections; no live Google OAuth execution"
---

# SRC-049

Supabase 공식 [Google 로그인](https://supabase.com/docs/guides/auth/social-login/auth-google)·[identity 연결](https://supabase.com/docs/guides/auth/auth-identity-linking)·[PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow) 관련 본문과 search_docs 반환을 확인했다. Google web client/provider 설정, OAuth 시작과 복귀, 검증된 같은 이메일의 자동 연결/로그인 중 수동 연결, code exchange와 시작 브라우저의 verifier 필요를 검토했다.

제품 문서 검토이며 Google Console client 생성·provider 활성화·실제 Google 인증은 수행하지 않았다. 현 앱은 callback 자동 처리가 꺼져 있어 버튼만으로 연결되지 않는다. 공개 가입 차단과 DB 허용 목록은 보존하며 기존 UID 연결/권한을 실제 검증해야 한다. iPhone 홈 화면 앱에서 다른 브라우저로 이동하는 흐름은 별도 과업이다. [관찰](../../raw/research/2026-10-04-git-oauth-review.json)·[검토](../product/google-oauth-review.md).
