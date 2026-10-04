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
- 프로필 전체 JSON/큰 기록 gzip 내보내기, 크기·버전·소유자·중복·충돌 확인 후 원자적 교체 복원, 복원된 설정 입력값 갱신
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

34개 기본 종목(바벨18개)과 세부 부위는 기록용 분류 초안입니다. 검토 전 탐색 개념 그림은 제거했습니다. 해부학적 자극 범위 자료는 검토 후 제공합니다. 근거 검토가 완료된 운동 설명·시각 자료·조건별 티어·추천 루틴, 검토된 권장량 조정·개인화 행동 리포트, 식단은 후속 단계입니다. 현재 같은 운동 조건의 관찰 추이와 본인 루틴/과거 기록 참고 후보를 제공합니다. 자동 증량/회복 판정은 제공하지 않습니다. 검토 전 과학적 순위나 숫자를 표시하지 않습니다.

## 검증

```sh
npm run test:unit
npm run test:integration
npm run test:ui
npm run check
npm run format:check
```

Vitest v4 projects의 unit23/integration26/ui17(66개/14파일)는 소유자·보존·롤백·백업·계산과 pending/ACK/충돌/교체/schema migration 계약을 검사합니다. 서버 환경이 있는 로컬에서 `npm run cloud:probe`와 `npm run cloud:verify`로 Auth 상태/비로그인 HTTP/TLS 및16개 SQL 계약을 별도 검사합니다. SQL 표본의 임시 자료/권한은 rollback하며 실제 Auth 토큰/브라우저 전체 흐름과 구별합니다.

[현재 하네스](../vault/wiki/operations/testing-harness.md)와 [진행 보고](../vault/wiki/product/implementation-progress.md)에 실제 범위를 기록했습니다. DOM은 Testing Library/user-event/jsdom, 실제 브라우저는 Playwright Test 1.63.0으로 검사합니다. a2b3f9f와67ec882의 GitHub3job 성공을 확인했습니다. 최신 압축 증분의 외부 CI는 push 후 확인합니다. desktop WebKit/폭 시험은 실제 iPhone/Safari 설치·키보드·잠금·저장소 정책을 대신하지 않습니다. [정확한 기술 스택](../vault/wiki/product/technology-stack.md) · [남은 작업](../vault/wiki/product/remaining-work.md).

## 자동 브라우저 검사와 실패 증거

```sh
npx playwright install chromium webkit
npm run test:e2e
npm run test:e2e -- --repeat-each=3
npm run test:e2e:probe
```

Linux에서는 브라우저 설치 시 `--with-deps`를 추가합니다. `npm run check`는 64개 검사와 E2E 타입 검사까지 실행합니다. 브라우저 검사는 별도 명령과 CI job으로 실행합니다.

Chromium 9개/WebKit 7개, 합계 16개 과업으로 즉시 완료·재개·실제 파일 다운로드/빈 저장소 복원·로컬 프로필 분리·정보창 키보드/초점·5화면×4폭을 확인합니다. Chromium에서만 실제 서비스 워커를 준비하고 네트워크 차단→재시작→2세트 저장→재연결 후 보존을 검사합니다. WebKit에서는 서비스 워커를 차단합니다. 이전9개/27회에 이어 현재16개와 새 보존7개×3회21회가 통과했습니다. schema1→2의 native DB·quota 오류 주입 후 transaction rollback/재시도·14,400세트 실제 다운로드/복원·SW V1/V2 교체/오프라인 보존을 확인합니다. 실제 Auth/RLS·iPhone·200% 확대·실제 저장 공간 소진/eviction·10MiB 초과 분할 복구는 후속입니다.

검사는 빈 context에서 가짜 자료만 사용합니다. core 과업은 UI로 만들고, migration/큰 파일 과업은 앱 실행 전 독립 native schema1 DB를 준비합니다. Supabase VITE URL/key를 빈 값으로 덮어쓴 `dist-e2e`를 전용 `127.0.0.1:4188`의 loopback 정적 서버에서 빌드/실행하며 사용자 browser·preview·저장소를 재사용하지 않습니다. 포트가 사용 중이면 실패합니다. 필요한 경우 `LIGHTWEIGHT_E2E_PORT`로 별도 포트를 지정합니다.

`output/playwright/e2e/{runID}/`에 JSON/HTML report·환경/코드 SHA256·per-test console/실행 metadata, 실패 화면/trace를 보존합니다. 새 실행은 고유 ID를 만들고 같은 ID 재사용은 거부합니다. 자동 retries는 0입니다. `npx playwright show-report <report>`/`show-trace <trace.zip>`로 증거를 열 수 있습니다. 로컬 출력은 Git에서 제외하며 용량 정리는 별도로 수행합니다.

`test:e2e:probe`는 정상 16개에서 제외한 의도적 실패 하나를 실행합니다. 자식 runner의 exit 1·정확한 실패·retry 0·실제 증거 파일을 확인한 부모 도구가 exit 0으로 끝나며, 다른 실패나 증거 누락은 실패합니다. CI는 엔진별 job과 Chromium probe, 실패 후에도 artifact 업로드·7일 보관을 설정했습니다. public repository의 artifact에는 가짜 검사 출력만 포함하고 `.env`·실제 백업·토큰을 넣지 않습니다. 187c47c의 [GitHub 실행](https://github.com/Jeongjibsa/lightweight/actions/runs/37184261544)에서 check/Chromium/WebKit 3job 성공과 artifact 다운로드를 확인했습니다. 새 HAR04 코드는 local 검사이며 새 GitHub 실행으로 표시하지 않습니다.

## 디자인과 반응형 수동 검사

[디자인 시스템](../vault/wiki/product/design-system.md)과 [감사/캡처](../vault/wiki/product/design-audit.md)에 전체 Mantine·Geist/charcoal-yellow·iOS형 하단 sheet/빠른 입력·데이터 보존 규칙을 기록했습니다. Geist의 한글은 시스템 글꼴로 fallback합니다. 변경 branch는 `codex/mantine-blue-dark`입니다.

개발 서버에서 `/tests/harness/responsive.html`을 열면 실제 iframe320/375/390/768/1440px와 다섯 화면을 선택할 수 있습니다. 같은 origin/IndexedDB를 사용하고 자료를 자동 초기화하지 않으므로 가짜 전용 프로필/origin에서만 검사하세요. production entry/public asset이 아니며 실제 iPhone·자동 browser runner/CI를 대신하지 않습니다.

CONV-0011에서 Mantine UI 다크/Monokai를 참고해 차콜 배경·노란 강조색으로 바꿨습니다. primary filled 버튼/ThemeIcon은 어두운 전경색이고 PWA theme-color/아이콘도 같은 톤입니다. [최신 실행](../vault/raw/research/2026-10-04-charcoal-theme-verification.json)은 색상/선택 화면 폭 검사이며 실제 iPhone 시험을 뜻하지 않습니다.

HAR-02 후속에서는 실제 App/Mantine/Store의 로컬 프로필 A→B→A·저장 중 전환 차단·workspace 경합 비노출과 동일 백업 파일 재선택/복원4개 DOM 계약을 추가했습니다. `tests/harness/pwa-register.ts`는 Vitest 전용 no-op alias이고 cloud client도 해당 profile test에서만 대체합니다. 실제 Auth/서비스워커/오프라인 검증을 대신하지 않습니다. [최초 실패와 검증](../vault/raw/research/2026-10-04-profile-backup-dom-loop.json).

## HAR04 보존 계약

JSON 파일은 모든 필드를 유지하는 compact 출력이며 import/export 모두 최대10MiB(10,485,760bytes) UTF-8입니다. 이전 들여쓰기 파일도 이 한도 이하면 읽습니다. 한도를 넘으면 다운로드/적용 전에 오류를 보여주고 자료를 삭제하거나 자르지 않습니다. 압축/분할은 아직 지원하지 않습니다. 파일 한도는 browser IndexedDB quota와 별개이고 원시 Store.backup/cloud snapshot 계약은 유지합니다.

E2E server는 production 설정을 공유하는 test-only config로 dist-e2e/v1·v2를 만들고, HTML meta 차이로 실제 SW precache revision을 바꿉니다. 현재 runID header로 /__e2e/build를 전환하고 매 과업 v1로 초기화합니다. /__e2e/blank는 앱 실행 전 native DB 준비용입니다. 두 endpoint와 marker는 운영 app/dist에 없습니다. 저장 실패는 test-only native outbox.add에 QuotaExceededError를 1회 주입하며 실제 디스크를 채우지 않습니다. 입력 blur draft가 끝난 뒤 complete transaction만 실패시켜 전체 DB rollback과 한 번의 재시도를 비교합니다.

업데이트 안내는 main 상단의 Mantine Alert이며 운동 중에는 적용을 막고 종료 버튼을 가리지 않습니다. [자세한 하네스/한계](../vault/wiki/operations/storage-recovery-harness.md) · [첫 실패/현재 실행](../vault/raw/research/2026-10-04-storage-recovery-verification.json).

## Cloudflare 배포 준비

Wrangler4.147.0과 `wrangler.jsonc`를 사용합니다. `npm run pages:check`는 실제 dist의 PWA/보안 헤더·private 경로·비밀키/privileged JWT·E2E marker를 검사합니다. `npm run pages:deploy`는 build/검사 후 Pages에 dist만 전송하므로 Wrangler 인증/대상 계정·project 확인과 사용자 배포 승인 범위가 먼저 필요합니다. CONV-0016에서 공식 skills16/MCP5를 재확인했고 Codex main MCP OAuth login 성공·현재 계정 읽기 HTTP200을 확인했습니다. 사용자가 cf 생략·기존 Wrangler 유지를 선택했습니다. 특화 MCP3개·Wrangler 인증과 실제 HTTPS 배포는 각각 확인이 남았습니다. [연결 운영](../vault/wiki/operations/cloudflare-setup.md).

## 큰 백업 복구

JSON10MiB 이하를 기존 형식으로 내보내고 초과 기록은 자동 .json.gz로 보관합니다. 파일10MiB/해제 JSON64MiB 한도·gzip손상/UTF8/schema를 확인한 뒤 기존 명시 atomic restore를 사용합니다.24,000세트 실제 압축 다운로드→새context 복구를 두 엔진/3회씩 확인했습니다. gzip은 암호화가 아니며 실제iPhone·physicalquota/eviction/실Auth·64MiB초과 분할은 남았습니다. [압축 계약](../vault/wiki/operations/compressed-backup.md).

## 기록 재사용과 수정

이전 빈 값 불러오기·종료 운동 재시작·미완료 종목 교체·종료 세트 명시 수정/CAS를 지원합니다. 과거 원본/시각을 보존하고 리포트를 다시 계산합니다.72개·browser20·새6회 통과. [계약](../vault/wiki/operations/record-reuse.md). Pages 제한 Wrangler 로그인은 성공했으나 project 생성이 이메일 인증 필요로 거부되어 아직 배포하지 않았습니다.

## 주간 기록 점검

기록 상태·주간 사용자 목표·선택 누락/비교 조건과 직접 확인을 제공합니다.78개/16파일/browser20 통과. [계약](../vault/wiki/operations/report-coverage.md). 운동 효과나 권장량의 판정은 제공하지 않습니다.

## 현재 운영 배포

[운영 앱](https://lightweight-training.pages.dev) · [DB 연결 없는 preview](https://preview.lightweight-training.pages.dev).3bc6022 main/GitHub3job 성공 후 배포·원격23file hash/헤더 확인. Auth 반환 URL 저장, 계정 등록/실제 login·iPhone/콘텐츠 검토는 남음. npm run pages:verify -- <HTTPS origin> <dist path>로 공개 파일 일치를 검사하며 test:deploy의3계약이 check/CI에 포함됩니다.78 Vitest/browser20과 별도입니다. [현재 남은 작업](../vault/wiki/product/remaining-work.md).

## 공개 설명 빌드 관문

content:compile이 source registry의 검토 선언·payload/file hash/ID/근거·권리 조건을 확인하고 선택 JSON만 공개합니다. build/check/CI에 포함되며 승인 설명은0개입니다. 실제 과학/라이선스 검토를 증명하지 않고 UI/추천 정책은 후속입니다.78 Vitest+Node8계약·artifact25 통과. [계약](../vault/wiki/operations/content-publication.md).

## 최신 확인

96bbb74의 GitHub3job과 운영/preview 공개24file hash/헤더 일치를 확인했습니다. 계정은 등록1개/허용1개입니다. 사용자가 지정 계정/SQL 방식을 명시 승인한 뒤 활성화했습니다. 실제 Chrome login·빈 프로필 전송 ACK/revision1·조회/같은 기기 명시 적용·대기0/복구 수단을 확인했습니다. 실제 운동 기록/새 기기/A·B/만료/로그아웃·메일/iPhone은 별도입니다. PRD0.8.8 계정 문서 commit은 앱 bundle을 바꾸지 않습니다. [확인](../vault/raw/research/2026-10-04-release-account-gate.json).

[실제 Auth 확인과 한계](../vault/raw/research/2026-10-04-auth-profile-roundtrip.json).

## 운동 중 순서 변경

종목2개 이상일 때 Mantine 순서 편집에서 위/아래로 바꾸고 저장합니다. 취소·기록/완료·루틴/시각 보존·CAS/outbox rollback·빈 저장소 복원을 확인했습니다. 성공 알림이 버튼을 가리는 문제를 실제 캡처와 hit target 회귀로 수정했습니다.83 Vitest+Node8·22browser·build/types/format/artifact25 통과, lint기존6경고가 남습니다. 해당 e912f0c의 GitHub3job과 운영/preview24file hash/헤더 일치 배포를 확인했습니다. [계약](../vault/wiki/operations/workout-order.md).

[최신 배포](../vault/raw/research/2026-10-04-workout-order-release.json). 후속 PRD0.8.10 문서 commit은 배포 앱을 변경하지 않습니다.

iPhone 홈 화면 설치·실행·로그인은 사용자 보고로 확인했습니다(CONV0020). 나머지 실기기/클라우드 운동 기록/접근성/보존 검증과 전체 G3는 남습니다. [범위](../vault/raw/research/2026-10-04-iphone-install-user-report.json).

## 삭제한 루틴 복구

나의 루틴 → 삭제한 루틴 목록 → 복구 확인으로 같은 계획을 되살립니다. 취소/실패/중복·과거 운동/백업 보존과86 Vitest/Node8/22browser·최종목록2개·build/types/format/artifact25를 확인했습니다(lint기존6경고). 운동 기록 복구나 자동 전송 기능은 별도입니다. 86cc158의 GitHub3job과 운영/preview 공개24file hash/헤더 배포 일치를 확인했습니다. [계약/320·390px 화면](../vault/wiki/operations/routine-recovery.md).

[현재 배포 증거](../vault/raw/research/2026-10-04-routine-recovery-release.json). 후속 문서 commit은 앱 bundle을 바꾸지 않습니다.

## 종료 운동 기록 삭제·복구

종료 상세에서 삭제 확인/취소, 리포트에서 삭제한 종료 기록 복구를 제공합니다. 세트/시각·다른 active 운동·atomic/CAS/실패/중복과 집계1→0→1·새 저장소 백업을 확인했습니다.90개/Node8/24browser·build/types/format/artifact25 통과(lint기존6경고), 1db637d의 GitHub3job과 운영/preview 공개24file hash/헤더 배포 일치를 확인했습니다. [계약/실제 화면](../vault/wiki/operations/ended-record-recovery.md).

[현재 종료 기록 배포](../vault/raw/research/2026-10-04-ended-record-release.json) · [iPhone 실사용 체크리스트](../vault/wiki/operations/iphone-pilot-checklist.md). 후속 문서 commit은 앱 bundle을 바꾸지 않습니다.

기본1분의 세트 휴식 타이머와 수정 가능한3~4개 즐겨찾기, 일시정지/재개/종료를 제공합니다. 진행 deadline은 기기별이며 즐겨찾기는 profile/outbox와 백업에 포함합니다. 다섯 메뉴 제목의 focus는 유지하고 outline을 제거했습니다.98개/Node8·전체30browser와 최종 문구6을 확인했습니다. [계약/화면](../vault/wiki/operations/catalog-rest-timer.md).

현재 Pages는 Jeongjibsa/lightweight/main Git 자동 배포로 연결했습니다. build는 `cd app && npm ci && npm run build && npm run pages:check`, output app/dist, Node24입니다. production 공개 Supabase 환경을 설정했고 preview는 비워 둡니다. [운영](../vault/wiki/operations/pages-git-integration.md). [Google 로그인](../vault/wiki/product/google-oauth-review.md)은 검토만 완료했고 provider/callback은 아직 구현하지 않았습니다.

0f6381d main의 GitHub37210829022 세 job과 Pages github:push/build/deploy가 success이며 production 공개24file hash/헤더 일치를 확인했습니다. [receipt](../vault/raw/research/2026-10-04-catalog-rest-git-release.json). 후속 문서 commit은 bundle을 바꾸지 않습니다.

운동 메모·장비/가동범위 세트 조건을 로컬 구현했습니다.106개·Node10·browser32/반복6 검사 통과. 서버 validator의 새 필드 미지원은 확인했고 준비 migration은 명시 승인 대기로 미적용이며 새 push/운영 배포를 보류합니다. [계약](../vault/wiki/operations/record-details.md).
