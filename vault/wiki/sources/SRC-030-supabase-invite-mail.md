---
type: "Reference"
title: "Supabase — 가입 제한과 인증 메일 배포 조건"
description: "일반 가입을 끄면 기존 사용자만 로그인한다. 기본 SMTP는 프로젝트 팀 주소만 대상으로 한다. 새 무료 프로젝트의 기본 메일 템플릿 변경은 제한되며 자체 SMTP 사용 등 조건을 확인해야 한다."
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
    resource: "https://supabase.com/docs/guides/auth/general-configuration"
    title: "Supabase — 가입 제한과 인증 메일 배포 조건"
  - id: "official-2"
    resource: "https://supabase.com/docs/guides/auth/auth-smtp"
    title: "Supabase — 가입 제한과 인증 메일 배포 조건"
  - id: "official-3"
    resource: "https://supabase.com/docs/guides/auth/rate-limits"
    title: "Supabase — 가입 제한과 인증 메일 배포 조건"
  - id: "official-4"
    resource: "https://supabase.com/changelog/46599-changes-to-email-template-customisation-on-free-tier"
    title: "Supabase — 가입 제한과 인증 메일 배포 조건"
source_id: "SRC-030"
resource: "https://supabase.com/docs/guides/auth/general-configuration"
review_scope: "가입/익명 로그인·기본 SMTP 수신 제한·메일 rate limit·2026-06-03 변경 확인; 메일 시험 미수행"
retrieved_at: "2026-10-03T20:46:10+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Supabase — 가입 제한과 인증 메일 배포 조건

## 출처와 확인 범위

- ID: SRC-030
- 확인일: 2026-10-03
- 유형: 일차 기술·보안·운영 안내
- 읽은 범위: **가입/익명 로그인·기본 SMTP 수신 제한·메일 rate limit·2026-06-03 변경 확인; 메일 시험 미수행**
- [공식 자료 1](https://supabase.com/docs/guides/auth/general-configuration) · [공식 자료 2](https://supabase.com/docs/guides/auth/auth-smtp) · [공식 자료 3](https://supabase.com/docs/guides/auth/rate-limits) · [공식 자료 4](https://supabase.com/changelog/46599-changes-to-email-template-customisation-on-free-tier)

## 짧은 요약

일반 가입을 끄면 기존 사용자만 로그인한다. 기본 SMTP는 프로젝트 팀 주소만 대상으로 한다. 새 무료 프로젝트의 기본 메일 템플릿 변경은 제한되며 자체 SMTP 사용 등 조건을 확인해야 한다.

## 한계와 제품 적용 판단

가입 차단은 개별 계정 회수나 DB 권한 설정을 대체하지 않는다. 이메일 코드 후보에는 발송 서비스·템플릿·도메인·실제 전달 확인이 필요하다.

본인·초대 지인 계정만 사용하도록 가입과 익명 로그인을 제한하는 안을 추천한다. 지인을 DB 운영팀에 넣어 메일 제한을 우회하지 않는다. 기술의 기본 동작과 이 프로젝트의 채택 제안을 구분한다.

## Related

[배포·보안 기획](../product/deployment-security.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-deployment-security-research.json)
