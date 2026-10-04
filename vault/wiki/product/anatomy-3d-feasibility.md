---
type: "Feasibility Study"
title: "운동별 3D 해부학 애니메이션 가능성 검토"
description: "FR-17의 PWA 구현 가능성과 자산·검토·성능 관문을 후순위로 관리한다."
tags:
  - "product"
  - "3d"
  - "planning"
status: "draft"
generated:
  by: "codex/gpt-6"
  at: "2026-10-04T14:54:43+09:00"
sources:
  - id: "request"
    resource: "../../raw/conversations/2026-10-04-012.md"
    title: "검토/후순위"
  - id: "technology"
    resource: "../sources/SRC-042-web-anatomy-3d.md"
    title: "기술/자산 자료"
version: "0.1.0"
approval_status: "proposal"
change_id: "CHG-0012"
---

# 운동별 3D 해부학 애니메이션 가능성 검토

**결론: PWA에서 구현 가능한 방향이다. 현재는 타당성 검토만 완료했고 구현은 후순위(P2)다.** 사용자 요구는 운동별 3D 해부학 모델링/자극부위 애니메이션이다. 아래 renderer·자산·화면/성능 조건은 실행 전 제안이다. [원문](../../raw/conversations/2026-10-04-012.md)·[일차 자료와 읽은 범위](../sources/SRC-042-web-anatomy-3d.md).

## 무엇을 제공할 것인가

운동 상세에서 해부학 모델의 관련 근육을 강조하고 같은 모델로 운동 동작을 재생하는 방향. 회전/앞뒤 보기·재생/정지·구간 이동·관련 근육 이름/역할 설명·정적 대체 그림을 검토한다. 장비/변형별 동작과 설명 버전을 연결한다. 키보드·대체 텍스트·motion 감소 설정으로 같은 정보를 읽을 수 있어야 한다.

시각적 강조는 관련 근육/역할의 개념 설명이다. 측정된 자극%, 근비대 효과 heatmap·개인 실제 근육 상태로 표현하지 않는다. 강조 대상/역할은 SCI-01~02의 근거·전문 검토를 통과한 내용에 연결한다. 이 검토에서 개별 운동의 해부학적 역할이나 운동 효과에 대한 새 주장은 추가하지 않았다.

## 렌더링과 콘텐츠 제작은 별개의 작업

| 경로 | 적합성 판단 | 필요한 것/제약 |
|---|---|---|
| model-viewer +GLB | 한 모델·준비된 clip·기본 camera/재질 강조의 작은 prototype 후보 | custom element/React 연동·근육별 재질/분리 검토. 공식 iOS 지원과 실제 성능은 구별 |
| Three.js +GLTFLoader/AnimationMixer | 개별 mesh 선택·layer/근육별 강조·camera/clip 제어가 커질 때 후보 | 별도 3D scene 관리·메모리 정리·실기기 profiling·React lifecycle 연동 필요 |
| 3D에서 렌더한 짧은 영상/정적 poster | 같은 자산으로 만드는 fallback/초기 저사양 대안 | 회전/실시간 선택을 제공하지 않으므로 최종 interactive3D 요구를 충족했다고 하지 않음 |

현재 스택에 renderer를 설치하지 않았다. renderer를 가져오는 것만으로 해부학 모델·근육 분리·fitness 운동 동작이 제공되지 않는다. 외부 asset을 사거나 만들 때 관절 rig·근육 mesh/material ID·장비·clip과 해부학 검수까지 확인한다. Z-Anatomy atlas는 참고 후보이며 운동 애니메이션 자산으로 바로 쓸 수 있다고 결론내리지 않는다.

## 자산·권한·성능 관문

- 모델/텍스처/rig/clip별 출처·license·수정/재배포/상업적 사용 조건·attribution 기록. CC BY-SA 후보는 수정 asset의 공유 조건을 개별 검토한다. 사용자 제공 범위가 작다는 이유로 권리 확인을 생략하지 않는다.
- 콘텐츠 검토자와 검토 단위(운동/변형/근육 역할/동작 구간), asset version/hash·검토 상태를 관리한다. 미검토 자료는 prototype 표시를 유지한다.
- 운동 상세에 진입한 뒤 lazy load하는 제안. 첫 앱 실행·세트 저장 경로에 대형 모델을 넣지 않는다. geometry/texture 압축·poster 우선·화면 밖/백그라운드 재생 중단·GPU resource 정리·다운로드 취소·저사양 fallback을 설계한다.
- 오프라인 asset은 사용자가 선택하는 캐시와 용량 제한을 검토한다. 모든 모델을 서비스 워커 기본 precache에 넣지 않는다. 기기 기록 저장소 보존에 미치는 영향을 확인한다.
- 수치 성능 budget/자산 가격/제작 기간은 아직 확정하지 않았다. 실제 후보 파일이 있어야 크기/rig/clip/메모리/FPS/배터리·로드 실패를 측정할 수 있다. 실제 iPhone/iOS와 Safari/WebGL 지원·키보드/VoiceOver·motion 감소를 별도 확인한다.

## 단계와 후순위

1. **VIS-3D-01 (done / 검토 문서):** 공식 renderer/animation/asset 후보 자료와 읽은 한계를 기록. 지금 완료한 범위다.
2. **VIS-3D-02 (planned / P2):** 운동 MVP/기록 안정화 뒤, 한 운동/한 변형의 권리·해부학 검토 가능한 asset을 선정하고 근육 분리·rig·clip·전문 검토·예산을 확인. 결과로 renderer와 성능 목표 선택.
3. **VIS-3D-03 (planned / P2):** 단일 운동 prototype→실제 기기 측정→정적 fallback/재생·정지/rotation/근육 설명→검토 통과 범위만 점진 확장.

FR-02의 기본 시각 설명은 LOG-02/SCI의 검토된 2D부터 이어간다. FR-17은 첫 운동 MVP 출시를 지연시키는 필수 조건이 아니다. 사용자 선택인 ‘운동 먼저·식단 다음’을 유지하고 식단/AI/3D 사이의 상세 공수·우선순위는 후속 계획에서 정한다. 카메라 자세 추적은 별도 미확정 기능이다.

현재 미결: 자산 제작/구매 경로·근육 분리 수준·운동별 variant/clip 범위·검토자·license 조건·예산·실제 기기 성능. [백로그](implementation-backlog.md)·[질문](open-questions.md).
