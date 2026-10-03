---
type: "Reference"
title: "Cloudflare Pages — Git 연동과 정적 PWA 배포"
description: "Pages는 Git 연결 배포·브랜치 미리보기와 Vite 빌드·도메인 연결을 안내한다. 성공한 이전 운영 배포로 복귀할 수 있다."
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
    resource: "https://developers.cloudflare.com/pages/configuration/git-integration/"
    title: "Cloudflare Pages — Git 연동과 정적 PWA 배포"
  - id: "official-2"
    resource: "https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/"
    title: "Cloudflare Pages — Git 연동과 정적 PWA 배포"
  - id: "official-3"
    resource: "https://developers.cloudflare.com/pages/configuration/custom-domains/"
    title: "Cloudflare Pages — Git 연동과 정적 PWA 배포"
  - id: "official-4"
    resource: "https://developers.cloudflare.com/pages/configuration/rollbacks/"
    title: "Cloudflare Pages — Git 연동과 정적 PWA 배포"
source_id: "SRC-028"
resource: "https://developers.cloudflare.com/pages/configuration/git-integration/"
review_scope: "공식 Git·Vite 빌드·도메인·이전 운영 배포 복귀 안내 본문 확인; 계정·DNS·빌드 시험 미수행"
retrieved_at: "2026-10-03T20:46:10+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Cloudflare Pages — Git 연동과 정적 PWA 배포

## 출처와 확인 범위

- ID: SRC-028
- 확인일: 2026-10-03
- 유형: 일차 기술·보안·운영 안내
- 읽은 범위: **공식 Git·Vite 빌드·도메인·이전 운영 배포 복귀 안내 본문 확인; 계정·DNS·빌드 시험 미수행**
- [공식 자료 1](https://developers.cloudflare.com/pages/configuration/git-integration/) · [공식 자료 2](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/) · [공식 자료 3](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [공식 자료 4](https://developers.cloudflare.com/pages/configuration/rollbacks/)

## 짧은 요약

Pages는 Git 연결 배포·브랜치 미리보기와 Vite 빌드·도메인 연결을 안내한다. 성공한 이전 운영 배포로 복귀할 수 있다.

## 한계와 제품 적용 판단

Vite 3 이름의 가이드에서 전체 최신 의존성 호환성을 보장하지 않는다. 실제 빌드와 도메인/인증서 동작을 확인한다.

Vite 결과물 dist만 배포하는 PWA 호스트로 추천한다. 제공자와 운영 도메인 선택은 미확정이다. 기술의 기본 동작과 이 프로젝트의 채택 제안을 구분한다.

## Related

[배포·보안 기획](../product/deployment-security.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-deployment-security-research.json)
