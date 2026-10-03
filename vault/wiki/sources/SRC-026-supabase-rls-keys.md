---
type: "Reference"
title: "Supabase — 사용자별 권한과 서버 비밀키"
description: "RLS로 로그인 사용자 ID에 맞는 행의 읽기·쓰기를 제한할 수 있다. 브라우저용 publishable key와 권한이 높은 secret/service_role key를 구분하며 후자는 RLS를 우회하므로 서버에만 둔다."
tags:
  - "source"
  - "technology"
  - "pwa"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T20:17:12+09:00"
sources:
  - id: "official-1"
    resource: "https://supabase.com/docs/guides/database/postgres/row-level-security"
    title: "Supabase — 사용자별 권한과 서버 비밀키"
  - id: "official-2"
    resource: "https://supabase.com/docs/guides/getting-started/api-keys"
    title: "Supabase — 사용자별 권한과 서버 비밀키"
  - id: "official-3"
    resource: "https://supabase.com/docs/guides/functions/secrets"
    title: "Supabase — 사용자별 권한과 서버 비밀키"
source_id: "SRC-026"
resource: "https://supabase.com/docs/guides/database/postgres/row-level-security"
review_scope: "공식 RLS 소유자 정책·키 종류·서버 환경 변수 안내 확인; 정책/API 구현·접근 시험 미수행"
retrieved_at: "2026-10-03T20:17:12+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Supabase — 사용자별 권한과 서버 비밀키

## 출처와 확인 범위

- ID: SRC-026
- 유형: 각 프로젝트의 공식 기술·운영 문서
- 확인일: 2026-10-03
- 읽은 범위: **공식 RLS 소유자 정책·키 종류·서버 환경 변수 안내 확인; 정책/API 구현·접근 시험 미수행**
- [공식 자료 1](https://supabase.com/docs/guides/database/postgres/row-level-security) · [공식 자료 2](https://supabase.com/docs/guides/getting-started/api-keys) · [공식 자료 3](https://supabase.com/docs/guides/functions/secrets)

## 짧은 요약

RLS로 로그인 사용자 ID에 맞는 행의 읽기·쓰기를 제한할 수 있다. 브라우저용 publishable key와 권한이 높은 secret/service_role key를 구분하며 후자는 RLS를 우회하므로 서버에만 둔다.

## 한계와 추가 검토

RLS는 설정·검증해야 작동한다. 화면 필터나 로그인만으로 데이터가 분리되지는 않는다. 이 구조는 사용자 간 접근 제한이며 운영자도 읽을 수 없는 종단 간 암호화를 의미하지 않는다.

## 제품 적용 판단

개인 테이블마다 user_id를 두고 소유자 정책을 검증한다. AI 서비스 키도 서버 함수에서만 사용하고 사용자의 계산 결과를 최소 범위로 처리한다. 공식 기능과 앱의 구현 제안을 구분한다.

## Related

[언어·개인 데이터 저장](../product/technology-data-storage.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-pwa-stack-research.json)
