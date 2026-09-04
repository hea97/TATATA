# 2026-09-03 PlateResult fixture 기반 결과 UI 학습 기록

## 1. 오늘 무엇을 만들었는가

TATATA MVP 1의 첫 제품 UI로 PlateResult 결과 화면을 만들었다. 화면은 미리 준비한 fixture 하나를 props로 받아 이번 타석 결과, 정확도, 평소 대비 타이핑 속도, 현재 이닝과 OUT을 표시한다. 사용자가 결과 확인 후 이동해야 할 다음 단계는 `문법 복습하기` 버튼 하나로 제시한다.

App에서는 DOUBLE fixture를 사용해 `2루타` 결과를 preview한다. STRIKE, OUT, SINGLE, DOUBLE, TRIPLE, HOME_RUN 여섯 결과는 모두 같은 `PlateResultScreen` 구조로 렌더링하고 자동 테스트로 확인한다.

## 2. 왜 fixture로 UI를 구현했는가

PlateResult의 상태 의미는 확정되었지만 accuracy, relative typing speed와 difficulty를 결과로 변환하는 production 알고리즘과 threshold는 아직 미결정이다. UI가 실제 알고리즘을 기다리면 사용자가 결과와 학습 지표, 다음 행동을 이해할 수 있는지 검증할 수 없다.

fixture는 결과가 이미 결정되었다고 가정한 입력이다. 따라서 미정 판정식을 코드에 숨기지 않고도 결과 화면의 구조와 표현, 접근성, callback을 먼저 구현하고 테스트할 수 있다. fixture의 숫자와 결과 사이에는 production 의미가 없다.

## 3. 핵심 개념

### TypeScript Union Type

`PlateResult`는 다음 여섯 문자열만 허용하는 union type이다.

```ts
type PlateResult =
  | 'STRIKE'
  | 'OUT'
  | 'SINGLE'
  | 'DOUBLE'
  | 'TRIPLE'
  | 'HOME_RUN'
```

임의 문자열이 결과로 들어오는 것을 컴파일 단계에서 막고, 모든 결과의 한국어 표시명과 fixture가 빠짐없이 존재하는지 `Record<PlateResult, ...>`로 검사할 수 있다.

### Props

Props는 부모가 컴포넌트에 전달하는 입력이다. `PlateResultScreen`은 `fixture`와 `onReviewGrammar`를 받아 표시 데이터와 다음 행동을 외부에서 주입받는다. 화면 자체는 데이터가 어떻게 계산되었는지 알지 않는다.

### Fixture

fixture는 특정 화면과 동작을 재현할 수 있도록 고정한 테스트용 데이터다. TATATA의 `plateResultFixtures`에는 여섯 결과별 accuracy, relative speed, inning과 outs가 있다.

- mock은 실제 의존성을 대신하는 넓은 개념이며 함수나 모듈의 가짜 동작도 포함한다.
- fixture는 반복 가능한 검증을 위해 준비한 구체적인 고정 데이터다.
- production data는 실제 사용자 입력과 승인된 비즈니스 로직을 통해 생성되는 운영 데이터다.

현재 숫자는 UI 검증용 fixture이며 결과 판정 기준이 아니다.

### Presentational Component

Presentational Component는 받은 데이터를 화면에 표현하고 사용자 행동을 callback으로 알리는 데 집중한다. `PlateResultScreen`은 결과를 계산하거나 OUT을 변경하거나 화면 이동을 결정하지 않는다. 덕분에 여섯 결과를 같은 구조로 재사용하고 각 책임을 분리할 수 있다.

### Callback

Callback은 자식 컴포넌트에서 발생한 행동을 부모에 알리는 함수다. `문법 복습하기` 버튼은 `onReviewGrammar`를 호출한다. 지금은 App이 no-op callback을 전달하고, 후속 학습 흐름 연결 작업에서 실제 전환 행동을 주입할 수 있다.

### Conditional Rendering과 표시 변환

이번 화면은 결과마다 레이아웃을 조건부로 나누지 않는다. 결과 union을 한국어 label map에 연결하고, 양수 relative speed일 때만 `+` 기호를 붙이는 최소 표시 변환만 사용한다. 결과별 별도 화면이나 판정 조건은 만들지 않았다.

### CSS Modules

CSS Module은 클래스 이름을 컴포넌트 범위로 제한한다. 전역 CSS에는 기본 box sizing, 배경과 focus 표시만 두고, 결과 카드의 layout과 style은 `PlateResultScreen.module.css`에 둔다. 별도 styling dependency 없이 네이비, 제한적인 빨간 강조, 밝은 종이 배경과 단순 border로 최소 브랜드 방향을 표현했다.

### React Testing Library

React Testing Library는 내부 구현보다 사용자가 찾는 heading, text와 button을 기준으로 화면을 검증한다. 결과명은 heading으로, CTA는 실제 button role로 조회하여 의미 구조와 동작을 함께 확인했다.

## 4. 데이터 흐름

이번에 구현한 흐름은 다음과 같다.

```text
fixture → props → PlateResultScreen → 사용자 표시
                         ↓
                  callback 호출
```

이번에 구현하지 않은 흐름은 다음과 같다.

```text
사용자 문장 입력 → production algorithm → PlateResult
```

문장 입력, 판정 알고리즘, GameState, 실제 문법 복습 화면과 navigation은 후속 작업이다.

## 5. 왜 algorithm과 UI를 분리했는가

판정식이 확정되지 않은 상태에서 UI 코드에 accuracy 조건이나 HOME_RUN threshold를 넣으면 fixture가 production 규칙처럼 굳어진다. 화면은 확정된 결과 데이터를 표현하는 책임만 갖고, 판정 책임은 별도 Product Decision과 후속 구현에 남겼다.

이 분리는 UI 검증을 먼저 가능하게 하면서 미확정 제품 규칙이 코드에 몰래 들어가는 것을 방지한다. 또한 나중에 데이터 출처가 fixture에서 실제 판정 결과로 바뀌어도 `PlateResultScreen`의 props 계약은 유지할 수 있다.

## 6. Test

자동 테스트에서는 다음을 확인했다.

- 여섯 `PlateResult`가 각각 올바른 한국어 결과명으로 렌더링된다.
- DOUBLE fixture의 정확도 `96%`와 양수 상대 속도 `+8%`가 표시된다.
- TRIPLE fixture의 이닝과 OUT 값이 계산 없이 그대로 표시된다.
- `문법 복습하기` 버튼 클릭 시 `onReviewGrammar` callback이 한 번 호출된다.
- App preview가 `2루타` 결과와 CTA를 표시하고 기존 Foundation placeholder는 제거되었다.

테스트 결과는 test file 2개, test 10개 통과다.

## 7. 오류와 해결

로컬 npm 설정이 존재하지 않는 사용자 prefix의 `npm-cli.js`를 가리켜 일반 npm 명령이 실패했다. 이전 Frontend Foundation 작업과 동일하게 현재 검증 프로세스에만 시스템 Node.js prefix를 지정해 전역 설정이나 프로젝트 파일을 변경하지 않고 해결했다.

첫 테스트 실행에서는 parameterized render 뒤 DOM이 정리되지 않아 이전 fixture가 누적되었고, 이후 테스트가 같은 text와 button을 여러 개 찾았다. 테스트 파일에 React Testing Library의 `cleanup`을 `afterEach`로 명시해 테스트 사이의 DOM 격리를 보장했다.

Browser 검증 뒤 다시 실행한 `npm ci`에서는 실행 중인 Vite 개발 서버가 Windows native binding 파일을 잠가 `EPERM`이 발생했다. 해당 저장소의 Vite 프로세스만 확인하여 종료한 뒤 `npm ci`를 다시 실행해 lockfile 기준 설치를 완료했다.

## 8. 실제 검증

- `npm ci`: lockfile 기준 설치 실행
- `npm run lint`: 통과
- `npm test`: test file 2개, test 10개 통과
- `npm run build`: production build 성공
- Browser desktop preview: 결과, 학습 지표, 경기 context와 CTA 렌더링 확인
- Browser 390px preview: metric 카드의 1열 전환과 전체 CTA 확인
- Browser console: warning/error 0건

## 9. 다음 학습

- 문장 타석 데이터와 상태 구조
- 문장 타석 fixture에서 PlateResult fixture로 데이터를 전달하는 방법
- GameState와 상태 전이
- Router와 실제 문법 복습 화면 연결
- 사용자가 STRIKE를 누적 상태로 오해하는지 확인하는 UX 검증

다음 구현 우선순위는 GameState 전체나 Backend보다 `문장 타석 → fixture result 전달 → PlateResult → 문법 복습`의 세로 학습 흐름을 연결하는 것이다. 이를 시작하기 전에 문장 타석 데이터와 상태 구조를 별도 Issue에서 설계해야 한다.
