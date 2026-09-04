# 2026-09-04 문장 타석 입력 UI와 Fixture Happy Path 학습 기록

## 1. 오늘 무엇을 만들었는가

사용자가 목표 영어 문장을 보고 직접 입력한 뒤 제출하면 기존 PlateResult 화면으로 전환되는 첫 Frontend happy path를 만들었다.

```text
목표 문장
→ controlled input
→ 제출
→ submitted state
→ adapter
→ PlateResultFixture
→ PlateResultScreen
```

실제 accuracy, typing speed와 PlateResult는 계산하지 않는다. 제출 결과에는 App에서 주입한 개발용 fixture measurement와 final result를 사용한다.

## 2. Controlled Component와 Controlled Input

Controlled Component는 입력값을 브라우저 DOM 자체에 맡기지 않고 React state로 관리하는 컴포넌트다. textarea의 `value`는 현재 `SentenceAtBatState`의 `typedText`이고, 사용자가 입력할 때 `onTypedTextChange` callback이 state를 갱신한다.

```text
사용자 입력
→ onChange
→ React state의 typedText 변경
→ textarea value 다시 렌더링
```

React state가 textarea의 Source of Truth이므로 화면의 입력값과 제출할 domain data가 서로 어긋나지 않는다.

## 3. React Local State

`SentenceAtBatFlow`는 `useState<SentenceAtBatState>`로 현재 타석 상태를 소유한다. 이 상태는 한 화면 흐름에만 필요하므로 Redux, Zustand나 global Context를 사용하지 않았다.

Local state는 사용자가 타이핑할 때 `typedText`를 보존하고, 제출 후 같은 state 자리에 `submitted` 상태를 넣어 렌더링 대상을 바꾼다.

## 4. Form Submit

입력과 제출은 `<form>`과 실제 `<button type="submit">`으로 구성했다. textarea에는 연결된 `<label>`이 있으며 placeholder를 label 대신 사용하지 않는다.

textarea에서 Enter는 줄바꿈으로 남겨두었다. 별도 keyboard shortcut이나 Router navigation은 추가하지 않았고, 사용자는 제출 버튼으로 form을 제출한다.

## 5. State Transition

이번에 구현한 상태 전이는 하나다.

```text
typing → submitted
```

`typing`일 때는 target text와 controlled `typedText`를 가진 입력 화면을 렌더링한다. 제출하면 현재 typedText를 보존한 `SentenceAtBatSubmittedState`를 만들고 fixture measurement와 result를 넣는다.

`submitted`가 되면 입력 화면 대신 adapter가 만든 fixture를 받는 `PlateResultScreen`을 렌더링한다. 기존 화면과 제출 버튼이 제거되므로 같은 타석에서 다시 제출할 경로가 없다. 별도의 `isSubmitting`이나 `hasSubmitted` 상태는 만들지 않았다.

## 6. Discriminated Union

기존 `SentenceAtBatState`의 `status`를 그대로 사용했다. `status === 'typing'`인 경우에만 입력 변경과 제출을 처리하고, `status === 'submitted'`이면 결과 화면을 렌더링한다.

이 구조는 하나의 boolean과 여러 optional field를 조합하는 것보다 현재 상태에서 가능한 데이터와 행동을 명확하게 제한한다.

## 7. Submit Gate

제출 가능 조건은 다음과 같다.

```ts
typedText.trim().length > 0
```

빈 문자열과 공백만 있는 입력은 버튼의 HTML `disabled` 속성으로 제출할 수 없다. 비공백 문자가 하나라도 있으면 목표 문장과 일치하지 않거나 오타가 있어도 제출 가능하다.

이 조건은 문장의 accuracy나 정답 여부를 판단하지 않는다. 단순히 사용자가 타석을 제출할 최소 입력이 있는지만 확인한다. 따라서 제출 가능 여부와 scoring은 서로 다른 문제다.

## 8. Fixture Injection

App은 `SentenceAtBatFlow`에 초기 typing fixture, game-context snapshot과 submission outcome fixture를 주입한다.

Submission outcome fixture는 다음 데이터만 가진다.

- accuracy: 96
- relativeSpeedPercent: 8
- result: DOUBLE

사용자가 정확한 문장, 일부 문장 또는 다른 문장을 입력해도 이 값은 같다. fixture는 UI 연결을 검증하기 위한 개발 데이터이며 입력을 평가한 결과가 아니다.

Fixture를 외부에서 주입하면 flow가 production 판정 알고리즘처럼 보이는 조건문을 갖지 않고, 이후 승인된 measurement와 scoring 구현으로 데이터 출처를 교체하기 쉬워진다.

## 9. Vertical Slice와 Happy Path

Vertical Slice는 사용자 행동에서 화면 결과까지 필요한 최소 계층을 세로로 연결하는 구현 단위다. 이번 작업은 입력 UI, React state, domain state, adapter와 결과 UI를 하나의 실제 동작으로 연결했다.

Happy path는 사용자가 정상적인 핵심 행동을 완료하는 가장 직접적인 경로다. 먼저 핵심 가치인 `영어 입력 → 제출 → 결과 확인`을 작동시키면 전체 GameState나 예외 정책을 미리 만들지 않고도 제품 경험과 구조를 검증할 수 있다.

## 10. 현재 흐름과 미래 흐름

현재 흐름:

```text
target sentence
→ controlled input
→ submit
→ fixture measurement/result
→ submitted state
→ adapter
→ PlateResultScreen
```

미래 흐름:

```text
target sentence
→ typing measurement
→ approved scoring logic
→ PlateResult decision
→ submitted state
→ adapter
→ PlateResultScreen
```

미래 흐름에 필요한 accuracy 계산, 타이핑 시간, baseline, difficulty와 threshold는 아직 구현하지 않았다.

## 11. Integration Test

Happy path 테스트는 여러 단위가 함께 동작하는 사용자 흐름을 검증한다.

- 초기 화면에서 목표 문장, textarea와 disabled 제출 버튼 확인
- 입력에 따라 controlled textarea value가 변경되는지 확인
- 공백 입력에서 disabled 유지 확인
- 비공백 한 글자에서 제출 활성화 확인
- 부분 입력 제출 후 fixture 결과, accuracy와 상대 속도 확인
- 오타·불일치 입력도 제출 가능한지 확인
- 제출 후 textarea와 제출 버튼이 제거되는지 확인
- submitted state 생성 시 typedText가 보존되는지 확인

기존 contract, adapter와 PlateResult 테스트도 함께 실행해 회귀를 확인했다.

## 12. 실제로 발생한 문제

첫 lint 실행에서 `SentenceAtBatFlow.tsx`가 React Component와 순수 상태 생성 helper를 함께 export하여 Fast Refresh 경고가 발생했다. `createSubmittedSentenceAtBatState`를 `sentenceAtBatTransition.ts`로 분리해 component module의 책임을 좁히고 lint 경고를 제거했다.

그 외 구현 및 브라우저 검증 중 새 오류는 발생하지 않았다.

## 13. Validation

- `npm ci`: 최종 코드에서 lockfile 기준으로 실행
- `npm run lint`: 경고 없이 통과
- `npm test`: test file 4개, test 20개 통과
- `npm run build`: production build 성공
- Desktop Browser: 초기 입력 화면, 공백 차단, 부분 입력 제출과 결과 전환 확인
- 390px Browser: 입력 화면과 결과 화면에서 horizontal overflow 없이 CTA 접근 확인
- Browser console: warning/error 0건
- `git diff --check`: commit 전 별도 확인

## 14. 다음 공부

- accuracy measurement와 정답 비교 정책
- typing speed measurement와 측정 시작·종료 시점
- 승인된 scoring domain logic와 integration boundary
- 문법 복습 데이터 계약과 화면
- PlateResult의 `문법 복습하기` callback 연결

다음 우선순위는 production scoring보다 문법 복습 화면과 fixture 기반 전환을 연결하여 `문장 입력 → 결과 → 문법 복습` 한 사이클을 완성하는 것이다.
