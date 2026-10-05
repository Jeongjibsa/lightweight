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
  at: "2026-10-05T10:16:15+09:00"
sources:
  - id: "run"
    resource: "../../raw/research/2026-10-05-record-details-loop.json"
    title: "관찰"
  - id: "validator-human-approval"
    resource: "../../raw/conversations/2026-10-05-024.md"
    title: "검증 함수 SQL 승인과 재개"
source_id: "SRC-050"
review_scope: "Official relevant sections; read-only synthetic server preflight; migration not applied"
---

# SRC-050

공식 [pg_jsonschema](https://supabase.com/docs/guides/database/extensions/pg_jsonschema) 함수/JSONB/check constraint 관련 본문과 search_docs 반환을 확인했다. [changelog](https://supabase.com/changelog.md)는 web MIME 실패 후 HTTPS로 읽었고 관련 [Postgres 변경 안내](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes)의 범위를 확인했다. 이 앱은 이번 작업에서 DB 버전·확장·인덱스를 변경하지 않는다.

현재 클라우드 함수에서 새 필드가 없는 사실과 가짜 입력의 legacy=true/rest=false/details=false를 확인했다. 이는 배포된 앱의 새 선택 필드가 기존 strict JSON Schema에 맞지 않는 제품 오류다. 함수 갱신/원격 검증은 아직 승인 대기다. 전문/과학 검토 자료가 아니다. [실행](../../raw/research/2026-10-05-record-details-loop.json).

## CONV0024 승인된 서버 변경 — 2026-10-05

인간 사용자의 명시 승인 후 준비된 `training_optional_record_fields` SQL을 같은 Supabase MCP 경로로 적용했다. 기존 함수 identity·owner·security invoker/빈 search_path·ACL, private 세 테이블의 RLS/force RLS·ACL·정책은 그대로다. 기존 형식 및 새 메모/장비·가동범위·휴식 즐겨찾기·세부 분류/별칭을 RPC 저장→조회와 idempotent retry로 확인했다. 잘못된 소유자·중복·길이/입력/시각을 포함한 **28개 서버 검사**가 통과했고 테스트 계정·기록·임시 권한은 모두 rollback했다. 실제 본인 운동 기록이나 실제 브라우저 Auth 왕복의 검증으로 확대하지 않는다.

자동 검토의 앞선 승인 대기/거부는 당시 이력이며 이 명시 승인과 적용으로 해소됐다. app0.2.0/IndexedDB2/backup1, 106 Vitest·Node10·build/types/format/artifact25(lint기존6경고)를 유지한다. 신규 서버 검증 뒤 main push/새 GitHub CI/Pages 배포 검증을 이어간다. 실제 iPhone/운동·다기기/다버전·과학 승인0개·운영복구/파일럿/P2 관문은 남는다.

[인간 승인](../conversations/2026-10-05-024.md) · [불변 서버 확인](../../raw/research/2026-10-05-cloud-validator-approved.json).
