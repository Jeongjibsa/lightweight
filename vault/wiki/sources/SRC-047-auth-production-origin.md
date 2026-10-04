---
type: "Reference"
title: "Supabase Auth 운영 반환 주소"
description: "Site URL·정확한 production 경로와 실제 설정 경계를 확인한다."
tags:
  - "source"
  - "auth"
  - "deployment"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T21:04:19+09:00"
sources:
  - id: "official"
    resource: "https://supabase.com/docs/guides/auth/redirect-urls"
    title: "공식 문서"
source_id: "SRC-047"
resource: "https://supabase.com/docs/guides/auth/redirect-urls"
review_scope: "Site URL/production exact-path partial reading"
retrieved_at: "2026-10-04T21:04:19+09:00"
---

# SRC-047 Auth 운영 반환 주소

출처: [Supabase 공식 Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), 확인일2026-10-04. 읽은 범위: Site URL 기본값/명시 redirect와 production 정확한 경로 안내 일부. 전체 Auth/메일/복구 구현을 검토한 것이 아니다.

Site URL은 명시 반환 주소가 없을 때 사용하는 기본값이다. 운영 배포에 맞춰 기본 localhost 주소를 고정 운영 주소로 바꾸고 정확한 반환 경로 하나를 등록했다. wildcard나 preview URL은 등록하지 않았다.

실제 Dashboard 저장 후 값을 확인했다. password 로그인 초기 구현은 URL token을 자동 처리하지 않으며 비밀번호 재설정 UI/메일 전달·실제 계정 흐름은 아직 없다. URL 설정으로 이 관문이 완료되지는 않는다. [실행](../../raw/research/2026-10-04-pages-deployment.json)·[계정 절차](../product/supabase-integration.md).
