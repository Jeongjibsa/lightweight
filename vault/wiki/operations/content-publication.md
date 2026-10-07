---
type: "Data Contract"
title: "검토된 운동 설명의 공개 빌드 관문"
description: "검토 선언/내용·파일 identity 검증과 과학 검토의 차이."
tags:
  - "content"
  - "evidence"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-08T00:56:29+09:00"
sources:
  - id: "policy"
    resource: "evidence-policy.md"
    title: "근거 운영"
  - id: "check"
    resource: "../../raw/research/2026-10-04-content-publication-gate.json"
    title: "검사"
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "순차 요청"
  - id: "unit-chg-0044"
    resource: "../../raw/conversations/2026-10-08-027.md"
    title: "SCI 우선: 검토 설명 소비/가슴 연구 검토"
---

# 운동 설명 공개 빌드 관문

SCI02의 등록부/빌드 부분을 준비했다. 현재 실제 승인 설명은 **0개**이며 기존12종목은 기록용 catalog_draft다. 검토자를 대신해 승인하거나 건강 주장을 추가하지 않았다.

app/content/review-registry.json → content:compile → public/content/exercise-guides.json → Vite dist. 일반 build/check/CI에서 먼저 실행된다. vault 원문이나 review 메타데이터를 통째로 복사하지 않고 선택된 공개 payload만 출력한다. 생성 JSON은 Git에서 제외하며 source registry와 compiler를 관리한다.

| 검사 | 처리 |
|---|---|
| 초안/보류 | 공개 출력에서 제외 |
| 승인 | human/전문 분야·검토일·reviewRef·payload SHA256 필요; 수정하면 재승인 receipt 필요 |
| 주장 | science/생체역학 추론/사용자 적합도를 구별하고 한계/출처 ID 필수 |
| 근거 | URL은 credential 없는 HTTPS, source/claim/exercise ID 일관성, 참조 근거의 full_review 선언 필수 |
| 시각 권리 | unknown 권리는 거부, 공개 asset 경로/attribution/rightsRef·검토 파일 SHA256 필요 |
| 실제 파일 | 파일 존재/hash 일치·public 밖 symlink를 읽기 전에 거부 |
| 출력 | 공개 문구/근거·권리 정보와 reviewVersion만; reviewer identity/초안 제외 |

**이 검사는 선언 형식과 내용 동일성을 확인한다.** 사람/전문 자격·실제 전문 읽기·과학적 정확성·권리 허가의 사실을 증명하지 않는다. 검토 기록 존재/URL 도달성·업무상의 실제 승인은 별도 확인하며 승인 receipt를 agent가 human이라고 꾸며 만들지 않는다. 현재 승인 항목은0개다. 실제 설명/시각 UI·근육 매핑·추천 규칙 registry/티어·offline JSON 소비는 후속이다.

78개 Vitest와 Node8계약(배포3/새 공개5), build/format/E2E타입·artifact25 통과. lint는exit0/기존 effect경고6개다. 과학/권리·실Auth/iPhone 검토로 해석하지 않는다. [불변 실행](../../raw/research/2026-10-04-content-publication-gate.json)·[근거 운영 정책](evidence-policy.md)·[남은 작업](../product/remaining-work.md).

후속 보강: public/content/assets의 승인 manifest에 없는 파일도 거부한다. assets/output 디렉터리 자체가 public 밖을 가리키면 출력하지 않는다. [최종 보강 검사](../../raw/research/2026-10-04-content-publication-final.json). 기존 최초 검사는 덮어쓰지 않았다.

## SCI 검토 설명 소비와 가슴 연구 패킷 — 2026-10-08

검토 설명 JSON을 운동 정보 창에서 읽고 주장 종류/한계/원문/버전을 함께 표시한다. 엄격한 형식/출처 연결·실패/재시도/종목 전환 보존과 공개 JSON의 실제 SW offline을 검증했다.122Vitest/Node10/40browser·build/types/format/artifact25 통과(기존6경고). [소비 계약/화면](../operations/reviewed-guide-consumption.md).

[가슴 조건 검토 패킷](../product/chest-evidence-review.md)과 [SRC054](../sources/SRC-054-bench-angle-training.md)를 추가했다. 주 연구의 Methods/Results/Discussion을 에이전트가 읽었으며 장비/대상/측정 조건·비교 공백을 구분한다. 기존ACSM2026 전문 접근은 미완료로 남겼다. **실제 인간 승인 설명0개·근육 매핑/수행 시각/추천 규칙/조건 티어는 미완료**다. 합성 fixture를 실제승인으로 등록하지 않는다. 실기기/Auth·식단/3D/파일럿 관문은 유지하며 추가 논문/해부학·권리 검토와 인간 검토 결과가 다음 SCI 선행 조건이다.
