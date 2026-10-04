---
type: "Remaining Work"
title: "현재 구현에서 운동 MVP까지 남은 작업"
description: "구현/검증/미완료를 구분하고 하네스부터 데이터·개인화·근거·실사용까지 순서를 정리한다."
tags:
  - "product"
  - "implementation"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T21:55:54+09:00"
sources:
  - id: "cf-recheck"
    resource: "../../raw/research/2026-10-04-cloudflare-setup-recheck.json"
    title: "Cloudflare 공식 설정과 OAuth 재확인"
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-007.md"
    title: "CONV-0007 원문"
  - id: "progress"
    resource: "implementation-progress.md"
    title: "현재 증분"
  - id: "backlog"
    resource: "implementation-backlog.md"
    title: "세부 작업/의존성"
  - id: "harness"
    resource: "../operations/testing-harness.md"
    title: "검증 개선"
  - id: "cloud-request"
    resource: "../../raw/conversations/2026-10-04-008.md"
    title: "이번 요구"
  - id: "cloud"
    resource: "supabase-integration.md"
    title: "현재 연결"
  - id: "volume-mvp"
    resource: "volume-history-mvp.md"
    title: "추가 범위"
  - id: "volume-check"
    resource: "../../raw/research/2026-10-04-volume-history-verification.json"
    title: "볼륨/후보 구현 검사"
  - id: "settings-loop"
    resource: "../../raw/research/2026-10-04-settings-restore-loop.json"
    title: "복원 입력 회귀/수정"
  - id: "design-request"
    resource: "../../raw/conversations/2026-10-04-010.md"
    title: "전체 Mantine/Geist/하단 UX 요구"
  - id: "tone-request"
    resource: "../../raw/conversations/2026-10-04-011.md"
    title: "Monokai/Mantine 톤 변경 요구"
  - id: "tone-verification"
    resource: "../../raw/research/2026-10-04-charcoal-theme-verification.json"
    title: "차콜 증분 실행"
  - id: "component-request"
    resource: "../../raw/conversations/2026-10-04-012.md"
    title: "컴포넌트 재점검/3D 요구"
  - id: "component-check"
    resource: "../../raw/research/2026-10-04-component-review.json"
    title: "실제 페이지별 관찰"
  - id: "profile-backup-loop"
    resource: "../../raw/research/2026-10-04-profile-backup-dom-loop.json"
    title: "HAR-02 최초 실패·실제 수정·59개 검사"
  - id: "e2e-request"
    resource: "../../raw/conversations/2026-10-04-013.md"
    title: "다음 순차 구현 요청"
  - id: "e2e-run"
    resource: "../../raw/research/2026-10-04-e2e-harness-verification.json"
    title: "9과업·27반복·최초 실패 증거"
  - id: "storage-request"
    resource: "../../raw/conversations/2026-10-04-014.md"
    title: "순차 요청"
  - id: "storage-run"
    resource: "../../raw/research/2026-10-04-storage-recovery-verification.json"
    title: "저장 보존 검사"
  - id: "ci-receipt"
    resource: "../../raw/research/2026-10-04-github-ci-37184261544.json"
    title: "GitHub CI 증거"
  - id: "cf-request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "Cloudflare 요청"
  - id: "cf-setup"
    resource: "../operations/cloudflare-setup.md"
    title: "연결 운영"
  - id: "gzip"
    resource: "../operations/compressed-backup.md"
    title: "압축 복구 계약"
  - id: "gzip-check"
    resource: "../../raw/research/2026-10-04-compressed-backup-verification.json"
    title: "실행"
  - id: "record-reuse"
    resource: "../operations/record-reuse.md"
    title: "재사용 계약"
  - id: "record-check"
    resource: "../../raw/research/2026-10-04-record-reuse-verification.json"
    title: "실행"
  - id: "pages-scope"
    resource: "../../raw/research/2026-10-04-pages-scoped-auth.json"
    title: "Pages 연결 확인"
  - id: "coverage"
    resource: "../operations/report-coverage.md"
    title: "기록 점검 계약"
  - id: "coverage-check"
    resource: "../../raw/research/2026-10-04-report-coverage-verification.json"
    title: "실행"
  - id: "email-complete"
    resource: "../../raw/conversations/2026-10-04-017.md"
    title: "사용자 이메일 인증 완료"
  - id: "deployment-check"
    resource: "../../raw/research/2026-10-04-pages-deployment.json"
    title: "실제 HTTPS 배포"
  - id: "redirect"
    resource: "../sources/SRC-047-auth-production-origin.md"
    title: "Auth 반환 주소"
  - id: "publication"
    resource: "../operations/content-publication.md"
    title: "공개 계약"
  - id: "publication-check"
    resource: "../../raw/research/2026-10-04-content-publication-gate.json"
    title: "검사"
  - id: "account-progress"
    resource: "../../raw/conversations/2026-10-04-018.md"
    title: "직접 등록 의사"
  - id: "final-release"
    resource: "../../raw/research/2026-10-04-release-account-gate.json"
    title: "최종 배포/권한 관문"
  - id: "account-approved"
    resource: "../../raw/conversations/2026-10-04-019.md"
    title: "지정 계정 SQL 승인·로그인"
  - id: "real-profile-roundtrip"
    resource: "../../raw/research/2026-10-04-auth-profile-roundtrip.json"
    title: "실제 빈 프로필 저장/조회/적용"
  - id: "workout-order-check"
    resource: "../../raw/research/2026-10-04-workout-order-loop.json"
    title: "종목 순서/가림 개선 확인"
  - id: "workout-order"
    resource: "../operations/workout-order.md"
    title: "기록 보존 계약"
version: "0.3.5"
approval_status: "proposal"
change_id: "CHG-0024"
---

# 남은 작업 한눈에 보기

2026-10-04 / PRD0.8.9. 운동 기능 우선, 식단·3D는 후순위다. **운동 MVP 전체는 아직 완료하지 않았다.** 완료한 부분과 사용자/검토자가 필요한 관문을 구별한다.

운영: [앱 열기](https://lightweight-training.pages.dev) · [운영 DB 연결 없는 preview](https://preview.lightweight-training.pages.dev) · [세부 백로그](implementation-backlog.md).

| 순서 | 남은 작업 | 현재 완료한 부분 | 완료에 필요한 것 | ID |
|---|---|---|---|---|
| 1 | 실제 운동 기록·새 기기 로그인/동기화 | Auth/허용 목록/RLS·수동 snapshot/CAS·공개 가입OFF·반환 주소 저장 | 지정 계정 허용·실제 Chrome 빈 프로필 저장/조회/적용 완료; 실제 운동 기록/새 저장소 복원·로그아웃 검증 필요 | SYNC02/05, HAR02/06 |
| 2 | 다기기 편집·충돌/실패 복구 | manual CAS/retry/ACK·교체 전 백업 | A/B·만료/권한 회수/응답 유실·서로 다른 편집 명시 해결·삭제 재등장 방지·크기 정책 | SYNC03~05 |
| 3 | 기록 편의 완성 | 이전값·재시작·미완료 종목 교체·종료 수정·운동 순서/CAS | 메모·삭제 복구·머신/ROM 비교 조건·운동 중 입력 UX | LOG03~06 |
| 4 | 설명 가능한 개인화 완성 | 볼륨/추이·기록 참고 후보·주간 입력 점검/직접 수정 | 검토된 직접/간접 매핑·저장 report/입력·정책·근거 버전·근거 기반 다음 행동 | REP01~06, SCI03B |
| 5 | 근거 운동 정보·시각·티어·추천 | 기록용12종목·초기 연구/3D 검토·공개 JSON gate(승인0개) | 등록부 실제 승인/규칙 연결·전문/전문가/권리 검토→설명/시각→조건 추천/티어, 승인 콘텐츠만 제공 | SCI01~04, PRE01, LOG02 |
| 6 | 실제 iPhone/PWA·접근성/보존 | 반응형/Mantine·두 브라우저22과업·업데이트/백업/gzip 보존 | 홈 화면 설치·키보드/VoiceOver/확대/가로/잠금·실제offline/update·physical quota/eviction·64MiB초과 분할복구 | RESP01, REL02, HAR04 |
| 7 | 운영·배포/복구 마무리 | Pages HTTPS·운영/preview DB 분리·23file hash/헤더·main push | 실Auth/메일/비밀번호복구·백업 drill·승인 credential 기반 CI자동배포·도메인/Access 선택 | REL01/03, Q08/16/17 |
| 8 | 본인 파일럿→지인 제공 | 앱/검사 기반 준비 | 실제4주 관찰/입력누락·오해 개선→회귀, 계정 독립/복원·G3/G4 관문 | PIL01/02 |
| 후순위 | 식단/영양·3D·선택 AI 설명 | 요구/3D feasibility 문서 | 음식DB/license·기록/계산·검토 공식/결측, 3Dasset/rig/clip/권한/전문검토/실기기성능 | NUT01~04, VIS3D02/03, AI01 |

공개 설명 gate를 준비했고 다음 독립 구현은 LOG03/04 남은 입력 편의다. 실제 콘텐츠/UI·추천 규칙은 검토 후 진행한다. 실제 과학 검토/사용자 기기/파일럿을 자동검사로 대신 완료하지 않는다. 최신 Auth는 등록1개/허용1개다. 지정 계정 SQL 허용 승인 후 실제 Chrome 빈 프로필의 전송/조회/명시 적용을 확인했다. 실제 운동/새 기기 검증과 구별한다. 비밀번호·개인 기록·credential은 대화/vault/공개 bundle에 보관하지 않는다.

최신 확인:83개 Vitest·Node계약8개(배포3/공개5)·browser22·vault 검증; 이전 운영96bbb74 GitHub3job success. lint exit0/기존 effect경고6개는 남는다. 최신25개 정적 파일 gate와 원격 공개24파일 비교를 구별한다. URL 설정만으로 login/복구/메일 통과를 주장하지 않는다. [진행](implementation-progress.md)·[하네스](../operations/testing-harness.md)·[배포 실행](../../raw/research/2026-10-04-pages-deployment.json).

[공개 설명 계약](../operations/content-publication.md). 현재 관문은 구조/내용 동일성 검사이며 실제 전문/권리 검토를 증명하지 않는다. 새 공개 gate96bbb74 CI3job·운영/preview24file 일치 확인을 완료했다.

[최신 배포·계정 관문](../../raw/research/2026-10-04-release-account-gate.json). 이 당시 pending은 CHG0023의 명시 승인으로 해소됐다. [실제 Auth 확인](../../raw/research/2026-10-04-auth-profile-roundtrip.json).

[최신 순서/실화면 개선](../operations/workout-order.md). 다음 독립 단위는 메모/삭제 복구 등 기록 편의이며 실제 운동/다기기 Auth 검증도 남는다.
