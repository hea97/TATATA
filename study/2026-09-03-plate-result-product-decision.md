# PlateResult 상태 모델 Product Decision

- 작성일: 2026-09-03
- 관련 Issue: #9, #11
- 상태: 확정됨
- 사용자 승인일: 2026-09-03
- 범위: TATATA MVP 1의 문장 타석 종료와 `PlateResult` 상태 의미

## 문제

문장 타이핑이 공식 타석이고 제출 후 타석 결과를 거쳐 문법 복습으로 이동한다는 흐름은 확인되어 있다. 그러나 결과 후보인 `STRIKE`가 한 타석의 최종 결과인지, 같은 타석 안에서 누적되는 중간 상태인지는 정의되어 있지 않다.

이 미결정을 남긴 채 UI나 경기 상태를 구현하면 구현자가 실제 야구 관행을 근거로 `strikeCount`, 재시도, 3 STRIKE OUT 같은 제품 규칙을 임의로 추가할 수 있다. 이 문서는 영어 학습 중심의 현재 루프와 MVP 범위를 유지할 수 있도록 두 대안을 비교하고, 구현 전에 승인이 필요한 상태 규칙을 제안한다.

## 근거 상태

### 확정됨

- TATATA는 영어 학습 서비스이며 야구는 학습 동기와 성장 기록을 위한 게임화 메타포다.
- 단어 학습과 문법 복습은 공식 타석 및 시즌 타율 계산에 포함하지 않는다.
- 문장 타이핑은 공식 타석이다.
- 타석 결과는 최소 `accuracy`, 개인 기준 대비 `relative typing speed`, `difficulty adjustment`를 근거로 한다.
- 구체적인 판정 threshold와 production 판정식은 확정되지 않았으며 임의로 만들지 않는다.
- 3 OUT이면 현재 이닝이 종료되고, 다음 이닝 시작 시 OUT은 0으로 초기화된다.
- 마지막 이닝 종료 시 Game Complete가 된다.
- 핵심 학습 루프는 `단어 학습 → 문장 타이핑 → 타석 결과 → 문법 복습 → 다음 타석 → 3 OUT → 이닝 결과`다.
- 문장 제출 1회는 공식 타석 1회를 종료한다.
- `STRIKE`, `OUT`, `SINGLE`, `DOUBLE`, `TRIPLE`, `HOME_RUN`은 모두 해당 공식 타석의 최종 `PlateResult`다.
- `STRIKE`는 타석 내부 누적 상태가 아니며 `strikeCount`, STRIKE 누적, 3 STRIKE OUT 및 동일 문장 즉시 재입력을 MVP 1에 포함하지 않는다.
- 각 결과 이후에는 문법 복습으로 이동한다.
- `OUT`만 `outCount`를 1 증가시키며 `outCount === 3`이면 현재 이닝 종료 조건이 충족된다.
- `SINGLE`, `DOUBLE`, `TRIPLE`, `HOME_RUN`은 `hit` 계열이고 `STRIKE`는 outCount를 증가시키지 않는 `non-hit`이다.

### 현재 구현됨

- PR #6이 `main`에 병합되어 React, TypeScript, Vite 기반의 최소 Frontend 개발 환경이 존재한다.
- PR #8이 `main`에 병합되어 전문가 에이전트 페르소나와 Product Decision 형식이 문서화되어 있다.
- `PlateResult`, fixture UI, `GameState`, Router, Backend 및 판정 알고리즘은 구현되어 있지 않다.

### 제약

- 저장소에는 원본 기능 명세서와 원본 유저 플로우가 없으며, `AGENTS.md`와 기존 study 문서에서 그 핵심 규칙과 흐름만 확인할 수 있다.
- 실제 사용자 데이터와 사용성 검증 결과가 없으므로 반복 입력의 학습 효과나 STRIKE 표현의 이해도를 사실로 확정할 수 없다.

### 미결정

- 시즌 타율의 구체적인 계산 공식
- `STRIKE`가 시즌 타율에서 갖는 구체적인 계산 의미
- 결과별 production 판정 알고리즘과 threshold

## 대안

### Option A — STRIKE를 한 타석의 최종 판정으로 사용

흐름은 `문장 제출 → STRIKE → 문법 복습 → 다음 타석`이다. 문장 제출 한 번으로 공식 타석 하나를 종료하며 별도 `strikeCount`는 만들지 않는다.

- 학습 효과: 결과 직후 문법 복습으로 이동하므로 현재 피드백 순서를 유지한다. 동일 문장 반복 학습은 보장하지 않지만 별도 반복 정책을 임의로 만들지 않는다.
- 사용자 이해도: 모든 결과가 동일한 화면 전환 규칙을 따르므로 다음 행동이 일관된다. 다만 실제 야구의 STRIKE와 다른 의미라는 설명이 필요하다.
- 학습 지속성: 실패 결과 뒤에도 복습과 다음 문장으로 빠르게 이어진다.
- 야구 게임화: 결과명은 직관적일 수 있으나 누적 스트라이크라는 실제 야구 기대와 어긋날 위험이 있다.
- 개발 복잡도: 기존 루프와 결과 union만으로 fixture UI를 만들 수 있다.
- MVP 범위: 새로운 재시도·기록·상태 정책을 추가하지 않는다.

### Option B — STRIKE를 같은 타석 내부의 누적 상태로 사용

흐름은 `문장 제출 → STRIKE → 같은 문장 재시도`이며, 3 STRIKE를 OUT으로 처리하려면 추가 규칙이 필요하다.

- 학습 효과: 같은 문장을 다시 입력하게 할 수 있으나, 반복 횟수와 피드백 시점이 정해지지 않으면 단순 재입력에 그칠 수 있다.
- 사용자 이해도: 실제 야구 기대에는 가깝지만 타석 결과 화면인지 재시도 안내인지 구분해야 한다.
- 학습 지속성: 성공까지 재시도하도록 설계할 수 있지만 한 문장에 머무는 시간과 실패 피로가 증가할 수 있다.
- 야구 게임화: `strikeCount`와 3 STRIKE OUT이 실제 야구 메타포에 더 가깝다.
- 개발 복잡도: `strikeCount`, 재시도 기록, 공식 타석 집계 시점, 문법 복습 진입 시점, 중단·복귀 규칙이 추가된다.
- MVP 범위: 현재 Source of Truth에 없는 상태와 정책을 새로 결정해야 하므로 범위가 증가한다.

## 전문가 검토

아래 내용은 사용자 승인 전에 Option A를 도출한 검토 기록이며, 당시의 `제안` 표기를 의사결정 과정으로 보존한다. 현재 Product Decision의 상태는 문서 상단과 `결정` 섹션에 기록된 `확정됨`을 따른다.

### Agent A — AI Product Lead

**제안:** Option A를 채택한다. 현재 핵심 루프를 유지하면서 구현자가 미정 정책을 채우지 않아도 되는 최소 결정이다. 다만 근거 문서에 STRIKE 세부 의미가 확정되어 있지 않으므로 사용자 승인 전에는 `확정됨`으로 표시하지 않는다.

### Agent B — English Learning Designer

**해석:** Option A는 모든 제출 뒤 결과와 문법 복습을 제공하는 일관된 피드백 순서를 보존한다. Option B의 반복 입력은 학습적 가치가 있을 수 있지만 재시도 목적, 교정 피드백, 완료 조건이 함께 설계되어야 하며 현재 근거만으로 효과를 확정할 수 없다.

### Agent C — UX / Service Product Designer

**제안:** MVP에서는 모든 `PlateResult`가 타석 종료를 뜻하고 다음 단계가 문법 복습이라는 단일 규칙을 사용한다. STRIKE 화면에는 결과 근거와 다음 행동을 함께 보여 사용자가 같은 문장을 즉시 재입력해야 한다고 오해하지 않도록 한다.

### Agent D — Gamification & Motivation Designer

**제안:** 실제 야구 재현보다 영어 학습 흐름을 우선해 Option A를 사용한다. 다만 STRIKE가 누적되지 않고 OUT과도 다르다는 사실을 결과 설명과 상태 표시에서 일관되게 전달해야 한다.

### Agent G — Senior Product / Service Planner

**제안:** `PlateResult`를 `STRIKE | OUT | SINGLE | DOUBLE | TRIPLE | HOME_RUN`의 타석 종료 상태로 명세한다. `OUT`만 `outCount`를 1 증가시키고 네 안타 결과는 `hit` 계열로 분류한다. 시즌 타율 계산과 판정 알고리즘은 별도 Product Decision으로 분리한다.

### Senior Product Engineer — 기술 가능성 검토

**현재 구현됨:** Frontend 기반은 있으나 경기 상태는 없다. **해석:** Option A는 fixture 기반 결과 UI를 추가 상태 정책 없이 구현할 수 있다. 이 검토는 제품 규칙을 확정하지 않는다.

## 충돌과 우선순위

Option B는 실제 야구의 누적 스트라이크 메타포와 동일 문장 반복 가능성을 강화한다. 반면 현재 확정된 학습 루프를 바꾸고 여러 미정 정책을 동시에 도입한다.

제품 판단 우선순위인 영어 학습 효과, 사용자 이해도, 학습 지속성, 야구 게임화 순으로 비교하면, 검증되지 않은 반복 효과와 야구 규칙 충실도보다 일관된 피드백 흐름과 다음 행동의 명확성이 우선한다. 따라서 MVP 1에는 Option A가 더 적합하다. STRIKE라는 명칭의 오해 위험은 상태 누적을 추가하는 대신 결과 근거와 다음 행동을 명시하는 방식으로 관리한다.

## 결정

**확정됨:** 문장 제출 1회는 공식 타석 1회를 종료하며, `STRIKE`, `OUT`, `SINGLE`, `DOUBLE`, `TRIPLE`, `HOME_RUN`은 모두 해당 타석의 최종 `PlateResult`다. `STRIKE` 이후에는 문법 복습으로 이동하고 `strikeCount`는 만들지 않는다. `OUT`만 `outCount`를 1 증가시키며 `SINGLE`, `DOUBLE`, `TRIPLE`, `HOME_RUN`은 모두 `hit` 계열로 분류한다.

사용자가 2026-09-03에 위 상태 의미와 기본 상태 전이를 TATATA MVP 1의 제품 규칙으로 명시적으로 승인했다.

## 확정된 상태 전이

| 현재 행동 | PlateResult | 타석 종료 | 다음 단계 | outCount 변화 | 결과 분류 |
|---|---|---:|---|---:|---|
| 문장 제출 | `STRIKE` | 예 | 문법 복습 | +0 | non-hit |
| 문장 제출 | `OUT` | 예 | 문법 복습 | +1 | out |
| 문장 제출 | `SINGLE` | 예 | 문법 복습 | +0 | hit |
| 문장 제출 | `DOUBLE` | 예 | 문법 복습 | +0 | hit |
| 문장 제출 | `TRIPLE` | 예 | 문법 복습 | +0 | hit |
| 문장 제출 | `HOME_RUN` | 예 | 문법 복습 | +0 | hit |

`OUT` 적용 결과 `outCount`가 3이면 문법 복습 이후 현재 이닝을 종료하고 이닝 결과로 이동한다. 다음 이닝이 있다면 시작 시 `outCount`를 0으로 초기화하고, 마지막 이닝이었다면 Game Complete로 전환한다. 문법 복습과 이닝 결과의 정확한 화면 전환 타이밍은 기존 핵심 루프를 따르되 후속 구현 Issue에서 화면 단위로 검증한다.

## 필수 질문 답변

1. **Q1 — 문장 한 번 제출은 하나의 공식 타석을 종료하는가?**
   **확정됨:** 그렇다. 제출 1회가 공식 타석 1회를 종료한다.
2. **Q2 — STRIKE는 최종 PlateResult인가, 타석 내부 상태인가?**
   **확정됨:** 최종 `PlateResult`다. 타석 내부 상태나 누적 카운트가 아니다.
3. **Q3 — STRIKE가 발생했을 때 다음 화면은 무엇인가?**
   **확정됨:** 타석 결과를 확인한 뒤 문법 복습으로 이동한다. 같은 문장 즉시 재시도는 하지 않는다.
4. **Q4 — STRIKE는 outCount를 증가시키는가?**
   **확정됨:** 증가시키지 않는다.
5. **Q5 — OUT만 outCount + 1을 발생시키는가?**
   **확정됨:** 그렇다. 현재 결과 집합에서는 `OUT`만 증가시킨다.
6. **Q6 — SINGLE / DOUBLE / TRIPLE / HOME_RUN은 모두 hit로 취급하는가?**
   **확정됨:** 그렇다. 네 결과를 모두 `hit` 계열로 분류한다.
7. **Q7 — 현재 결정만으로 다음 Plate Result fixture UI를 구현할 수 있는가?**
   **확정됨:** 가능하다. fixture는 여섯 결과, 결과 근거, 타석 종료, 문법 복습 CTA, OUT일 때의 outCount 표시를 표현할 수 있다. production 판정식은 구현할 수 없다.
8. **Q8 — 여전히 별도 Product Decision이 필요한 사항은 무엇인가?**
   **미결정:** 판정 threshold와 공식, 신규 사용자 속도 baseline, 시즌 타율 계산식, 콘텐츠 정답·대소문자·문장부호·오타 정책, 반복 학습 정책, 베이스·주자·타점·득점 규칙이다.

## MVP 범위

### 포함

- 문장 제출과 공식 타석 종료의 관계
- 여섯 `PlateResult`의 최종 상태 여부
- STRIKE 이후 문법 복습 이동
- `OUT`의 `outCount + 1` 규칙
- 네 안타 결과의 `hit` 계열 분류
- fixture UI 구현에 필요한 상태 의미

### 제외

- React UI, fixture, `GameState`, Router, Backend, API와 테스트 코드 구현
- production 판정 알고리즘과 모든 threshold
- 시즌 타율의 구체적인 계산 공식
- 신규 사용자 속도 baseline
- 동일 문장 재시도 및 3 STRIKE OUT
- runner/base advancement, 타점, 득점과 실제 야구 규칙 확장
- 콘텐츠 정답, 대소문자, 문장부호 및 오타 허용 정책

### 후속 검토

- PlateResult 판정 알고리즘 Product Decision
- 시즌 기록 및 타율 계산 Product Decision
- 입력 정답 및 오타 처리 Product Decision
- 필요성이 검증될 경우 반복 학습 정책 Product Decision

## 구현 영향

다음 Plate Result fixture UI Issue에서는 아래 범위를 구현할 수 있다.

- `STRIKE | OUT | SINGLE | DOUBLE | TRIPLE | HOME_RUN` 결과 fixture
- 모든 결과를 타석 종료 상태로 표시
- `accuracy`, `relative typing speed`, `difficulty`에 관한 fixture 근거 표시
- 결과 확인 후 문법 복습으로 이동하는 CTA
- `OUT` fixture에서만 증가한 outCount 표시
- 네 안타 결과의 공통 `hit` 분류를 이용한 표현

다음 항목은 아직 구현하면 안 된다.

- 실제 입력값으로 결과를 산출하는 production 로직
- 임의의 정확도·속도·난이도 threshold
- `strikeCount`, STRIKE 재시도 및 3 STRIKE OUT
- 구체적인 시즌 타율 계산
- 베이스, 주자, 타점 및 득점 상태 변화
- 확정되지 않은 정답·오타 처리

## 검증 방법

- Source of Truth에 명시된 공식 타석, 결과 근거, 3 OUT, 이닝 초기화와 핵심 학습 루프를 문서 내용과 대조한다.
- 참여 역할을 Agent A, B, C, D, G와 기술 가능성만 확인하는 Senior Product Engineer로 제한한다.
- 여섯 결과 각각의 타석 종료, 다음 단계, outCount 변화와 hit 분류가 상태 전이 표에 빠짐없이 존재하는지 확인한다.
- threshold, baseline, 판정식 및 실제 야구 확장 규칙이 결정된 값으로 추가되지 않았는지 확인한다.
- 변경 파일이 이 Product Decision 문서 하나뿐인지 확인한다.
- `git diff --check`를 실행한다.
- Issue #11의 작업 commit이 정확히 하나인지 확인한다.

## UX 검증 사항

STRIKE는 실제 야구에서 누적 상태로 이해되는 경우가 일반적이므로, 사용자가 TATATA의 최종 결과 상태를 같은 의미로 받아들이지 못할 가능성이 있다. 이 위험은 승인된 Product Decision을 미결정으로 되돌리지 않으며, 향후 PlateResult UI 사용성 검증에서 다음을 확인한다.

1. 사용자가 현재 `PlateResult`를 즉시 식별하는가
2. `accuracy`, `relative typing speed`, `difficulty`를 근거로 결과 이유를 이해하는가
3. 다음 행동이 동일 문장 재입력이 아니라 문법 복습임을 이해하는가

STRIKE 명칭의 실제 사용자 이해도는 **검증되지 않음**이며, production 상태 규칙과 구분한다.

## 미결정 사항

- STRIKE가 시즌 타율 계산에서 어떤 분모·분자 의미를 갖는지
- 시즌 타율의 공식과 hit 분류를 기록에 반영하는 방식
- 결과별 판정 threshold, 상대 속도 계산과 난이도 보정 공식
- 신규 사용자 baseline speed 생성 방식
- HOME_RUN 발생 조건, 희소성 또는 확률
- 각 결과를 결정하는 production 판정 알고리즘
- 콘텐츠별 정답, 대소문자, 문장부호와 오타 허용 정책
- 향후 같은 문장 반복 학습이 필요한지와 그 진입·종료 규칙
- 베이스, 주자, 타점, 득점 등 MVP 밖 야구 상태

## 확인한 Source of Truth

- 현재 사용자가 제공한 Issue 요청 및 최신 명시적 방향
- `AGENTS.md`
- `study/2026-09-03-expert-agent-personas.md`
- `study/2026-09-03-repository-guardrails-and-design-planning.md`
- `study/2026-09-03-frontend-foundation.md`
- `README.md`
- `origin/main`의 PR #6 및 PR #8 병합 이력
- PR #10의 병합 및 Issue #9의 완료 상태
- 2026-09-03 사용자의 PlateResult Product Decision 명시적 승인

기존 문서에서 STRIKE의 다섯 세부 규칙과 직접 충돌하는 확정 규칙은 발견하지 못했다. 충돌은 확정 규칙 간의 모순이 아니라, `STRIKE`가 결과 후보로 존재하면서 그 상태 의미가 비어 있는 명세 공백이다.
