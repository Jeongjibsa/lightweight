---
type: "Reference"
title: "Supabase — Data API·함수·파일 접근 권한"
description: "Data API 노출은 스키마·grants·RLS를 함께 확인한다. 새 테이블 자동 노출의 기본값 변경이 안내되었다. 사용자 호출 함수에도 인증과 소유자 검사가 필요하다. private 파일 접근은 정책 대상이다."
tags:
  - "source"
  - "deployment"
  - "security"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T20:46:10+09:00"
sources:
  - id: "official-1"
    resource: "https://supabase.com/docs/guides/api/securing-your-api"
    title: "Supabase — Data API·함수·파일 접근 권한"
  - id: "official-2"
    resource: "https://supabase.com/docs/guides/functions/auth"
    title: "Supabase — Data API·함수·파일 접근 권한"
  - id: "official-3"
    resource: "https://supabase.com/docs/guides/storage/buckets/fundamentals"
    title: "Supabase — Data API·함수·파일 접근 권한"
  - id: "official-4"
    resource: "https://supabase.com/docs/guides/auth/sessions"
    title: "Supabase — Data API·함수·파일 접근 권한"
  - id: "official-5"
    resource: "https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically"
    title: "Supabase — Data API·함수·파일 접근 권한"
source_id: "SRC-031"
resource: "https://supabase.com/docs/guides/api/securing-your-api"
review_scope: "grants/RLS 차이·API 노출 변경·함수 인증·private bucket·세션/JWT 본문 확인; 실제 DB/함수 시험 미수행"
retrieved_at: "2026-10-03T20:46:10+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Supabase — Data API·함수·파일 접근 권한

## 출처와 확인 범위

- ID: SRC-031
- 확인일: 2026-10-03
- 유형: 일차 기술·보안·운영 안내
- 읽은 범위: **grants/RLS 차이·API 노출 변경·함수 인증·private bucket·세션/JWT 본문 확인; 실제 DB/함수 시험 미수행**
- [공식 자료 1](https://supabase.com/docs/guides/api/securing-your-api) · [공식 자료 2](https://supabase.com/docs/guides/functions/auth) · [공식 자료 3](https://supabase.com/docs/guides/storage/buckets/fundamentals) · [공식 자료 4](https://supabase.com/docs/guides/auth/sessions) · [공식 자료 5](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)

## 짧은 요약

Data API 노출은 스키마·grants·RLS를 함께 확인한다. 새 테이블 자동 노출의 기본값 변경이 안내되었다. 사용자 호출 함수에도 인증과 소유자 검사가 필요하다. private 파일 접근은 정책 대상이다.

## 한계와 제품 적용 판단

기본값만으로 보안을 가정하지 않는다. views·RPC·관리자 키·파일 권한·세션 회수 조건도 확인한다. 엄격한 회수는 활성 세션/회원 상태 검사가 필요할 수 있다. 사용자 간 차단은 실제 요청으로 검증한다.

필요한 API만 노출하고 소유자·공통 콘텐츠별 정책을 설계한다. AI 함수에는 인증·사용량 제한을 추가한다. 기술의 기본 동작과 이 프로젝트의 채택 제안을 구분한다.

## Related

[배포·보안 기획](../product/deployment-security.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-deployment-security-research.json)
