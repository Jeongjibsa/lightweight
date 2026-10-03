---
type: "Reference"
title: "Dexie — IndexedDB 로컬 데이터 관리"
description: "Dexie.js는 브라우저 IndexedDB를 다루는 JavaScript 라이브러리다."
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
    resource: "https://dexie.org/docs"
    title: "Dexie — IndexedDB 로컬 데이터 관리"
source_id: "SRC-024"
resource: "https://dexie.org/docs"
review_scope: "공식 문서 소개의 IndexedDB 래퍼·API 안내 확인; 트랜잭션·마이그레이션 구현 미수행"
retrieved_at: "2026-10-03T20:17:12+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# Dexie — IndexedDB 로컬 데이터 관리

## 출처와 확인 범위

- ID: SRC-024
- 유형: 각 프로젝트의 공식 기술·운영 문서
- 확인일: 2026-10-03
- 읽은 범위: **공식 문서 소개의 IndexedDB 래퍼·API 안내 확인; 트랜잭션·마이그레이션 구현 미수행**
- [공식 자료 1](https://dexie.org/docs)

## 짧은 요약

Dexie.js는 브라우저 IndexedDB를 다루는 JavaScript 라이브러리다.

## 한계와 추가 검토

일반 Dexie 사용은 Supabase 자동 동기화를 제공한다는 뜻이 아니다. 로컬 저장 보존은 브라우저 정책의 영향을 받는다.

## 제품 적용 판단

세트 기록·루틴·전송 대기 목록을 기기에 저장하는 후보로 추천한다. 클라우드 전송과 충돌 처리 계약은 앱에 별도로 둔다. 공식 기능과 앱의 구현 제안을 구분한다.

## Related

[언어·개인 데이터 저장](../product/technology-data-storage.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-pwa-stack-research.json)
