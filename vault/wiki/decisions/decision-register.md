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
  at: "2026-10-05T10:16:15+09:00"
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
  - id: "stack-agreement"
    resource: "../../raw/conversations/2026-10-03-004.md"
    title: "스택 동의와 배포·보안 의견 요청"
  - id: "implementation-request"
    resource: "../../raw/conversations/2026-10-03-005.md"
    title: "계획 요청과 운동 우선 선택"
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "harness-request"
    resource: "../../raw/conversations/2026-10-04-007.md"
    title: "CONV-0007 원문"
  - id: "quality-loop"
    resource: "../operations/loop-engineering.md"
    title: "루프 운영 제안"
  - id: "ui-cloud-request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "요구/승인"
  - id: "volume-request"
    resource: "../../raw/conversations/2026-10-04-009.md"
    title: "요구"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
  - id: "tone-request"
    resource: "../conversations/2026-10-04-011.md"
    title: "대화/변경"
  - id: "component-request"
    resource: "../conversations/2026-10-04-012.md"
    title: "대화"
  - id: "validator-human-approval"
    resource: "../../raw/conversations/2026-10-05-024.md"
    title: "검증 함수 SQL 승인과 재개"
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
| DEC-007 | 운동 MVP 후 식단 출시 | 당시 기획 제안; 사용자 선택 DEC-024 | 단계화 제안의 채택 관계 |
| DEC-008 | 적합도 티어와 근거 확실성 분리 | 기획 제안 | 근거 범위/개인화 해석 |
| DEC-009 | 결정적 계산/규칙 + AI 설명 | 기술 방향 제안 | 재현성/일관성 |
| DEC-010 | 첫 사용자는 본인 1명, 추후 주변 지인에게 직접 제공 | 사용자 범위 확정 | CONV-0002; DEC-006의 불특정 타깃 모집 가정 대체 |
| DEC-011 | 모바일에서 쉽게 사용, iPhone/iOS 우선 | 사용자 방향 확정 | CONV-0002; PWA/네이티브 선택을 뜻하지 않음 |
| DEC-012 | 홈 화면 PWA로 시작, 필요시 네이티브 재평가 | 당시 기획 제안; PWA 채택은 DEC-015 | CONV-0002의 의견, 채택 관계 보존 |
| DEC-013 | 개인 사용성·보존·운영비부터 검증, 구독/성장 검증은 후순위 | 기획 제안 | DEC-010에 따른 우선순위 조정; 상용화 취소 결정 아님 |
| DEC-014 | 첫 버전 백업/복원, 서버 사용 시 개인 기록 접근 분리 | 설계 제안 | PWA 저장 보존 한계와 지인 사용 조건 |
| DEC-015 | PWA로 진행 | 사용자 선택 확정 | CONV-0003; DEC-012의 PWA 제안 채택 |
| DEC-016 | TypeScript·React/Vite·Dexie와 SQL 구성 | 당시 기술 제안, 스택 방향 채택 DEC-019 | CONV-0003의 의견 |
| DEC-017 | 실사용부터 기기 저장 + Supabase 계정 DB 동기화 + 독립 백업 | 스택 방향 동의 DEC-019, 상세 계약은 제안 | CONV-0003의 의견·DEC-014 구체화 |
| DEC-018 | 계정별 소유자 정책·전송 대기·중복/충돌 계약을 별도 검증 | 설계 제안 | 서버 동기화와 접근 제한이 자동 완성되지 않음 |
| DEC-019 | 제안한 TypeScript·React/Vite·Dexie·Supabase 스택 방향 채택 | 사용자 동의 확인 | CONV-0004; DEC-016/017 기본 구성 동의, 배포 설정·비용은 미정 |
| DEC-020 | Cloudflare Pages + Supabase, 고정 HTTPS 주소·개발/운영 분리 | 배포 제안 | 현재 정적 PWA·운영 규모에 따른 판단 |
| DEC-021 | 본인·초대 계정, 가입/익명 제한·DB/함수 권한 직접 시험 | 보안 설계 제안 | 공개 웹 우려에 따른 요구 구체화 |
| DEC-022 | preview 접근 제한, 운영 사이트 전체 Access는 선택 | 보안·사용성 제안 | API 권한과 사이트 앞단 접근 범위 구분 |
| DEC-023 | 구현 작업계획 문서 작성 | 사용자 요청 확인 | CONV-0005; 실제 구현 착수 요청으로 확대하지 않음 |
| DEC-024 | 운동 기능 먼저 완성, 식단은 다음 출시 | 사용자 선택 확정 | 비동기 범위 질문 답변; DEC-007 채택, 식단 요구 유지 |
| DEC-025 | 기록/백업→계정/동기화→계산→검토 추천/티어→검증/제공 순서 | 구현 제안 | 계획/백로그·중간 산출물/실사용 관문 구분 |
| DEC-026 | 초기 템플릿 설명·입력/계산/브라우저 도구·공수 가설 | 구현 제안 | 기존 DEC-009 구체화; AI 설명 후속, 효과/검토 승인 아님 |
| DEC-027 | iPhone 16 Pro Max/iOS 27.0.1·골격근량 증대·주3~4회·무분할~3분할 | 사용자 조건 보고 확인 | CONV-0005; 경험/종목/장비/시간·실제 동작은 미결/미검증 |

| DEC-028 | 특정 iPhone에 제한하지 않는 반응형·사용자별 목표/횟수/분할 설정 | 사용자 요구 확정 | CONV-0006; DEC-027은 한 파일럿 표본으로 유지 |
| DEC-029 | 계획을 반영한 순차 구현 착수, Supabase 프로젝트 없이 로컬부터 진행 | 사용자 요청/선택 확정 | CONV-0006; DEC-023 계획 요청 이후 구현 승인, DEC-019 스택 유지 |
| DEC-030 | 로컬 UUID 프로필·스냅샷·전체 교체 백업·초안 분류 요약 | 현재 로컬 구현 계약 | 계정 인증/원격 동기화·과학 추천 승인이 아님; 후속 계약 별도 |

| DEC-031 | 남은 작업 정리·현재 harness/unit-integration 설명과 문서화·루프 개선 방법 탐색 | 사용자 요청 확인 | CONV-0007; 현재/향후 검증 구분 |
| DEC-032 | 단위/통합 분리→DOM/browser 회귀→실패 주입/CI 증거·독립 기대값의 반복 개선 | 상세 운영 제안 | HAR-01~06, QA-01; 자동 서비스/배포 구축이나 과학 검토 완료 아님 |

| DEC-033 | Mantine UI·Spoqa Han Sans Neo·현재 스택/라이브러리 문서 | 사용자 요구 확인/적용 | CONV-0008, UI-01/FR-12 |
| DEC-034 | registered password Auth·계정 DB·허용 목록·manual snapshot/CAS/recovery | 초기 구현 정책 | 연결 증분으로 선택; 사용자 최종 로그인/동기화 선택 아님 |
| DEC-035 | Supabase 공개 가입 차단 | 사용자 명시 승인/적용 | CONV-0008 후속 답변, Dashboard 저장·Auth API 확인 |

| DEC-036 | 현재/향후 작업 단위 git-commit skill local commit | 사용자 지속 요청 | CONV-0009; push/이력 재작성은 확대하지 않음 |
| DEC-037 | 운동별/일별 볼륨·그래프·과거 기록 기반 오늘/권장량 | 사용자 기능 요구 | FR-14/15, REP-04~06/SCI-03B |
| DEC-038 | 기록량 비교 경계와 오늘 루틴 참고→검토된 조정 단계 | 초기 구현 정책 | 성장/회복 점수·자동 증량 없음; 상세 사용자 승인 아님 |

| DEC-039 | 전체 Mantine·Geist·블루/다크·iOS 같은 UX·전 폭 하단 메뉴·클릭 감소/접근성 | 사용자 명시 요구 | CONV-0010, FR-12·16; Spoqa/사이드 메뉴 supersede |
| DEC-040 | 별도 branch에서 UI 구현 | 사용자 명시 요구 | codex/mantine-blue-dark; local commit 지속 지침 |
| DEC-041 | token/44px·16px/48em sheet·한글 fallback/수동 iframe harness | 구현 선택 | native 전환·실기기/전체 접근성 인증·최종 디자인 승인 아님 |
| DEC-042 | 블루/다크를 Monokai 또는 Mantine UI 같은 톤으로 변경 | 사용자 명시 요구 CONV-0011 | DEC-039의 색상 방향 대체; Geist/하단 UX 이어감 |
| DEC-043 | 배경#1f1f1f·카드#242424·노란#ffd43b·filled 어두운 전경 | 구현 선택 | Mantine 다크 관찰 참고; 정확한 Monokai 복제·구체 토큰 사용자 승인 아님 |

요구 확정은 기능 의도를 직접 표현했다는 뜻이며 상세 설계 승인이 아니다. 변경 시 기존 결론을 조용히 교체하지 않고 새 결정·대체 관계·이유를 기록한다.

이번 판단: [iOS 설치·배포](../product/platform-distribution.md) · [CONV-0002](../conversations/2026-10-03-002.md) · [CHG-0002](../../history/changes/CHG-0002.md).

[언어·저장 의견](../product/technology-data-storage.md) · [CONV-0003](../conversations/2026-10-03-003.md) · [CHG-0003](../../history/changes/CHG-0003.md).

[배포·보안](../product/deployment-security.md) · [CONV-0004](../conversations/2026-10-03-004.md) · [CHG-0004](../../history/changes/CHG-0004.md).

[구현 계획/백로그](../product/implementation-plan.md) · [CONV-0005](../conversations/2026-10-03-005.md) · [CHG-0005](../../history/changes/CHG-0005.md).

## Related

[원문](../../raw/conversations/2026-10-03-001.md) · [대화](../conversations/2026-10-03-001.md) · [PRD](../product/prd.md) · [미결](../product/open-questions.md)

## CONV-0012 결정/제안

- DEC-044 / 사용자 명시: 실제 페이지 캡처로 Mantine 선택/접기·여백/outline 전반 재점검. UI-03으로 기존 UI-02의 불만을 후속 추적한다.
- DEC-045 / 사용자 명시: 운동별3D 해부학/자극부위 애니메이션을 추가하되 지금은 검토만/후순위.
- DEC-046 / 구현·계획 제안: default Accordion/16px·filled Select/Paper/Drawer 일관성, FR-17 P2/VIS-3D-02~03 asset/검토·실기기 관문. 구체 renderer·budget·토큰 사용자 승인 아님.

## CONV-0024

사용자 명시 승인: 직전 제시된 운영 `training_private.valid_snapshot` SQL 적용과 보류 작업 재개. 적용은 동일 MCP 경로로 완료했고 계정/RLS/Google 등 다른 외부 설정 승인으로 확대하지 않는다. [원문](../../raw/conversations/2026-10-05-024.md) · [서버 검사](../../raw/research/2026-10-05-cloud-validator-approved.json).
