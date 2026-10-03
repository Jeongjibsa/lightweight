# Vault Update Log

## 2026-10-04

- **Harness Implementation**: 계획/지침 `897f44d` 이후 HAR-02 DOM project·실제 WorkoutView/Dexie 과업3개 추가. unit6/integration24/ui3·33개/5파일·lint/build/format 통과. [원본](raw/research/2026-10-04-dom-harness-verification.json)/SRC-038 추가, HAR-02 in_progress. 실제 Auth/backup UI/브라우저 runner·CI/iPhone은 미통과.

- **Commit / Planning**: [CONV-0009](wiki/conversations/2026-10-04-009.md)에 따라 현재 앱/PRD0.4.0 baseline을 `9cccb4f`로 local commit. 이후 [git-commit 운영](wiki/operations/commit-workflow.md)/AGENTS 지속 지침 추가. 볼륨/그래프·과거 오늘/권장량 요구를 FR-14/15·REP-04~06/SCI-03B로 [MVP](wiki/product/volume-history-mvp.md)에 반영. PRD0.5.0·계획/백로그0.4.0, [CHG-0009](history/changes/CHG-0009.md)·[전체 snapshot](history/versions/prd-v0.5.0.md) 보존. SRC-037은 같은 ACSM 원문의 추가 읽기, 새 독립 연구 아님. 현재는 계획 증분이며 기능 구현은 이어서 진행.

- **Implementation / Approval**: [CONV-0008](wiki/conversations/2026-10-04-008.md)의 Mantine UI·Spoqa 글꼴·Supabase 연결을 app0.2.0/schema2에 반영. Auth/계정 DB·수동 snapshot/CAS/idempotency/recovery·서버 private3테이블/권한 적용. 공개 가입 차단은 명시 승인 후 Dashboard 저장·Auth API 확인. [현재 스택](wiki/product/technology-stack.md) · [연결/계정 준비](wiki/product/supabase-integration.md).
- **Verification / Loop**: format/lint/unit6/integration24/strict build, 원격 rollback SQL16·publishable-only RPC401·TLS·Advisor 빈 배열 확인. CUA 가짜 설정·폭/글꼴/모달 관찰 및 초점 유실 재현→수정→재검증. [실행 원본](raw/research/2026-10-04-mantine-supabase-verification.json). SQL claim과 실제 Auth E2E, 폭 시험과 iPhone 통과를 구분. 외부 CI/공개 앱 배포/실계정 등록·메일/커밋/푸시 미수행.
- **Knowledge / History**: PRD0.4.0·계획/백로그0.3.0·HAR-01 done·SYNC/HAR-04/06 일부 in_progress. [CHG-0008](history/changes/CHG-0008.md)·[PRD 전체](history/versions/prd-v0.4.0.md)·SRC-036와 새 원본 보존, 기존 불변 해시 유지. [남은 작업](wiki/product/remaining-work.md)과 [하네스](wiki/operations/testing-harness.md) 갱신.

- **Audit / Verification**: [CONV-0007](wiki/conversations/2026-10-04-007.md)에 따라 현재 unit/fake IndexedDB16개·config/CI를 감사하고 lint/test/strict build 통과를 재확인. 이전 Chromium 관찰과 미구현 E2E/CI browser 회귀를 구분. [실행 원본](raw/research/2026-10-04-harness-audit.json). 큰 백업 제한 비대칭은 미재현 확인 후보. 새 browser/실기기 검사 미수행.
- **Planning / Documentation**: [현재 하네스](wiki/operations/testing-harness.md)·[개선 루프](wiki/operations/loop-engineering.md)·[남은 작업](wiki/product/remaining-work.md)·[검사 기록 양식](templates/verification-record.md) 작성. QA-01/HAR-01~06·DEC-031/032, PRD0.3.1/계획·백로그0.2.1. 현행 문서의 앱 미구현/전부 미시험 잔여 문구 정정.
- **Research / History**: [SRC-035](wiki/sources/SRC-035-testing-harness.md) 추가, 공식 도구의 읽은 범위/버전 차이 기록. [CHG-0007](history/changes/CHG-0007.md)·[PRD0.3.1 전체](history/versions/prd-v0.3.1.md)·사용자/감사 원본 추가, 기존 해시 유지. [문서 검사](history/validation-latest.json)는 과학/제품/보안 완료와 구분. 새 HAR 구현·의존성 설치·프로젝트/배포·커밋/푸시 미수행.

## 2026-10-03

- **Verification**: CHG-0006 저장 이후 별도 Chromium 세션의 빈 IndexedDB에서도 가짜 JSON 복원→설정/루틴/세션/완료2·계획3 리포트를 확인. [추가 검사 원본](raw/research/2026-10-03-browser-restore-verification.json)·[현재 실행 보고](wiki/product/implementation-progress.md) 갱신. PRD0.3.0/기존 불변 이력은 유지.

- **Implementation**: [CONV-0006](wiki/conversations/2026-10-03-006.md)에 따라 반응형·프로필별 설정을 요구로 확정하고 Supabase 프로젝트 없이 로컬부터 구현. app0.1.0의 설정·종목/루틴·기기 기록·기초 집계·백업·PWA 구현과 검사16개/Chromium 폭·오프라인·복원·업데이트 결과를 [실행 보고](wiki/product/implementation-progress.md)에 기록. 계정/검토 콘텐츠/실기기/외부 배포 미완료.
- **Planning**: [PRD0.3.0](wiki/product/prd.md), 계획/백로그0.2.0·FR-10/11·DEC-028~030·미결·영향 상세 갱신. [현재 로컬 계약](wiki/product/implementation-contracts.md) 추가. 개인 기기/조건은 앱 전역 기본값이 아닌 테스트 표본으로 유지.
- **Research / History**: [SRC-034](wiki/sources/SRC-034-responsive-local.md) 추가, 총 출처34개. [CHG-0006](history/changes/CHG-0006.md)·[PRD0.3.0 전체](history/versions/prd-v0.3.0.md)·새 발언/조사 보존, 기존 해시 유지. [문서 검사](history/validation-latest.json)는 앱/과학/운영 완료와 구분. 커밋/푸시·외부 서비스/메시지 발송 미수행.

- **Planning**: [CONV-0005](wiki/conversations/2026-10-03-005.md)의 작업계획 요청·운동 우선 선택과 iPhone 16 Pro Max/iOS 27.0.1·골격근량 증대·주3~4회·무분할~3분할 보고를 [PRD 0.2.3](wiki/product/prd.md)에 반영. [계획 M0~M8/G0~G5](wiki/product/implementation-plan.md)·[백로그](wiki/product/implementation-backlog.md)에 작업/의존성/검증/공수 가정 기록. 식단 요구를 다음 출시로 유지.
- **Research**: [SRC-033](wiki/sources/SRC-033-development-verification.md) 공식 검증 도구 확인, 총 출처 33개. 저장소 public 구성 log/origin과 외부 확인 실패를 [조사 원본](raw/research/2026-10-03-implementation-planning-research.json)에 구분. 실제 도구/앱 시험 미수행.
- **History**: [CHG-0005](history/changes/CHG-0005.md)·[PRD 0.2.3 전체](history/versions/prd-v0.2.3.md)·새 발언/조사 보존. 문서/링크/스냅샷/기존 원본 해시 검사 결과는 [보고서](history/validation-latest.json). 코딩·설치·배포·외부 설정·커밋 미수행.

- **Planning**: [CONV-0004](wiki/conversations/2026-10-03-004.md)의 기본 스택 동의를 [PRD 0.2.2](wiki/product/prd.md)에 반영. [Cloudflare Pages·배포/보안 의견](wiki/product/deployment-security.md)은 제안으로 유지. 기술·데이터·검증·결정·질문 갱신.
- **Research**: SRC-028~032 추가, 총 [출처 32개](wiki/sources/index.md). Supabase 스킬과 공식 changelog 확인, SMTP/무료 템플릿·Data API 노출 변경을 설계에 반영. [SEC-001~005](wiki/concepts/evidence-map.md)는 실제 보안 시험 결과와 구분.
- **History**: [CHG-0004](history/changes/CHG-0004.md)·[PRD 0.2.2](history/versions/prd-v0.2.2.md)·사용자/조사 원본 보존. [문서 검증](history/validation-latest.json)과 앱/DB 보안 검증을 구분. 실제 배포·외부 설정·업로드는 미수행.

- **Publishing**: 사용자 요청에 따라 `Jeongjibsa/lightweight` GitHub public repository 생성과 `main` push를 준비. PRD 0.2.1까지의 현재 문서·원본·snapshot·history를 검증하고 commit하는 범위로 진행.
- **Planning**: [CONV-0003](wiki/conversations/2026-10-03-003.md)에 따라 PWA 진행을 확정하고 [PRD 0.2.1](wiki/product/prd.md)에 반영. [TypeScript·기기/계정 저장 의견](wiki/product/technology-data-storage.md)은 채택 전 제안으로 관리. 데이터·검증·질문·결정 갱신.
- **Research**: 공식 기술 자료 SRC-022~027 추가, 총 [출처 27개](wiki/sources/index.md). [TEC-001~006](wiki/concepts/evidence-map.md)에 기능·운영 조건과 기획 판단 구분. 계정/오프라인 동기화가 자동 제공된다고 가정하지 않음.
- **History**: [CHG-0003](history/changes/CHG-0003.md)·[PRD 0.2.1](history/versions/prd-v0.2.1.md)·발언/조사 보존. [구조 검사 결과](history/validation-latest.json)는 앱/DB 검증과 구분. 패키지 설치·외부 서비스 생성·업로드·배포는 미수행.

- **Correction**: SRC-020 발행일을 공식 본문에 따라 2023-08-10으로 정정하고 [추가 확인 원본](raw/research/2026-10-03-ios-distribution-correction.json)을 연결. 기존 수집 기록·해시는 보존하며 제품 판단 변화는 없음.
- **Planning**: [CONV-0002](wiki/conversations/2026-10-03-002.md)에 따른 본인 우선·지인 제공·iPhone/iOS 방향을 [PRD 0.2.0](wiki/product/prd.md)에 반영. [PWA 우선 의견](wiki/product/platform-distribution.md)은 제안으로 유지, 데이터/백업·검증·질문·결정 갱신.
- **Research**: Apple/WebKit 공식 자료 SRC-016~021 추가, 총 [출처 21개](wiki/sources/index.md). 정책 사실과 기획 판단을 [지도](wiki/concepts/evidence-map.md)에서 구분. HealthKit은 소개 수준 확인.
- **History**: [CHG-0002](history/changes/CHG-0002.md)·[PRD 0.2.0 스냅샷](history/versions/prd-v0.2.0.md)·새 원문/조사 보존. 기존 이력 유지. 구조/링크/해시 검사는 [최신 보고서](history/validation-latest.json), 실제 앱·배포·실기기 시험은 미수행.

- **Version Control**: 현재 프로젝트 초기 커밋을 요청받아 기존 `main` 저장소의 첫 커밋 대상으로 기획 문서·지식 베이스·검증 스크립트를 구성. `.gitignore`로 macOS 메타데이터와 옵시디언 개인 화면 상태를 제외하고 공통 옵시디언 설정은 포함. 제품 기획 버전은 0.1.0 유지.
- **Skill**: 후속 요청에 따라 `git-commit` 스킬을 `~/.codex/skills/git-commit/`에 생성·설치. `SKILL.md`와 `agents/openai.yaml` 구성, `quick_validate.py` 구조 검증과 UI 메타데이터 확인 통과. [생성 지침](wiki/operations/commit-skill-instructions.md)을 이름 변경 버전 0.1.1로 갱신. 실제 Git 커밋을 수행하는 동작 검증은 미수행.
- **Documentation**: [commit 스킬 생성 지침](wiki/operations/commit-skill-instructions.md) 작성. Conventional Commits 1.0.0 공식 명세와 스킬 운영 제안을 구분하고 [운영 목록](wiki/operations/index.md) 갱신. 제품 기획 변경은 없으며 PRD는 0.1.0 유지. 스킬 생성·설치·Git 커밋은 수행하지 않음.
- **Initialization**: [CONV-0001](wiki/conversations/2026-10-03-001.md)에 따라 OKF v0.2/옵시디언 vault 구성.
- **Creation**: [PRD 0.1.0](wiki/product/prd.md)과 기능 상세 작성.
- **Research**: [출처 15개](wiki/sources/index.md)와 근거 지도 생성. 읽은 범위/한계 표시.
- **History**: [CHG-0001](history/changes/CHG-0001.md), [스냅샷](history/versions/prd-v0.1.0.md), 원문·결정 보존.
- **Validation**: 결과는 [구조 검증](history/validation-latest.json). 과학적 전문 검토·앱 검증은 미수행.
