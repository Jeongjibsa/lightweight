# Lightweight

반응형 운동 기록 PWA는 [app](app/README.md)에 있습니다. `cd app && npm ci && npm run dev`로 실행합니다. app0.2.0은 기기 기록·백업·Mantine UI·Spoqa Han Sans Neo와 Supabase Auth/계정별 DB·수동 클라우드 기록 전송을 구현했습니다. 볼륨/추이·과거 기록 기반 루틴 후보와 DOM 검사까지 구현했습니다. 실제 계정 전체 흐름·자동 browser 회귀·검토된 추천/권장량 콘텐츠·실기기 검증은 남았습니다.

현재 [기술 스택](vault/wiki/product/technology-stack.md), [Supabase 연결과 계정 준비](vault/wiki/product/supabase-integration.md), [남은 작업](vault/wiki/product/remaining-work.md), [테스트 하네스](vault/wiki/operations/testing-harness.md)를 문서화했습니다. 공개 가입은 차단했으며 등록된 Auth 계정과 별도 서버 허용 목록이 필요합니다.

[vault/index.md](vault/index.md)에서 시작합니다. 현재 기획서는 [vault/wiki/product/prd.md](vault/wiki/product/prd.md)입니다.

옵시디언에서 프로젝트 하위 `vault` 폴더를 보관함으로 여세요. 대화에 따른 요구·결정·근거 변경은 기획서와 변경 이력에 함께 반영합니다.

문서 구조 확인: `ruby scripts/validate_vault.rb`. 이 검사는 연구 전문 검토나 앱 기능 테스트를 대신하지 않습니다.
