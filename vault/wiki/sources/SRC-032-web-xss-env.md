---
type: "Reference"
title: "OWASP·Vite — XSS 예방과 프런트 환경 변수 노출"
description: "OWASP는 출력 맥락에 맞는 처리·HTML 정제를 안내한다. Vite의 VITE_ 변수는 클라이언트 번들에 노출된다."
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
    resource: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
    title: "OWASP·Vite — XSS 예방과 프런트 환경 변수 노출"
  - id: "official-2"
    resource: "https://vite.dev/guide/env-and-mode"
    title: "OWASP·Vite — XSS 예방과 프런트 환경 변수 노출"
source_id: "SRC-032"
resource: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
review_scope: "OWASP 출력 처리·HTML 정제와 Vite VITE_ 번들 노출 본문 확인; 악성 입력/번들 시험 미수행"
retrieved_at: "2026-10-03T20:46:10+09:00"
stale_after: "2027-01-03T00:00:00+09:00"
---

# OWASP·Vite — XSS 예방과 프런트 환경 변수 노출

## 출처와 확인 범위

- ID: SRC-032
- 확인일: 2026-10-03
- 유형: 일차 기술·보안·운영 안내
- 읽은 범위: **OWASP 출력 처리·HTML 정제와 Vite VITE_ 번들 노출 본문 확인; 악성 입력/번들 시험 미수행**
- [공식 자료 1](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) · [공식 자료 2](https://vite.dev/guide/env-and-mode)

## 짧은 요약

OWASP는 출력 맥락에 맞는 처리·HTML 정제를 안내한다. Vite의 VITE_ 변수는 클라이언트 번들에 노출된다.

## 한계와 제품 적용 판단

CSP나 변수 이름만으로 비밀 보호와 XSS 차단이 완성되지는 않는다. 동작·번들·동적 콘텐츠를 검사한다.

메모·AI 설명·연구 콘텐츠의 HTML 처리를 제한하고 서버 비밀을 프런트 번들에 넣지 않는다. 필요 없는 외부 스크립트는 추가하지 않는다. 기술의 기본 동작과 이 프로젝트의 채택 제안을 구분한다.

## Related

[배포·보안 기획](../product/deployment-security.md) · [주장 지도](../concepts/evidence-map.md) · [수집 기록](../../raw/research/2026-10-03-deployment-security-research.json)
