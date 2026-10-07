---
type: "Implementation Contract"
title: "합성 다기기 복구와 오래된 응답 차단"
description: "합성 다기기 복구와 오래된 응답 차단"
tags: ["training", "implementation", "testing"]
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-07T22:38:49+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-07-026.md"
    title: "요구"
  - id: "loop"
    resource: "../../raw/research/2026-10-07-sync-stale-response-loop.json"
    title: "검증"
  - id: "technical"
    resource: "../sources/SRC-053-sync-api-revision.md"
    title: "공식 API 범위"
  - id: "unit-chg-0041"
    resource: "../../raw/research/2026-10-07-catalog-sync-git-release.json"
    title: "세 종목·동기화 보존 실제 Git/CI·운영 확인"
version: "0.1.0"
change_id: "CHG-0040"
---

# 오래된 클라우드 응답과 삭제 보존

CONV0026 순차 후속 / SYNC03~05·HAR06. `previewDownload`는 readonly transaction, `applyDownload`는 기존 atomic write transaction 안에서 remote.revision이 저장된 cloud.baseRevision보다 낮으면 거부한다. 오류는 최신 기록을 다시 불러오도록 안내하고 기기 기록을 보존한다. 값이 같은 revision의 명시 교체는 기존처럼 허용하며 로컬 변경의 recovery snapshot을 남긴다.

baseRevision은 이 기기가 ACK/명시 내려받기로 확인한 서버 버전이다. 아직 모르는 더 최신 서버 버전을 탐지하는 검사는 아니다. 네트워크 최신성/자동 병합이나 실제 Auth 검증으로 확대하지 않는다. 기존 owner/schema·localSignature·active-session guard·receipt/CAS·outbox·삭제 tombstone·백업 계약은 유지한다. 새 서버/권한/마이그레이션/SDK 변경은 없다.

## 실패에서 수정까지

기존 코드는 미리보기 시 오래된 응답을 받아들였고, current localSignature와 뒤늦은 remote 응답이 결합되면 적용 단계에서 로컬 baseRevision을 낮출 수 있었다. 새 integration3개 중2개가 실제로 실패했다. 두 단계의 transaction 안에 revision 하한 검사만 추가한 후112Vitest(35unit/46integration/31UI)·Node10·36browser(19/17)/build/types/format/artifact25가 통과했다. 기존6effect경고는 남는다. [불변 검사](../../raw/research/2026-10-07-sync-stale-response-loop.json).

| 합성 시나리오 | 확인 |
|---|---|
| A의 전송은 서버에서 commit1, 응답만 유실→B가 내려받고 종료 기록 삭제/commit2→A receipt 재시도 | 서버 commit 수2 유지, A의 새 편집/outbox 보존, 옛 operation의 ACK1 정상 처리 |
| A의 다음 전송(base1)은 conflict2→A가 최신 서버 기록 명시 적용 | 새 편집은 자동 덮어쓰지 않음; 명시 적용 시 recovery에 A편집/삭제 전 운동 보존, 현재 기록은 B의 tombstone |
| 이미 base2인데 옛 remote1이 늦게 도착 | preview 거부·다섯 table(profile/routine/session/outbox/cloud) 불변, 삭제 기록 재등장 방지 |
| 확인 객체의 remote만 옛1로 바뀜 | apply에서 하한을 다시 검사해 거부·다섯 table 불변 |
| 같은 서버 revision을 다시 명시 적용 | 허용·미전송 로컬 편집을 recovery에 보존 |

테스트는 독립 fake IndexedDB 두 개와 메모리 CAS/receipt 전송을 사용한다. 실제 Supabase/RLS·A/B계정·로그인/만료/권한 회수·네이티브 Safari 저장 검사가 아니다. 기존 실제 native browser 흐름36개는 별도로 회귀 검증했다. [공식 API 확인 범위](../sources/SRC-053-sync-api-revision.md).

## 남은 SYNC 관문

실제 새 기기·Auth 만료/로그아웃·권한 회수·두 편집의 항목별 해결/삭제 재접속·10MiB snapshot 정책·여러 앱 버전과 운영 복구/서버 revision 초기화 정책은 남는다. 서버 snapshot을 과거 낮은 revision으로 복구하는 운영 정책은 선택하지 않았으며, 이번 클라이언트가 이를 최신 응답으로 받아들이지 않는다. 실제 운동 기록은 사용자의 다음 운동 후 확인 과업이다. [현재 남은 작업](../product/remaining-work.md).

## 세 종목·동기화 보존 운영 반영 — 2026-10-07

세 종목 추가b44ebda와 늦은 응답 차단fba60bb를 main에 push했다. GitHub37629327092 세 job success·실제 내려받은 Chromium19/WebKit17=36 결과와 최초 실패 probe 증거를 확인했다. 같은 fba60bb source의 Pages Git build/deploy가 성공했고 운영 공개24파일 SHA256·보안 헤더가 검증 빌드와 일치한다. [불변 배포 확인](../../raw/research/2026-10-07-catalog-sync-git-release.json).

카탈로그37/기존 ID·중량 기준·112Vitest/Node10·36browser와 schema2/backup1을 유지한다. SYNC 합성 검사와 실제 Auth/기기 관문을 구별한다. 실제 운동/새 기기·만료/회수·iPhone/Watch·SCI·운영 복구/파일럿·식단/3D/P2는 남는다. 신규 preview branch 배포는 검증하지 않았고 기존 preview DB 환경은 비어 있다. 이 후속 문서는 앱 bundle을 바꾸지 않는다.
