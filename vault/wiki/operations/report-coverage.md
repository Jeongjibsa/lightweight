---
type: "Data Contract"
title: "이번 주 기록 점검과 관찰 리포트"
description: "기록 상태·주간 횟수·직접 수정 진입과 계산 경계."
tags:
  - "reports"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T20:47:40+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "순차 요청"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-report-coverage-verification.json"
    title: "실행"
---

# 이번 주 기록 점검

리포트에서 입력 상태와 직접 설정한 주간 횟수를 확인하고, 진행 중/미완료 기록을 바로 열 수 있다. 기록의 관찰이며 운동 처방·효과 판정은 아니다.


| 항목 | 계산/화면 계약 |
|---|---|
| 기간 | 현재 사용자 시간대의 월요일~오늘; 과거 운동일은 당시 저장 날짜 유지 |
| 대상 | 본인·삭제/취소 제외; 완료 집계는 종료한 세션의 완료 본세트 |
| 횟수/일수 | 같은 날 여러 종료 운동은 각각 횟수, 운동 기록일은 한 날짜 |
| 선택 입력 | RIR null만 미입력; 0은 입력 완료, 부족해도 기록 거부하지 않음 |
| 바로 확인 | 진행 중 세션/미완료 본세트의 최신 세션에 직접 이동 |
| 추이 준비 | 같은 종목/이름/분류/장비/부하/좌우 조건의 두 날짜 이상 기록을 표시; 과학적 충분성 임계값 아님 |
| 최신성 | liveQuery 재계산, record-coverage-v1·owner/기간/profile+record revision을 계산; 저장 report 없음 |

78개(unit27/integration30/ui21)·lint/build/E2E타입/format·24파일 artifact gate 통과. Chromium11/WebKit9·20개 통과, 390px WebKit 화면을 직접 확인했다. [불변 검사](../../raw/research/2026-10-04-report-coverage-verification.json). 가짜 데이터만 사용했으며 실제 계정·iPhone·검토된 직접/간접 매핑·근거 기반 다음 운동량과 저장 report는 남는다.
