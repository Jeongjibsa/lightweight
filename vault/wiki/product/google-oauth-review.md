---
type: "Feasibility Review"
title: "Google 계정 로그인 검토"
description: "PWA의 Supabase Google OAuth와 기존 허용 계정/복귀 처리 검토."
tags:
  - "auth"
  - "planning"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T23:48:57+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-022.md"
    title: "검토 요청"
  - id: "docs"
    resource: "../sources/SRC-049-google-oauth.md"
    title: "공식 Google/linking/PKCE"
  - id: "correction"
    resource: "../../raw/research/2026-10-04-oauth-public-settings-correction.json"
    title: "공개 응답 누락 값 정정"
---

# Google 계정 로그인

**현재 스택으로 가능하다. 이번 요청은 검토이며 아직 활성화하거나 버튼을 배포하지 않았다.** 현재 프로젝트의 공개 Auth settings에서 Google=false·signup 차단=true를 확인했다. 익명 설정 필드는 공개 응답에 없어 이번 응답으로 판정하지 않는다. 앱은 이메일/비밀번호와 기기별 저장소를 제공한다.

## 권장 구현 순서

1. Google Cloud에서 web OAuth client와 동의 화면을 준비한다. 앱 origin은 운영 Pages 주소, provider callback은 Supabase 프로젝트의 `/auth/v1/callback`이다. client secret은 Supabase provider 설정에만 보관한다. 공개 코드/브라우저 환경 변수/대화로 받지 않는다.
2. Supabase Google provider를 설정한다. 현재 회원과 같은 검증된 Google 이메일이면 기존 identity 연결을 우선 검증한다. 이메일이 다르면 로그인한 계정에서 수동 연결을 검토한다. 기존 UID/허용 목록과 운동 저장소의 소유를 확인하며 새 UID의 자동 권한 등록은 하지 않는다.
3. 앱에 OAuth 시작과 PKCE 복귀를 구현한다. 현재 `detectSessionInUrl:false`이고 callback 교환 처리가 없다. 복귀의 code를 한 번 교환하고 URL을 정리한 뒤 설정 화면으로 돌아간다. 허용 redirect URL은 운영의 정확한 복귀 주소로 제한하며 preview는 운영 계정과 연결하지 않는다.
4. 취소/오류/중복 복귀·기존 계정 연결·unknown 사용자/가입 차단·허용 목록·만료/로그아웃을 검증한다. 실제 iPhone 홈 화면 앱→Google/Safari→앱에서 시작 시점 verifier가 같은 저장소에 남는지도 확인한다. desktop 성공을 물리 PWA 성공으로 대신하지 않는다.

## 결정 상태

Google Cloud client/credential과 동의 화면은 미준비다. 기존 계정 이메일과 Google 이메일의 관계도 확인하지 않았다. 설정 후 실제 허용 계정으로 검증하기 전 기존 로그인 수단을 유지하는 제안이다. 신규 가입을 열거나 DB 권한 정책을 완화할 필요가 있다는 결론은 내리지 않는다. 구체 구현은 후속 작업이며 현재 인증 옵션 최종 선택은 미결이다.

[요청](../conversations/2026-10-04-022.md)·[공식 근거](../sources/SRC-049-google-oauth.md)·[현재 Auth](supabase-integration.md).

[공개 응답 누락 필드 정정](../../raw/research/2026-10-04-oauth-public-settings-correction.json): 최초 수집의 누락 boolean을 false로 변환한 표기는 검증 근거가 아니다. 원본은 보존하고 현재 해석을 정정했다.
