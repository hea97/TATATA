# 2026-09-04 문장 타석 데이터 및 제출 상태 계약 학습 기록

## 1. 오늘 무엇을 만들었는가

문장 타석에서 사용자가 입력 중인 상태와 제출을 마친 상태를 TypeScript로 구분했다. 제출된 타석과 경기 context snapshot을 기존 `PlateResultFixture`로 변환하는 adapter도 추가했다.

이번 작업은 문장 타이핑 화면이나 실제 상태 전이를 구현한 것이 아니다. 다음 흐름을 연결하기 전에 필요한 데이터 경계를 정의한 작업이다.

```text
문장 타석 → 제출 완료 → fixture 기반 PlateResult 전달 → PlateResultScreen
```

## 2. Data Contract

Data Contract는 서로 다른 코드 영역이 주고받는 데이터의 형태와 의미에 대한 약속이다. `SentenceAtBatSubmittedState`는 제출 완료 시 target text, typed text, measurement와 최종 `PlateResult`가 반드시 존재한다는 계약이다.

계약은 값을 계산하는 방법까지 정하지 않는다. 현재 measurement는 fixture가 제공하며 accuracy나 relative speed 계산식은 없다.

## 3. State Modeling과 Domain State

State Modeling은 제품에서 의미 있는 상태와 각 상태가 가질 수 있는 데이터를 코드로 표현하는 일이다. 이번에 다루는 domain state는 정확히 `typing`과 `submitted` 두 개다.

```ts
type SentenceAtBatState =
  | SentenceAtBatTypingState
  | SentenceAtBatSubmittedState
```

Domain State는 화면 모양이 아니라 제품에서 현재 어떤 일이 성립하는지를 나타낸다. `typing`은 아직 공식 타석이 끝나지 않았고 결과가 없는 상태다. `submitted`는 문장 제출로 공식 타석이 종료되어 measurement와 최종 결과가 존재하는 상태다.

## 4. boolean과 Discriminated Union 비교

다음 boolean 모델은 상태별 필드 관계를 충분히 표현하지 못한다.

```ts
interface UnsafeState {
  isSubmitted: boolean
  result?: PlateResult
}
```

이 구조는 `isSubmitted: false`인데 result가 있거나, `isSubmitted: true`인데 result가 없는 모순을 허용한다.

Discriminated Union은 공통 판별자 `status`의 값에 따라 사용할 수 있는 필드를 나눈다.

```ts
interface SentenceAtBatTypingState {
  status: 'typing'
  targetText: string
  typedText: string
}

interface SentenceAtBatSubmittedState {
  status: 'submitted'
  targetText: string
  typedText: string
  measurement: SentenceAtBatMeasurement
  result: PlateResult
}
```

따라서 typing 상태에는 measurement와 result가 존재하지 않고, submitted 상태에서는 두 값이 필수다. 코드는 `status`를 확인한 뒤 해당 상태에 맞는 필드만 안전하게 사용할 수 있다.

## 5. Measurement Contract

`SentenceAtBatMeasurement`에는 현재 연결에 필요한 최소 데이터만 둔다.

```ts
interface SentenceAtBatMeasurement {
  accuracy: number
  relativeSpeedPercent: number
}
```

이 타입은 측정 결과의 전달 형태만 정의한다. accuracy 계산 기준, 타이핑 시작·종료 시점, WPM, 신규 사용자 baseline과 difficulty는 정의하지 않는다.

## 6. GameContextSnapshot을 분리한 이유

`inning`과 `outs`는 PlateResult 화면에 필요하지만 문장 입력 자체의 데이터는 아니다. 이를 `SentenceAtBatState`에 넣으면 타이핑 도메인과 경기 진행 상태가 섞인다.

`GameContextSnapshot`은 adapter가 결과 화면용 fixture를 만들 때 읽는 별도 snapshot이다. 실제 GameState, OUT 증가, 3 OUT 처리나 이닝 전이는 구현하지 않았다.

## 7. Adapter

Adapter는 한 계약의 데이터를 다른 계약이 기대하는 형태로 변환한다.

```text
SentenceAtBatSubmittedState
→ toPlateResultFixture
→ PlateResultFixture
→ PlateResultScreen
```

`toPlateResultFixture`는 submitted state에서 result와 measurement를, game context에서 inning과 outs를 읽어 그대로 반환한다. 값을 결정하거나 상태를 변경하지 않는다.

Adapter가 accuracy를 보고 PlateResult를 판정하면 아직 승인되지 않은 production 알고리즘이 변환 코드에 숨어든다. OUT을 보고 outs를 증가시키면 adapter가 GameState 책임까지 갖게 된다. 그래서 adapter는 transform만 하고 decide 또는 mutate하지 않는다.

## 8. Fixture와 현재 데이터 흐름

현재 구현 흐름은 다음과 같다.

```text
fixture
→ submitted state
→ adapter
→ PlateResultFixture
→ PlateResultScreen
```

typing fixture에는 target text와 일부 typed text만 있다. submitted fixture에는 완성된 typed text, fixture measurement와 final result가 있다. `96%`와 `DOUBLE` 사이에는 production 판정 의미가 없다.

미래의 production 흐름은 다음과 같을 수 있지만 아직 구현하지 않았다.

```text
사용자 입력
→ measurement
→ 승인된 판정 알고리즘
→ submitted state
→ adapter
→ PlateResultScreen
```

두 흐름을 구분하면 fixture를 실제 판정 규칙으로 오해하지 않고 UI와 데이터 연결을 먼저 검증할 수 있다.

## 9. SentenceAtBatState와 PlateResultScreen의 역할 차이

`SentenceAtBatState`는 문장 타석의 현재 domain state와 상태별 데이터 계약이다. React component가 아니며 화면을 렌더링하지 않는다.

`PlateResultScreen`은 이미 계산된 `PlateResultFixture`를 props로 받아 표시하고 CTA callback을 전달하는 Presentational Component다. 문장 입력 상태, measurement 계산, 결과 판정 또는 GameState를 소유하지 않는다.

## 10. Test

계약 및 adapter 테스트 3개를 추가했다.

- typing fixture에 measurement와 result가 없는지 확인
- submitted fixture에 measurement와 final result가 존재하는지 확인
- adapter가 result, accuracy, relativeSpeedPercent, inning과 outs를 정확히 전달하는지 확인

기존 PlateResult rendering, metric, context와 CTA 테스트도 함께 실행하여 회귀가 없는지 확인했다. 전체 결과는 test file 3개, test 13개 통과다.

## 11. 오류와 해결

구현 및 최종 검증 과정에서 새로 발생한 코드 오류는 없었다.

## 12. 실제 검증

- `npm ci`: lockfile 기준 설치 완료
- `npm run lint`: 통과
- `npm test`: test file 3개, test 13개 통과
- `npm run build`: production build 성공
- `git diff --check`: commit 전 별도 확인
- Browser visual review: 사용자 UI를 변경하지 않아 실행하지 않음

## 13. 다음 학습

- controlled input
- React local state
- submit event
- `typing → submitted` 실제 state transition
- fixture measurement를 이용한 문장 타석과 PlateResult 연결
- 연결된 사용자 흐름의 integration test

다음 Issue에서는 실제 accuracy 계산 없이 fixture measurement와 final result를 주입하여 문장 입력, 제출과 기존 PlateResult 화면을 하나의 세로 흐름으로 연결할 수 있다.
