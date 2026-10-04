---
type: "Source Note"
title: "Supabase JSON Schema와 계약 확장 검토"
description: "공식 문서 확인과 서버 실제 관찰을 구분한다."
tags:
  - "source"
  - "technology"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-05T01:38:13+09:00"
sources:
  - id: "run"
    resource: "../../raw/research/2026-10-05-record-details-loop.json"
    title: "관찰"
source_id: "SRC-050"
review_scope: "Official relevant sections; read-only synthetic server preflight; migration not applied"
---

# SRC-050

공식 [pg_jsonschema](https://supabase.com/docs/guides/database/extensions/pg_jsonschema) 함수/JSONB/check constraint 관련 본문과 search_docs 반환을 확인했다. [changelog](https://supabase.com/changelog.md)는 web MIME 실패 후 HTTPS로 읽었고 관련 [Postgres 변경 안내](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes)의 범위를 확인했다. 이 앱은 이번 작업에서 DB 버전·확장·인덱스를 변경하지 않는다.

현재 클라우드 함수에서 새 필드가 없는 사실과 가짜 입력의 legacy=true/rest=false/details=false를 확인했다. 이는 배포된 앱의 새 선택 필드가 기존 strict JSON Schema에 맞지 않는 제품 오류다. 함수 갱신/원격 검증은 아직 승인 대기다. 전문/과학 검토 자료가 아니다. [실행](../../raw/research/2026-10-05-record-details-loop.json).
