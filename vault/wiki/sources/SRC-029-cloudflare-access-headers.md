---
type: "Reference"
title: "Cloudflare — 미리보기 접근 제한과 브라우저 보안 헤더"
description: "Pages preview는 기본 공개다. preview용 Access 설정은 운영 도메인까지 보호하지 않는다. 운영 주소에는 별도 정책이 필요하다. 정적 응답의 보안 헤더는 _headers로 지정할 수 있다."
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
    resource: "https://developers.cloudflare.com/pages/configuration/preview-deployments/"
    title: "Cloudflare — 미리보기 접근 제한과 브라우저 보안 헤더"
  - id: "official-2"
    resource: "https://developers.cloudflare.com/pages/platform/known-issues/"
    title: "Cloudflare — 미리보기 접근 제한과 브라우저 보안 헤더"
  - id: "official-3"
    resource: "https://developers.cloudflare.com/pages/configuration/headers/"
    title: "Cloudflare — 미리보기 접근 제한과 브라우저 보안 헤더"
source_id: "SRC-029"
resource: "https://developers.cloudflare.com/pages/configuration/preview-deployments/"
review_scope: "preview 공개 기본값·Access 범위·도메인별 설정·정적 헤더 안내 확인; iOS 로그인 시험 미수행"
retrieved_at: "2026-10-03T20:46:10+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Cloudflare — 미리보기 접근 제한과 브라우저 보안 헤더

## 출처와 확인 범위

- ID: SRC-029
- 확인일: 2026-10-03
- 유형: 일차 기술·보안·운영 안내
- 읽은 범위: **preview 공개 기본값·Access 범위·도메인별 설정·정적 헤더 안내 확인; iOS 로그인 시험 미수행**
- [공식 자료 1](https://developers.cloudflare.com/pages/configuration/preview-deployments/) · [공식 자료 2](https://developers.cloudflare.com/pages/platform/known-issues/) · [공식 자료 3](https://developers.cloudflare.com/pages/configuration/headers/)

## 짧은 요약

Pages preview는 기본 공개다. preview용 Access 설정은 운영 도메인까지 보호하지 않는다. 운영 주소에는 별도 정책이 필요하다. 정적 응답의 보안 헤더는 _headers로 지정할 수 있다.

## 한계와 제품 적용 판단

정적 헤더 설정을 Supabase API나 함수 응답에 적용되는 것으로 해석하지 않는다. 도메인별 우회 경로와 PWA 인증·오프라인 사용을 시험한다.

preview를 제한하고 실사용 DB와 분리한다. 운영 사이트 전체의 Access 제한은 추가 보호 선택이며 계정/DB 권한을 대체하지 않는다. 기술의 기본 동작과 이 프로젝트의 채택 제안을 구분한다.

## Related

[배포·보안 기획](../product/deployment-security.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-deployment-security-research.json)
