---
type: "Open Questions"
title: "미결 사항과 다음 대화"
description: "질문·임시 가정·영향 문서를 관리한다."
tags:
  - "product"
  - "conversation"
  - "decision"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T02:02:14+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-03-002.md"
    title: "CONV-0002"
  - id: "pwa-choice"
    resource: "../../raw/conversations/2026-10-03-003.md"
    title: "PWA 선택"
  - id: "stack-agreement"
    resource: "../../raw/conversations/2026-10-03-004.md"
    title: "스택 동의와 배포·보안 의견 요청"
  - id: "deployment"
    resource: "deployment-security.md"
    title: "배포·보안 추천"
  - id: "implementation-request"
    resource: "../../raw/conversations/2026-10-03-005.md"
    title: "계획 요청과 운동 우선 선택"
  - id: "implementation-plan"
    resource: "implementation-plan.md"
    title: "단계별 작업계획"
  - id: "responsive-local-request"
    resource: "../../raw/conversations/2026-10-03-006.md"
    title: "반응형·사용자별 설정·로컬 구현 요청"
  - id: "local-progress"
    resource: "implementation-progress.md"
    title: "실행 결과와 남은 작업"
  - id: "harness-request"
    resource: "../../raw/conversations/2026-10-04-007.md"
    title: "하네스/루프 요청"
  - id: "ui-cloud-request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "요구/가입 차단 승인"
---

# 미결 사항과 다음 대화

| ID | 질문 | 현재 제안 | 상태 |
|---|---|---|---|
| Q-01 | 본인의 운동 경험·현재 루틴·장비는? | 주3~4회·무분할~3분할, 경험/종목/장비/시간 미결 | 일정/분할 보고 CONV-0005·부분 확인 |
| Q-02 | 근비대·근력·건강 중 우선? | 골격근량 증대 목표 | 사용자 보고 확인 CONV-0005 |
| Q-03 | 플랫폼과 구현 방식은? | 모바일·iPhone/iOS 우선, PWA 진행 | 확정 CONV-0003 |
| Q-04 | 식단을 첫 출시부터? | 운동 기능 먼저 완성, 식단은 다음 출시 | 사용자 선택 확정 CONV-0005 |
| Q-05 | 추천/자유 기록 비중? | 두 경로, 기록 우선 진입 | 미확정 |
| Q-06 | 연구·해부학·영양 검토 인력/예산? | 역할 필요 | 미확정 |
| Q-07 | S/A/B/C 이해를 돕는 방식? | 적합도 + 근거 배지 | 검증 필요 |
| Q-08 | 개인 도구의 운영비 허용 범위는? | 구독 검증은 후순위 제안; 호스팅·AI·필요시 개발자 등록비 비교 | 예산 미결 |
| Q-09 | 백업·동기화·계정은? | 기기+Supabase 방향 합의, 독립 백업 유지 | 동기화·백업·계정 상세 미결 |
| Q-10 | 2D·영상·3D 중 먼저? | 2D와 짧은 동작 자료 | 미확정 |
| Q-11 | 건강 앱·Apple Watch 연동은 처음부터 필요한가? | 필수이면 네이티브부터 검토; 우선순위는 사용자 선택 | 미확정 |
| Q-12 | 실제 iPhone 모델·iOS 버전은? | 보고된 기기는 하나의 파일럿 표본, 반응형 확장 요구 | CONV-0006 특정 기종 한정 해제; 실제 기기/지원 하한 미검증 |
| Q-13 | TypeScript·React/Vite·Dexie를 사용할까? | 기본 스택 방향 합의 | 동의 확인 CONV-0004 |
| Q-14 | Supabase 계정 DB를 사용할까? | 프로젝트 제공/연결 완료 증분 | CONV-0008 Auth/DB/RPC 적용; 실계정 검증/배포 남음 |
| Q-15 | 로그인·초대·여러 기기 동시 사용 범위는? | 공개 가입 차단 승인/적용, 익명OFF, 등록계정 password 초기 구현 | 본인 계정 등록/허용 목록·실제 login/복원·최종 로그인/복구/SMTP·다기기 해결 남음 |
| Q-16 | 호스팅과 고정 운영 도메인은? | Cloudflare Pages + Supabase, 고정 HTTPS 주소 | 제공자·도메인 미확정 |
| Q-17 | 사이트 화면도 초대자만 열게 할까? | 기본 로그인/DB 권한 제한, preview Access; 운영 Access는 추가 선택 | 미확정 |

기본 스택과 운동 우선 순서는 합의했고 개인 조건은 하나의 시험 표본이다. 반응형과 각 사용자 설정은 CONV-0006 요구로 확정했다. 로컬부터 진행한 뒤 CONV-0008에서 Supabase를 연결했다. 공개 가입 차단은 명시 승인/적용했다. 로그인/수동 snapshot 상세는 초기 구현 정책이다. [실행 결과](implementation-progress.md). [구현 계획](implementation-plan.md)은 가짜 데이터로 착수한다. 종목/장비/시간/경험은 Q-01, 로그인은 Q-15, 배포는 Q-08/16/17을 필요한 단계 전에 정하고 실제 기기 동작은 REL-02에서 검증한다. 상세 설계는 제안이다. [언어·개인 데이터 저장 의견](technology-data-storage.md)을 먼저 검토한다. PWA 선택 이후 건강 앱·Watch는 별도 범위 질문으로 남긴다. 미응답을 승인으로 간주하지 않는다.

CONV-0007의 현황/하네스 문서화는 추가 결정 없이 진행했다. [남은 작업](remaining-work.md)의 검증 개선을 다음 증분으로 제안한다. 새로운 상세 기준을 사용자 승인으로 표시하지 않고 기존 Q를 필요한 구현 단계에 연결한다.

CONV-0008: Mantine UI·Spoqa Han Sans Neo·실제 스택 명시를 요구로 추가했고 [현재 스택](technology-stack.md)/[계정 준비](supabase-integration.md)를 작성했다. 실제 계정 비밀번호를 대화에 요청하지 않는다.

답변 후 갱신: [PRD](prd.md), 관련 기능, [결정](../decisions/decision-register.md), [변경](../../history/changes/index.md). 질문 ID를 이어서 부여한다.
