# Grammar Review Fixture UI와 PlateResult 연결

## 구현한 학습 흐름

이번 작업으로 MVP 1의 앞부분은 다음과 같이 연결되었다.

```text
SentenceAtBat
→ PlateResult
→ GrammarReview
```

사용자는 목표 문장을 입력하고 fixture 판정을 확인한 뒤, 기존 `문법 복습하기` 버튼으로 방금 학습한 원문의 문법 설명을 볼 수 있다. 문법 복습은 공식 타석이 아니며 타석 결과나 경기 상태를 바꾸지 않는다.

## Feature Boundary

`grammar-review` feature는 문법 콘텐츠 계약, fixture와 표시 화면만 소유한다. 문장 입력 및 결과 화면은 기존 feature에 남겨 두고, 두 feature의 전환은 `learning` feature의 작은 상위 flow가 담당한다.

이 경계를 통해 문법 화면에 경기 진행 규칙이나 문장 제출 상태가 섞이지 않는다.

## Presentational Component

`GrammarReviewScreen`은 다음 props만 받는다.

```ts
interface GrammarReviewScreenProps {
  content: GrammarReviewContent
  onContinue: () => void
}
```

화면의 책임은 콘텐츠를 의미 있는 heading, description list, list 구조로 표시하고 실제 button에서 callback을 호출하는 것뿐이다. 다음 목적지나 이닝 종료 여부는 판단하지 않는다.

## Fixture Content

`GrammarReviewContent`는 현재 UI에 필요한 최소 데이터만 표현한다.

```ts
interface GrammarReviewContent {
  sentence: string
  patternName: string
  explanationKo: string
  vocabularyUsage: GrammarVocabularyUsage[]
  examples: string[]
}
```

fixture에는 현재 문장 타석과 일치하는 원문, 현재시제와 빈도 표현 설명, `practice` 사용법과 두 개의 짧은 예문을 담았다. production 문법 분석이나 API가 없으므로 검증 가능한 고정 콘텐츠를 사용한다.

## targetText와 typedText

`targetText`는 학습자가 이해해야 할 정확한 원문이고, `typedText`는 사용자가 타석에서 실제로 입력한 응답이다. 문법 설명의 기준은 오타나 미완성 입력이 아니라 학습 대상인 `targetText`여야 한다.

상위 flow는 문법 콘텐츠를 렌더링할 때 `sentence`를 `initialAtBatState.targetText`로 지정한다. 따라서 fixture의 다른 설명을 재사용하면서도 화면에 표시되는 원문이 현재 타석과 어긋나지 않는다.

## Parent Orchestration과 Conditional Rendering

`AtBatLearningFlow`는 이번 Issue에 필요한 두 단계만 가진다.

```text
at-bat
→ grammar-review
```

`at-bat` 단계에서는 기존 `SentenceAtBatFlow`를 그대로 렌더링한다. PlateResult의 callback이 실행되면 부모의 local state를 `grammar-review`로 바꾸고 `GrammarReviewScreen`을 조건부 렌더링한다.

```text
PlateResultScreen
→ onReviewGrammar
→ parent flow
→ GrammarReviewScreen
```

Router를 추가하지 않아도 현재의 짧은 화면 전환을 명시적으로 표현할 수 있으며, 기존 SentenceAtBat 내부 책임도 확장하지 않는다.

## Callback과 다음 단계 경계

`GrammarReviewScreen`의 `계속하기` 버튼은 `onContinue()`만 호출한다. App preview에서는 후속 화면이 아직 없으므로 safe no-op callback을 제공한다.

향후 흐름은 경기 상태에 따라 달라진다.

```text
GrammarReview
→ GameState 확인
├→ 다음 단어 학습
└→ Inning Result
```

이 분기를 현재 UI가 추측하면 GameState와 이닝 규칙이 중복된다. 실제 분기는 후속 Product & Engineering Issue에서 정의한다.

## Separation of Concerns

- `SentenceAtBatFlow`: 입력과 제출, PlateResult까지 담당
- `PlateResultScreen`: 결과 표시와 문법 복습 callback 전달
- `AtBatLearningFlow`: at-bat과 grammar-review 단계 전환
- `GrammarReviewScreen`: 문법 콘텐츠 표시와 continue callback 전달

Grammar Review 진입은 accuracy, relative speed, PlateResult, typedText, OUT 또는 inning을 수정하지 않는다.

## Integration Test와 Component Test

component test는 `GrammarReviewScreen` 단독으로 원문, 패턴, 설명, 단어 사용, 모든 예문과 callback을 확인한다.

integration test는 실제 사용자 흐름처럼 문장을 일부 또는 틀리게 입력하고 제출한 뒤 PlateResult의 버튼을 눌러 Grammar Review로 전환되는지 확인한다. 또한 오답 `typedText`가 아니라 정확한 `targetText`가 표시되고, continue 동작이 부모 callback 경계에서 멈추는지 검증한다.

## 실제 검증 결과

- `npm ci --prefer-offline --no-audit --no-fund`: 성공
- `npm run lint`: 성공, 경고 없음
- `npm test`: 6개 파일, 24개 테스트 성공
- `npm run build`: 성공
- desktop: 입력 → 제출 → PlateResult → Grammar Review 흐름과 전체 콘텐츠 확인
- 390px: 원문, 한국어 설명, 단어 사용, 예문, CTA 및 가로 overflow 없음 확인
- browser console warning/error: 없음

## 이번 범위에서 남긴 항목

- missing grammar content fallback
- grammar viewed analytics 및 persistence
- GameState와 이닝 전이
- OUT mutation과 3 OUT 처리
- 다음 단어 학습 및 Inning Result 분기
- production 문법 분석

구현 과정에서 별도의 상태 머신은 필요하지 않았다. 현재 두 단계는 문자열 union 기반 local state로 충분했고, 더 많은 경기 단계가 실제로 추가될 때 상태 모델을 확장하는 편이 적절하다.
