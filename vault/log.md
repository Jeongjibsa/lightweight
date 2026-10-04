# Vault Update Log

## 2026-10-04

- **HAR03/05 / CONV0013**: main18620d8 merge/push 이후 [다음작업요청](wiki/conversations/2026-10-04-013.md)으로 codex/e2e-harness에 고정Playwright1.63.0·독립4188build/context·실제UI/파일/ChromiumSW를 추가. 최초test형식2실패→27반복통과, 정상종료정리수정→9재확인/실패probe. 기존59/lint/build/E2E타입/format통과. [불변실행/캡처](raw/research/2026-10-04-e2e-harness-verification.json). HAR03done/HAR05CI설정·로컬probe완료, 외부실행미확인/in_progress. PRD0.7.1현황PATCH·[CHG0013](history/changes/CHG-0013.md)/전체snapshot·SRC043/43출처; 기존원본해시보존. 기능/app/schema/원격설정 유지. 다음HAR04·실Auth/SCI/REL관문; 지속localcommit범위.

- **HAR-02 / Loop**: UI/3D 검토 다음 로컬 파일·프로필 DOM 작업. 백업 동일 파일 재선택·pending 전환 차단·workspace owner 경합의3제품 실패를 먼저 재현/수정하고 A→B→A 정상 보존 포함4회귀 추가.59개(19/25/15)/13파일·lint/build/format:check 통과. CUA 가짜4177 오류→동일 경로 미리보기/취소·390px 복원 버튼 잘림 수정/새 캡처 확인. [불변 실행](raw/research/2026-10-04-profile-backup-dom-loop.json)·[루프](wiki/operations/loop-engineering.md). 로컬 HAR02부분 완료/전체 in_progress; Auth/SW/자동 E2E/CI/실기기 관문 유지, PRD0.7.0/schema2·원격 설정 유지. 지속 승인 범위의 local commit 단위.

- **UI/Planning / CONV0012**: [컴포넌트 재감사](wiki/product/component-review.md)에서 다섯 페이지 before/after·실제 펼친 UI를 캡처/직접 확인해 Select/Accordion·16px 여백·표면·Drawer/텍스트를 수정했다.55개/lint/build/format·20폭/화면 overflow0. [원본](raw/research/2026-10-04-component-review.json). [FR17 3D 검토](wiki/product/anatomy-3d-feasibility.md)는 문서만/후순위P2이며 구현/asset 검수 미수행. PRD0.7.0·[CHG0012](history/changes/CHG-0012.md)·CONV/SRC041~042/캡처·스냅샷을 새로 보존했다. 다음은 HAR02 복원 재시도/프로필 DOM이다.

- **Design / Tone**: [CONV-0011](wiki/conversations/2026-10-04-011.md)의 Monokai/Mantine 참고 요청으로 차콜·노란 강조를 적용. 배경/표면/입력/선택/그래프·PWA theme/아이콘, filled 버튼/ThemeIcon 전경 대비 조정. 같은 `codex/mantine-blue-dark` branch, 기능/데이터/권한 변경 없음. [현재 디자인](wiki/product/design-system.md).
- **Verification / History**: 기존55개/12파일·lint/build/format 통과, fake 화면320/390/1440px overflow0·색/console0. ThemeIcon 흰 전경을 발견→명시 variant/autoContrast→검정 재확인. [새 불변 실행](raw/research/2026-10-04-charcoal-theme-verification.json)·[캡처](raw/design/index.md)·SRC040, [CHG-0011](history/changes/CHG-0011.md)·[PRD0.6.1 전체](history/versions/prd-v0.6.1.md). 이전 원본/해시 보존. local commit 지속 지침 적용; push/배포는 범위 밖.

- **Design / Implementation**: [CONV-0010](wiki/conversations/2026-10-04-010.md)의 전체 Mantine·Geist·블루/다크·iOS형·전 폭 하단/클릭 단축을 `codex/mantine-blue-dark` branch에서 구현. [디자인 규칙](wiki/product/design-system.md)/[감사](wiki/product/design-audit.md)·기술/계획/백로그 갱신, PRD0.6.0·UI-02 done. schema/권한/계산 유지.
- **Verification / Loop**: unit19/integration25/ui11·55개/12파일, lint 경고0/build/format, fake4176 입력→저장→400kg·회·연속 선택/설정·5화면×5실제 iframe폭 overflow0. NavLink 키보드/필터 shrink·sheet 높이/숫자 대비/하네스 폭 판정 루프 수정. [불변 실행](raw/research/2026-10-04-mantine-geist-design-verification.json)·[캡처](raw/design/index.md)·SRC039 보존. iPhone/VoiceOver/실Auth/browser runner·CI/production offline-update는 미통과.
- **History**: [CHG-0010](history/changes/CHG-0010.md)·[PRD0.6.0 전체](history/versions/prd-v0.6.0.md) 추가, 이전 원본/해시 보존. 지속 지침에 따라 git-commit local commit 진행; 원격 push/배포 범위는 확대하지 않음.

- **Regression Fix**: 볼륨78e5cb1 commit 후 LOOP-SETTINGS-RESTORE-01 재현·수정. 복원된DB/이전입력 불일치를 same-owner/revision 회귀로 고정, unrelated 기록 갱신의 초안 보존. unit19/integration25/ui8·52개/11파일·lint/build/format·최종CUA report/update/폭/console0. [불변 증거](raw/research/2026-10-04-settings-restore-loop.json)/[루프 설명](wiki/operations/loop-engineering.md). 실제browser 파일복원은 수정 뒤 미반복, 실제Auth/CI/iPhone 관문 유지.

- **Volume Implementation**: REP-04/05/06 계산·SVG/표·필터·루틴 후보 구현. unit19/integration25/ui6·50개/10파일·lint/build/format·가짜CUA/320·375·1440px 통과. [원본](raw/research/2026-10-04-volume-history-verification.json). SCI-03B/실Auth/runner·CI/iPhone은 후속. 복원 설정 입력 잔류는 발견돼 별도 회귀 수정 예정. 이전 구현9cccb4f·계획897f44d·DOMead48d7 local commit.

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
