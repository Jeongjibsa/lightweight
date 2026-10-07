# 디자인 관찰 원본

2026-10-04 CUA로 캡처한 개발 브라우저의 가짜 데이터 화면이다. 실제 개인정보·인증 token은 포함하지 않는다. 캡처를 native iPhone 시험으로 표시하지 않는다.

- [before-today-mobile.png](2026-10-04-before-today-mobile.png) — before / 390×844 / synthetic4174.
- [after-today-mobile.png](2026-10-04-after-today-mobile.png) — after / 390×844 / synthetic4176 / fake profile.
- [after-today-desktop.png](2026-10-04-after-today-desktop.png) — after / real iframe1440×844 / synthetic4176.
- [after-settings-320.png](2026-10-04-after-settings-320.png) — after / real iframe320×844 / synthetic4176.
- [after-workout-mobile.png](2026-10-04-after-workout-mobile.png) — after / 390×844 / fake40kg×10 completed1/3.
- [after-info-sheet-mobile.png](2026-10-04-after-info-sheet-mobile.png) — after / 390×844 / auto-height bottom sheet.

[관찰 기록](../research/2026-10-04-mantine-geist-design-verification.json) · [감사](../../wiki/product/design-audit.md).

## CONV-0011 현재 차콜 톤

이전 CONV-0010 캡처는 위에 보존했다. 아래는 같은 fake4176 데이터의 최종 차콜/노란색 화면이며 [실행 원본](../research/2026-10-04-charcoal-theme-verification.json)을 따른다.

- [charcoal-today-mobile.png](2026-10-04-charcoal-today-mobile.png) — Today / 390×844.
- [charcoal-reports-mobile.png](2026-10-04-charcoal-reports-mobile.png) — Reports / 390×844.
- [charcoal-settings-320.png](2026-10-04-charcoal-settings-320.png) — Settings / 320×844.
- [charcoal-today-desktop.png](2026-10-04-charcoal-today-desktop.png) — Today / 1440×900.

## CONV-0012 가짜 데이터 재감사

[관찰 원본](../research/2026-10-04-component-review.json)·[페이지별 비교 보고서](../../wiki/product/component-review.md). 아래 신규 캡처는 실제4177 fake origin이며 개인정보가 아니다. fullPage fixed/sticky stitching 한계는 viewport 사진으로 보완한다.

- [after-custom-dropdown](2026-10-04-review12-after-custom-dropdown.png)
- [after-library](2026-10-04-review12-after-library.png)
- [after-reports-1440](2026-10-04-review12-after-reports-1440.png)
- [after-reports-dropdown](2026-10-04-review12-after-reports-dropdown.png)
- [after-reports-graph](2026-10-04-review12-after-reports-graph.png)
- [after-reports](2026-10-04-review12-after-reports.png)
- [after-routine-editor](2026-10-04-review12-after-routine-editor.png)
- [after-routines](2026-10-04-review12-after-routines.png)
- [after-settings-320](2026-10-04-review12-after-settings-320.png)
- [after-settings-dropdown](2026-10-04-review12-after-settings-dropdown.png)
- [after-settings](2026-10-04-review12-after-settings.png)
- [after-today-accordion](2026-10-04-review12-after-today-accordion.png)
- [after-today](2026-10-04-review12-after-today.png)
- [after-workout-dropdown](2026-10-04-review12-after-workout-dropdown.png)
- [after-workout](2026-10-04-review12-after-workout.png)
- [before-library](2026-10-04-review12-before-library.png)
- [before-reports](2026-10-04-review12-before-reports.png)
- [before-routine-editor](2026-10-04-review12-before-routine-editor.png)
- [before-routines](2026-10-04-review12-before-routines.png)
- [before-settings](2026-10-04-review12-before-settings.png)
- [before-today](2026-10-04-review12-before-today.png)
- [before-workout](2026-10-04-review12-before-workout.png)

## HAR-02 후속 가짜 파일 재선택

- [잘못된 파일 오류](2026-10-04-har02-invalid-file.png)
- [같은 경로 재선택·복원 버튼](2026-10-04-har02-same-file-retry.png)

실제390×844 캡처를 저장 후 직접 확인했다. 미리보기에서 취소했으며 별도 DOM에서 실제 복원/DB 보존을 확인했다. [실행](../research/2026-10-04-profile-backup-dom-loop.json).

## E2E 실제 가짜 화면

- [WebKit 설정390px](2026-10-04-e2e-webkit-settings.png) — 새미설정프로필·키보드focus; 실제iPhone아님.
- [Chromium 오프라인 리포트390px](2026-10-04-e2e-chromium-offline.png) — 실제SW제어/네트워크차단·2세트저장 직후.

저장한 정확한viewport를 직접 확인했다. 전체페이지/실제사용자자료아님. [실행](../research/2026-10-04-e2e-harness-verification.json).
- [업데이트 가림 before](2026-10-04-update-blocked-before.png) · [main 안내 after](2026-10-04-update-inline-after.png) — fake390×844 실제 viewport 확인; [실행](../research/2026-10-04-storage-recovery-verification.json).

## 첫 HTTPS 배포 다섯 화면

1280×720 실제 앱·빈 로컬 기록/미설정, 직접 확인했다. 실기기/실사용자 기록 아님.

- [today](2026-10-04-pages-today.png)
- [library](2026-10-04-pages-library.png)
- [routines](2026-10-04-pages-routines.png)
- [reports](2026-10-04-pages-reports.png)
- [settings](2026-10-04-pages-settings.png)
- [종목 순서 수정 전320](2026-10-04-order-before-320.png) · [수정 후320](2026-10-04-order-after-320.png) · [수정 후390](2026-10-04-order-after-390.png) — 가짜 기록/실제 browser·알림 가림 확인.
- [루틴 복구 목록320](2026-10-04-routine-recovery-list-320.png) · [목록390](2026-10-04-routine-recovery-list-390.png) · [확인320](2026-10-04-routine-recovery-dialog-320.png) · [확인390](2026-10-04-routine-recovery-dialog-390.png) — 가짜 자료/실제 browser.
- [종료 기록 삭제320](2026-10-04-ended-record-delete-320.png) · [삭제390](2026-10-04-ended-record-delete-390.png) · [목록320](2026-10-04-ended-record-list-320.png) · [목록390](2026-10-04-ended-record-list-390.png) · [복구320](2026-10-04-ended-record-recover-320.png) · [복구390](2026-10-04-ended-record-recover-390.png) — 가짜 자료.
- [CONV0022 WebKit 캡처9개](../research/2026-10-04-catalog-rest-timer-loop.json)
- [기록 note-editor-320.png](2026-10-05-record-note-editor-320.png) — synthetic WebKit screenshot; 실제 iPhone 아님.
- [기록 condition-editor-320.png](2026-10-05-record-condition-editor-320.png) — synthetic WebKit screenshot; 실제 iPhone 아님.
- [기록 condition-report-320.png](2026-10-05-record-condition-report-320.png) — synthetic WebKit screenshot; 실제 iPhone 아님.
- [기록 condition-report-390.png](2026-10-05-record-condition-report-390.png) — synthetic WebKit screenshot; 실제 iPhone 아님.

- [운동 접기/고정 휴식 최종10PNG](../../wiki/operations/workout-collapse-timer.md#캡처).

- [세 종목390px 실제 화면2개](../../wiki/operations/catalog-expansion.md#실제-화면).
