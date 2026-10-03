---
type: "Reference"
title: "Supabase — 백업과 무료 플랜 운영 조건"
description: "공식 안내는 무료 플랜에서 정기적인 데이터 내보내기와 외부 백업을 권장한다. 가격 페이지에는 무료 프로젝트가 1주 비활성 후 일시 중단된다고 명시한다."
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
    resource: "https://supabase.com/docs/guides/platform/backups"
    title: "Supabase — 백업과 무료 플랜 운영 조건"
  - id: "official-2"
    resource: "https://supabase.com/pricing"
    title: "Supabase — 백업과 무료 플랜 운영 조건"
source_id: "SRC-027"
resource: "https://supabase.com/docs/guides/platform/backups"
review_scope: "공식 백업 안내·현재 무료 플랜 중단 조건 확인; 결제·백업 복구 시험 미수행"
retrieved_at: "2026-10-03T20:17:12+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Supabase — 백업과 무료 플랜 운영 조건

## 출처와 확인 범위

- ID: SRC-027
- 유형: 각 프로젝트의 공식 기술·운영 문서
- 확인일: 2026-10-03
- 읽은 범위: **공식 백업 안내·현재 무료 플랜 중단 조건 확인; 결제·백업 복구 시험 미수행**
- [공식 자료 1](https://supabase.com/docs/guides/platform/backups) · [공식 자료 2](https://supabase.com/pricing)

## 짧은 요약

공식 안내는 무료 플랜에서 정기적인 데이터 내보내기와 외부 백업을 권장한다. 가격 페이지에는 무료 프로젝트가 1주 비활성 후 일시 중단된다고 명시한다.

## 한계와 추가 검토

플랜·용량·백업 보관 조건은 선택 시 재확인한다. DB 백업에 파일 저장소의 실제 파일이 포함된다고 가정하지 않는다.

## 제품 적용 판단

작은 파일럿에서 무료 플랜을 검토할 수 있으나 서버 동기화와 별개로 JSON 내보내기·운영 백업·복원 검증을 유지한다. 공식 기능과 앱의 구현 제안을 구분한다.

## Related

[언어·개인 데이터 저장](../product/technology-data-storage.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-pwa-stack-research.json)
