---
type: "Reference"
title: "Supabase — PostgreSQL과 계정 인증"
description: "Supabase 프로젝트는 PostgreSQL DB를 제공하며 Auth를 DB와 연동할 수 있다. 이메일 코드 로그인을 지원하며 코드 방식은 메일 템플릿 설정이 필요하다."
tags:
  - "source"
  - "technology"
  - "pwa"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T20:46:10+09:00"
sources:
  - id: "official-1"
    resource: "https://supabase.com/docs/guides/database/overview"
    title: "Supabase — PostgreSQL과 계정 인증"
  - id: "official-2"
    resource: "https://supabase.com/docs/guides/auth"
    title: "Supabase — PostgreSQL과 계정 인증"
  - id: "official-3"
    resource: "https://supabase.com/docs/guides/auth/auth-email-passwordless"
    title: "Supabase — PostgreSQL과 계정 인증"
  - id: "mail-deployment"
    resource: "SRC-030-supabase-invite-mail.md"
    title: "지인 메일과 가입 제한"
source_id: "SRC-025"
resource: "https://supabase.com/docs/guides/database/overview"
review_scope: "공식 DB 개요·Auth·이메일 OTP 설정 본문 확인; 프로젝트 생성·메일/로그인 시험 미수행"
retrieved_at: "2026-10-03T20:17:12+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Supabase — PostgreSQL과 계정 인증

## 출처와 확인 범위

- ID: SRC-025
- 유형: 각 프로젝트의 공식 기술·운영 문서
- 확인일: 2026-10-03
- 읽은 범위: **공식 DB 개요·Auth·이메일 OTP 설정 본문 확인; 프로젝트 생성·메일/로그인 시험 미수행**
- [공식 자료 1](https://supabase.com/docs/guides/database/overview) · [공식 자료 2](https://supabase.com/docs/guides/auth) · [공식 자료 3](https://supabase.com/docs/guides/auth/auth-email-passwordless)

## 짧은 요약

Supabase 프로젝트는 PostgreSQL DB를 제공하며 Auth를 DB와 연동할 수 있다. 이메일 코드 로그인을 지원하며 코드 방식은 메일 템플릿 설정이 필요하다.

## 한계와 추가 검토

로그인·자동 복구·오프라인 동기화는 앱에 연결하고 시험해야 한다. 메일 전달과 홈 화면/브라우저 세션 차이를 실제 iPhone에서 확인한다.

## 제품 적용 판단

개인 기록을 계정에 연결하는 관리형 백엔드 후보로 추천한다. 본인 계정부터 시작하고 지인 계정으로 확장한다. 공식 기능과 앱의 구현 제안을 구분한다.

## 지인 배포 조건 추가 확인

일반 지인 이메일에는 기본 SMTP의 수신 제한을 고려해야 한다. 이메일 코드용 템플릿은 새 무료 프로젝트 기본 발송 환경에서 수정 제한이 있으므로 custom SMTP 등 조건을 검토한다. [새 확인 자료](SRC-030-supabase-invite-mail.md). 이전 수집 원본과 확인 범위는 보존한다.

## Related

[언어·개인 데이터 저장](../product/technology-data-storage.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-pwa-stack-research.json)
