# Lightweight 운동 기록 PWA

app0.2.0의 반응형 운동 기록 앱입니다. 전체 주요 UI에 Mantine UI·Geist Variable/한글 시스템 fallback·charcoal/yellow theme을 사용합니다. 모든 폭에서 하단 다섯 메뉴를 유지하고 본문/카드를 반응형으로 재배치합니다. 목표·주당 횟수·분할·장비·시간·단위·시간대는 사용자별로 설정합니다. 개인 파일럿 조건을 모든 사용자 기본값으로 고정하지 않습니다.

Node 24 환경에서 프로젝트 루트 기준:

```sh
cd app
npm ci
npm run dev
```

오프라인 캐시는 개발 서버가 아닌 프로덕션 빌드로 확인합니다.

```sh
npm run build
npm run preview -- --port 4173
```

`http://127.0.0.1:4173`에서 한 번 온라인으로 앱과 서비스 워커를 준비한 뒤 오프라인 재시작·입력을 확인할 수 있습니다. 이 주소는 실행한 컴퓨터에서만 접근합니다. iPhone 설치·실사용은 추후 고정 HTTPS 주소와 실제 기기에서 검증합니다.

## 현재 기능

- 프로필별 설정 및 기록 분리, 운동 이름·장비 검색과 부위 필터, 사용자 정의 종목
- 루틴 작성·복사·정렬·편집·삭제, 운동 시작 당시 루틴/설정 스냅샷 보존
- 중량·횟수·시간·준비/본세트·좌우·선택 RIR 기록, 완료/완료 취소·세트 추가·일부 완료 종료
- IndexedDB/Dexie 저장과 변경 대기 항목의 원자적 트랜잭션, 재개, 시각 기준 휴식 타이머
- 프로필 전체 JSON 내보내기, 크기·버전·소유자·중복·충돌 확인 후 원자적 교체 복원, 복원된 설정 입력값 갱신
- 완료 본세트 입력 행 수·운동 횟수·기록일·운동 분류별 주간 요약
- 운동/일별 기록 볼륨·세트/반복/시간·28/84/전체 추이 그래프와 수치 표, 같은 종목 조건·kg/lb·0/N/A/coverage
- 과거 종료 기록/현재 설정·장비에 맞는 본인 루틴 후보, 현재 계획과 과거 실제/partial 구분·보류 이유·명시 선택
- 등록 이메일/비밀번호 로그인·계정 UUID별 기기 DB와 화면 전환, 진행 운동/저장 중 계정 전환 차단
- 수동 전체 기록 전송·응답 유실 재시도·서버 버전 충돌 거부·불러오기 미리보기/명시 교체·최근 교체 전 JSON 복구

새 종목의 3개 빈 세트, 타이머 2분은 입력 편의값이며 운동 처방이 아닙니다. 준비 세트와 미완료 기록은 수행 본세트 집계에서 제외합니다. 좌우를 따로 기록한 행은 각각 셉니다. 운동 분류별 요약은 근육 자극량이나 운동 효과를 뜻하지 않습니다.

## 저장과 보안 경계

기기 데이터는 IndexedDB의 기존 `lightweight-v1`과 인증 계정의 `lightweight-account-{UUID}-v1`에 저장합니다. DB 버전은2이며 기존 version1 테이블을 보존하고 cloud 상태 테이블을 추가했습니다. 선택 로컬 프로필 UUID와 Supabase SDK 세션은 브라우저 저장소에 있습니다. 브라우저 데이터 삭제·기기/origin 변경은 기록을 자동 이동하지 않으므로 JSON을 안전하게 보관하세요. 개인 백업은 공개 Git에 추가하지 않습니다. 가져오기는 현재 프로필/계정을 명시적으로 교체하고 오류 시 전체 롤백합니다.

로컬 프로필은 인증 계정이 아니며 같은 브라우저에서 전환할 수 있습니다. 제공된 Supabase에 Auth/RPC·서버 허용 목록·RLS/execute 권한·소유자/입력 검사를 적용했습니다. 공개 가입은 사용자 승인으로 차단했습니다. 로그인만으로 기록 접근이 열리지 않으며 승인한 등록 계정의 허용 목록 추가가 필요합니다. 현재 실제 등록 계정은 없어 로그인→전송→다른 기기 전체 흐름은 미시험입니다. SDK 세션과 기기 기록의 앱 자체 암호화는 제공하지 않습니다.

outbox는 변경 대기이며 서버 ACK를 확인한 수동 전송만 클라우드 반영 완료입니다. 응답 유실 시 같은 operation을 재시도하고 충돌 시 기기 자료를 보존합니다. 내려받기는 명시적 전체 교체이며 교체 직전 한 묶음만 기기에 복구용으로 보관합니다. 자동 레코드 동기화/두 편집 병합은 후속입니다. 지인 제공은 실제 Auth·권한·복원·기기 검증 뒤 진행합니다.

배포 산출물은 `app/dist`만 사용하며 vault·개인 백업·서버 키를 포함하지 않습니다. `public/_headers`의 CSP는 정확한 Supabase 연결 대상과 로컬 글꼴을 허용합니다. Mantine 동적 스타일에 `style-src 'unsafe-inline'`을 추가했고 script-src는 self입니다. 실제 운영 헤더는 배포 후 별도 검증 대상입니다.

## Supabase 설정과 계정 준비

`.env.example`을 참고해 추적 제외 `.env`에 브라우저용 URL/publishable key를 설정합니다. `SUPABASE_DB_URL`/비밀번호는 서버 개발 도구 전용이며 VITE 접두사를 붙이지 않습니다. 기존 로컬 자료는 로그인 시 자동 업로드하지 않습니다. 필요한 자료를 JSON으로 내보내고 로그인 계정에서 명시적으로 가져옵니다.

서버 migration은 `supabase/migrations/20261003162808_training_cloud.sql`에 있고 원격에 적용했습니다. 운영자가 Auth 계정을 직접 등록하고 승인한 기존 Auth UUID만 아래 도구로 허용합니다. 비밀번호는 대화나 문서에 넣지 않습니다.

```sh
npm run cloud:allow-user -- <AUTH_USER_UUID>
```

이 권한 부여 명령은 이번에 실행하지 않았습니다. 실제 계정의 등록/허용·로그인·전송/불러오기·권한 회수 검증 절차는 [Supabase 문서](../vault/wiki/product/supabase-integration.md)에 있습니다. 서버 개발 연결은 Session pooler와 공식 CA 인증서/hostname 검증을 사용합니다.

## 콘텐츠와 남은 범위

12개 기본 종목은 기록용 분류 초안입니다. 검토 전 탐색 개념 그림은 제거했습니다. 해부학적 자극 범위 자료는 검토 후 제공합니다. 근거 검토가 완료된 운동 설명·시각 자료·조건별 티어·추천 루틴, 검토된 권장량 조정·개인화 행동 리포트, 식단은 후속 단계입니다. 현재 같은 운동 조건의 관찰 추이와 본인 루틴/과거 기록 참고 후보를 제공합니다. 자동 증량/회복 판정은 제공하지 않습니다. 검토 전 과학적 순위나 숫자를 표시하지 않습니다.

## 검증

```sh
npm run test:unit
npm run test:integration
npm run test:ui
npm run check
npm run format:check
```

Vitest v4 projects의 unit19/integration25/ui15(59개/13파일)는 소유자·보존·롤백·백업·계산과 pending/ACK/충돌/교체/schema migration 계약을 검사합니다. 서버 환경이 있는 로컬에서 `npm run cloud:probe`와 `npm run cloud:verify`로 Auth 상태/비로그인 HTTP/TLS 및16개 SQL 계약을 별도 검사합니다. SQL 표본의 임시 자료/권한은 rollback하며 실제 Auth 토큰/브라우저 전체 흐름과 구별합니다.

[현재 하네스](../vault/wiki/operations/testing-harness.md)와 [진행 보고](../vault/wiki/product/implementation-progress.md)에 실제 범위를 기록했습니다. DOM은 Testing Library/user-event/jsdom으로 추가했습니다. Playwright Test runner·CI 브라우저 회귀는 아직 없습니다. Chromium 폭 시험은 실제 iPhone/Safari 설치·키보드·잠금·저장소 정책을 대신하지 않습니다. GitHub 검사 워크플로는 공통 check를 사용하도록 설정했으며 외부 실행 결과는 아직 없습니다. [정확한 기술 스택](../vault/wiki/product/technology-stack.md) · [남은 작업](../vault/wiki/product/remaining-work.md).

## 디자인과 반응형 수동 검사

[디자인 시스템](../vault/wiki/product/design-system.md)과 [감사/캡처](../vault/wiki/product/design-audit.md)에 전체 Mantine·Geist/charcoal-yellow·iOS형 하단 sheet/빠른 입력·데이터 보존 규칙을 기록했습니다. Geist의 한글은 시스템 글꼴로 fallback합니다. 변경 branch는 `codex/mantine-blue-dark`입니다.

개발 서버에서 `/tests/harness/responsive.html`을 열면 실제 iframe320/375/390/768/1440px와 다섯 화면을 선택할 수 있습니다. 같은 origin/IndexedDB를 사용하고 자료를 자동 초기화하지 않으므로 가짜 전용 프로필/origin에서만 검사하세요. production entry/public asset이 아니며 실제 iPhone·자동 browser runner/CI를 대신하지 않습니다.

CONV-0011에서 Mantine UI 다크/Monokai를 참고해 차콜 배경·노란 강조색으로 바꿨습니다. primary filled 버튼/ThemeIcon은 어두운 전경색이고 PWA theme-color/아이콘도 같은 톤입니다. [최신 실행](../vault/raw/research/2026-10-04-charcoal-theme-verification.json)은 색상/선택 화면 폭 검사이며 실제 iPhone 시험을 뜻하지 않습니다.

HAR-02 후속에서는 실제 App/Mantine/Store의 로컬 프로필 A→B→A·저장 중 전환 차단·workspace 경합 비노출과 동일 백업 파일 재선택/복원4개 DOM 계약을 추가했습니다. `tests/harness/pwa-register.ts`는 Vitest 전용 no-op alias이고 cloud client도 해당 profile test에서만 대체합니다. 실제 Auth/서비스워커/오프라인 검증을 대신하지 않습니다. [최초 실패와 검증](../vault/raw/research/2026-10-04-profile-backup-dom-loop.json).
