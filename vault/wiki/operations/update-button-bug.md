---
type: "Bug Report"
title: "BUG-PWA-UPDATE-01 업데이트 안내의 비활성 버튼"
description: "BUG-PWA-UPDATE-01 업데이트 안내의 비활성 버튼"
tags: ["training", "implementation", "testing"]
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-08T01:19:13+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-08-027.md"
    title: "인간 보고"
  - id: "unit-chg-0046"
    resource: "../../raw/research/2026-10-08-report-guide-git-release.json"
    title: "업데이트·주간 리포트·검토 설명 소비 수정 CI/운영 확인"
---

# BUG-PWA-UPDATE-01

- 상태: **UX 보완 완료 / 사용자 증상 최종 원인·실기기 확인 대기**.
- 제보: 업데이트가 있다고 표시되지만 버튼이 비활성화됨. 앱 종료 후 재접속하면 안내가 사라짐.
- 조건: 당시 운동 진행 여부는 사용자가 기억하지 못함. 제보 기기·브라우저·앱 버전/시각·다른 탭 유무는 확인되지 않음. 과거 파일럿 기기를 이번 재현 환경으로 단정하지 않음.
- 기대: 사용자가 업데이트 가능한 시점과 지금 할 일을 알 수 있고, 운동 종료 뒤 적용하며 기록이 유지됨.
- 영향: 새 버전 적용 경로를 찾기 어렵고 앱 강제 종료를 유도하는 불편. 데이터 손실은 보고되지 않았으며 없었다고 확인한 것도 아님.

## 확인한 코드와 재현 경계

기존 UpdateNotice는 현재 프로필의 active 운동이 하나라도 있으면 업데이트 버튼을 잠근다. 세트 입력은 blur/save에 따라 저장되므로 무조건 reload로 보류를 없애는 방법은 사용하지 않는다. 빈 합성 프로필/독립 origin에서 실제 v1→waiting v2 상태를 만들었고, 다른 메뉴에서도 active 보류가 유지되는 조건을 확인했다.

모든 기존 클라이언트를 닫을 때 waiting worker가 활성화되는 일반적인 수명 주기와 안내 소멸은 양립한다. 그러나 이번 사용자 상황의 원인으로 확정하지 않는다. **active가 없는데도 비활성인 현상은 아직 재현하지 못했다.**

## 수정

운동 중 비활성 ‘업데이트’를 **‘운동 마치고 업데이트’** 동작으로 바꿔 다른 메뉴에서도 진행 중 기록을 바로 연다. 종료 뒤에는 ‘업데이트’가 제공된다. 저장 중에는 짧은 보류 이유를 표시하고 적용을 막는다. 적용 중 로딩/중복 방지와 실패 후 안내·재시도를 제공한다. 강제 종료·기록 삭제·자동 운동 종료를 요구하지 않는다.

## 검증과 후속

114 Vitest/Node10·lint/build/types 통과(기존6경고). 새로운 DOM2계약은 active 진입/저장 보류/종료 적용/오류 복구를 검사한다. 실제 Chromium SW 한 흐름에서 메뉴 이동→active 재개→종료→v2 적용→native DB 동일→v2 offline 통과. 최초 실패는 ‘reports’라는 잘못된 테스트 메뉴 이름 때문이며 제품 실패로 표시하지 않는다. 실패 runID와 trace/PNG/console을 보존했다.

후속: 실제 iPhone에서 업데이트 안내·종료·적용을 확인한다. active가 없는데 비활성이면 화면의 저장 상태/메뉴/다른 탭 유무와 함께 추가 재현한다. 제보가 확정적으로 해결됐다고 종료하지 않는다.

[인간 원문](../../raw/conversations/2026-10-08-027.md) · [실행](../../raw/research/2026-10-08-update-notice-loop.json)

## 업데이트·REP/SCI 운영 반영 — 2026-10-08

업데이트 안내·주간 비교·검토 설명 소비를 main에 push하고 하네스 보완 **647dca5**의 GitHub37650233275 check/Chromium/WebKit 세 job success를 확인했다. 실제 수신한 정상 artifact는 **Chromium21/WebKit19=40** 통과·unexpected/flaky/skipped0이며, 의도적 실패 probe의 trace/PNG/console/execution/report 보존도 확인했다.

같은 source의 Pages `github:push` build/deploy가 success이고 운영 공개24파일 SHA256·보안 헤더가 검증 build와 일치한다. 첫37648213883 Chromium1실패는 이력에 보존하며 생성JSON 준비를 추가한 뒤의 결과와 구별한다. [불변 배포 확인](../../raw/research/2026-10-08-report-guide-git-release.json).122Vitest/Node10·build/types/format/artifact25 통과, 기존lint6경고는 유지한다.

실제 승인 설명0개·직접/간접 매핑·시각/권리·조건 티어·권장량, 앱 내부 리포트 보관함은 미완료다. 업데이트 제보의 당시 원인 미상/실기기와 iPhone 파일 저장, 실제 Auth/다기기·과학 공개/운영 복구·4주 파일럿/P2 관문은 남는다. 새 서버/Auth/schema/의존성을 바꾸지 않았다. preview DB는 기존 빈 설정을 유지하고 새 preview branch 배포/asset 검사는 하지 않았다. 후속 문서는 앱 bundle을 바꾸지 않는다.
