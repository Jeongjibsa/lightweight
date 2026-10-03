# Vault Update Log

## 2026-10-03

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
