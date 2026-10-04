---
type: "Data Contract"
title: "압축 백업과 독립 복구 계약"
description: "입력/해제 한도·손상 거부·명시 원자 교체·실제 과업."
tags:
  - "operations"
  - "backup"
  - "quality"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T17:15:45+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-015.md"
    title: "순차 구현 요청"
  - id: "verification"
    resource: "../../raw/research/2026-10-04-compressed-backup-verification.json"
    title: "실행"
  - id: "standard"
    resource: "../sources/SRC-046-compression-streams.md"
    title: "표준"
---

# 압축 백업과 독립 복구

- JSON v1 compact 출력이10MiB 이하면 기존 .json 파일. 초과하면 원본 JSON의 모든 필드를 gzip으로 감싸 .json.gz 파일로 출력한다. gzip output10MiB·원본/expanded JSON64MiB를 넘으면 파일을 만들거나 적용하지 않고 기록을 보존한다. 한도를 넘어선 무한 기록/분할 백업 지원을 주장하지 않는다.
- 파일은10MiB 선검사 후 magic1f8b를 보고 format을 판별한다. 확장자/MIME만 믿지 않는다. gzip을 실제 native DecompressionStream으로 풀며 누적64MiB 초과시 읽기를 취소한다. UTF-8 fatal decode·JSON/schema/owner/중복을 검증한다.
- 작은 JSON·기존 들여쓰기 JSON은 계속 호환한다. 미리보기 후 사용자가 확인한 경우에만 기존 atomic restore를 호출한다. 오류/취소는 DB/대기열을 변경하지 않는다. 복원 시 현재 owner로 명시 remap하지만 ID·set·삭제와 당시 snapshot을 유지한다.
- export/import 처리 중 설정의 프로필 선택/추가를 막는다. 다운로드·업로드 파일은 개인 기록이므로 공개 Git/vault/분석에 보내지 않는다. gzip은 암호화가 아니다. 지원 API가 없는 브라우저는 큰 파일을 무손실인 것처럼 제공하지 않고 안내한다.
- CloudPanel의 교체 전/현재 백업 다운로드도 공통 writer를 사용한다. cloud snapshot10MB 제한과 API/RLS/schema는 그대로다. 로컬 gzip 파일이 큰 서버 snapshot을 전송할 수 있게 만든 것은 아니다.

## 실제 확인

66개(unit23/integration26/ui17)·lint/build/E2E typecheck/format/artifact gate 통과. native streams→독립 zlib decompression 동일, CRC byte손상·잘림·64MiB+1 팽창 거부 확인. UI unsupported API 때 파일 생성0/DB 동일 확인.

Chromium10/WebKit8의18과업, 새 압축 과업 두 엔진×3회6회 통과.24,000세트의 실제 gzip 다운로드를 새 context에 명시 복원한 뒤 ID/값·owner remap/reload를 확인하고, CRC 손상 파일에서5table 동일을 확인했다. 최초 실패2개는 snapshot.tables 오참조의test 결함으로 trace를 보존했다. retry0이다.

[원본](../../raw/research/2026-10-04-compressed-backup-verification.json) · [표준](../sources/SRC-046-compression-streams.md) · [기존 저장 하네스](storage-recovery-harness.md). 실제iPhone/압박·eviction/실Auth·서버복구 및64MiB 초과 분할은 남는다.
