---
type: "Decision Register"
title: "결정과 제안 기록"
description: "사용자 명시 요구와 아직 승인하지 않은 제안을 구분한다."
tags:
  - "decision"
  - "product"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-03T20:17:12+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-03-001.md"
    title: "최초 요구"
  - id: "personal-scope"
    resource: "../../raw/conversations/2026-10-03-002.md"
    title: "iOS와 개인 사용 범위"
  - id: "pwa-choice"
    resource: "../../raw/conversations/2026-10-03-003.md"
    title: "PWA 선택과 질문"
---

# 결정과 제안 기록

| ID | 내용 | 상태 | 근거 |
|---|---|---|---|
| DEC-001 | vault·MD·OKF·옵시디언 | 사용자 요구 확정 | CONV-0001 |
| DEC-002 | 운동·시각·루틴·기록·티어·리포트 | 사용자 요구 확정 | CONV-0001 |
| DEC-003 | 식단·열량·영양 리포트 확장 | 사용자 요구 확정 | CONV-0001 |
| DEC-004 | 대화에 따른 기획 수정과 이력 | 사용자 요구 확정 | CONV-0001 |
| DEC-005 | OKF v0.2·상대 Markdown 링크 | 작성 방식 채택 | 공식 규격·작성자의 선택 |
| DEC-006 | 건강한 성인 초보~중급·근비대 우선 | 개인 경험・목표는 기획 제안 유지 | 사용자 규모는 DEC-010으로 구체화 |
| DEC-007 | 운동 MVP 후 식단 출시 | 기획 제안 | 단계화 제안 |
| DEC-008 | 적합도 티어와 근거 확실성 분리 | 기획 제안 | 근거 범위/개인화 해석 |
| DEC-009 | 결정적 계산/규칙 + AI 설명 | 기술 방향 제안 | 재현성/일관성 |
| DEC-010 | 첫 사용자는 본인 1명, 추후 주변 지인에게 직접 제공 | 사용자 범위 확정 | CONV-0002; DEC-006의 불특정 타깃 모집 가정 대체 |
| DEC-011 | 모바일에서 쉽게 사용, iPhone/iOS 우선 | 사용자 방향 확정 | CONV-0002; PWA/네이티브 선택을 뜻하지 않음 |
| DEC-012 | 홈 화면 PWA로 시작, 필요시 네이티브 재평가 | 당시 기획 제안; PWA 채택은 DEC-015 | CONV-0002의 의견, 채택 관계 보존 |
| DEC-013 | 개인 사용성·보존·운영비부터 검증, 구독/성장 검증은 후순위 | 기획 제안 | DEC-010에 따른 우선순위 조정; 상용화 취소 결정 아님 |
| DEC-014 | 첫 버전 백업/복원, 서버 사용 시 개인 기록 접근 분리 | 설계 제안 | PWA 저장 보존 한계와 지인 사용 조건 |
| DEC-015 | PWA로 진행 | 사용자 선택 확정 | CONV-0003; DEC-012의 PWA 제안 채택 |
| DEC-016 | TypeScript·React/Vite·Dexie와 SQL 구성 | 기술 제안·채택 미확정 | 언어·저장 역할에 따른 판단 |
| DEC-017 | 실사용부터 기기 저장 + Supabase 계정 DB 동기화 + 독립 백업 | 기술 제안·채택 미확정 | 기록 누적·기기 변경 복구를 고려; DEC-014 구체화 |
| DEC-018 | 계정별 소유자 정책·전송 대기·중복/충돌 계약을 별도 검증 | 설계 제안 | 서버 동기화와 접근 제한이 자동 완성되지 않음 |

요구 확정은 기능 의도를 직접 표현했다는 뜻이며 상세 설계 승인이 아니다. 변경 시 기존 결론을 조용히 교체하지 않고 새 결정·대체 관계·이유를 기록한다.

이번 판단: [iOS 설치·배포](../product/platform-distribution.md) · [CONV-0002](../conversations/2026-10-03-002.md) · [CHG-0002](../../history/changes/CHG-0002.md).

[언어·저장 의견](../product/technology-data-storage.md) · [CONV-0003](../conversations/2026-10-03-003.md) · [CHG-0003](../../history/changes/CHG-0003.md).

## Related

[원문](../../raw/conversations/2026-10-03-001.md) · [대화](../conversations/2026-10-03-001.md) · [PRD](../product/prd.md) · [미결](../product/open-questions.md)
