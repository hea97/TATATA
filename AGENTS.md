# TATATA Development Rules

## 1. Project Goal

TATATA는 야구의 경기와 시즌 기록 메타포를 활용한 한국어권 영어 타이핑 학습 서비스다.

제품의 중심은 영어 학습이다.

타이핑은 능동적 학습 인터페이스이고 야구 요소는 학습 동기와 성장 기록을 표현하기 위한 게임화 장치다.

실제 야구 리그, 구단, 선수 또는 특정 브랜드를 재현하는 서비스가 아니다.

## 2. Source of Truth

개발 시 다음 기준을 사용한다.

### 비즈니스 규칙

기능 명세서를 최우선 기준으로 사용한다.

예:

- 공식 타석 기준
- 안타 판정에 사용되는 데이터
- 3아웃 및 이닝 처리
- 시즌 타율 계산
- 회원/비회원 권한
- 컬렉션 해금 규칙

### 화면 이동과 사용자 여정

유저 플로우를 기준으로 사용한다.

### UI와 화면 구조

승인된 최신 디자인 또는 와이어프레임을 기준으로 사용한다.

### 최신 사용자 결정

사용자가 이후 명시적으로 변경한 결정은 기존 문서보다 우선한다.

문서 사이에 충돌이 있거나 구현에 필요한 비즈니스 규칙이 정의되지 않았다면 임의로 제품 규칙을 만들지 않는다.

## 3. Scope Control

현재 목표는 TATATA MVP 1이다.

MVP 범위를 임의로 확장하지 않는다.

다음과 같은 기능을 요청 없이 추가하지 않는다.

- AI 추천 시스템
- 소셜 기능
- 랭킹
- 실제 프로야구 데이터
- 실제 선수 또는 구단 데이터
- 복잡한 업적 시스템
- 모바일 앱
- 다국어 학습
- 필요하지 않은 관리자 시스템
- 대규모 리팩터링

현재 Issue 해결에 필요하지 않은 기능은 구현하지 않는다.

## 4. Git Workflow — CRITICAL

Git 관리 규칙은 프로젝트에서 가장 강한 개발 규칙 중 하나다.

### Main Branch

`main` branch에 직접 commit 또는 push하지 않는다.

모든 변경은 반드시 다음 과정을 거친다.

Issue → Branch → Implementation → Validation → Commit → Pull Request → Merge → Branch Delete

### One Issue Rule

기본 원칙:

1 Issue = 1 Branch = 1 Pull Request = 1 Commit

사소한 기능이라도 별개의 기능 Issue라면 별개의 작업으로 관리한다.

서로 다른 Issue의 코드를 하나의 Branch, Commit 또는 PR에 섞지 않는다.

### Branch Limit

동시에 존재하는 작업용 활성 branch는 최대 5개다.

5개 이상의 미병합 작업 branch를 생성하지 않는다.

새 Branch 생성 전 현재 활성 branch 수를 확인한다.

활성 branch가 이미 5개라면 새로운 branch를 만들지 않는다.

가능하면 의존성이 높은 기능은 병렬 개발하지 않고 앞선 PR을 main에 병합한 후 다음 작업을 시작한다.

### Branch Creation

모든 feature branch는 최신 main에서 생성한다.

작업 시작 전:

1. main으로 이동
2. 원격 main 업데이트
3. working tree clean 여부 확인
4. 현재 활성 작업 branch 확인
5. 새로운 Issue용 branch 생성

Branch naming:

- `feat/<issue-number>-<short-name>`
- `fix/<issue-number>-<short-name>`
- `chore/<issue-number>-<short-name>`

예:

- `feat/12-plate-result`
- `feat/13-inning-result`
- `fix/21-game-state-reset`
- `chore/1-project-guardrails`

## 5. Commit Rules

Commit 메시지는 영어를 기본으로 한다.

Conventional Commits 형식을 사용한다.

예:

- `feat(game): add plate result screen`
- `feat(game): add inning result screen`
- `feat(onboarding): add difficulty selection`
- `feat(collection): add word detail page`
- `fix(game): reset outs after inning`
- `chore(repo): add development workflow guardrails`

### Exactly One Commit per Issue

하나의 Issue는 최종적으로 하나의 작업 commit을 유지한다.

작업을 충분히 검증한 후 commit한다.

Commit 이후 PR을 만들기 전에 수정이 필요하면 가능하면 기존 commit을 amend한다.

필요한 경우 `git commit --amend`를 사용한다.

원격 branch가 존재하면 안전을 위해 `git push --force-with-lease`를 사용한다.

`--force`는 사용하지 않는다.

## 6. Pull Request Rules

PR은 반드시 한국어로 작성한다.

PR 하나는 Issue 하나만 해결한다.

PR에는 최소한 다음 내용을 포함한다.

- 무엇을 변경했는가
- 왜 변경했는가
- 주요 구현 내용
- 사용자 플로우
- 검증 방법
- 확인할 화면
- 관련 Issue

기본 병합 방식은 Squash merge를 권장한다.

## 7. README Language

README 및 사용자 대상 프로젝트 문서는 한국어를 기본 언어로 작성한다.

라이브러리명, API, 코드, 명령어, 기술 용어는 필요한 경우 영어를 유지할 수 있다.

README 전체를 영어로 변경하지 않는다.

## 8. Code Language

다음 항목은 영어를 기본으로 한다.

- variable names
- function names
- class names
- component names
- filenames
- API fields
- database fields

사용자에게 보이는 UI 문구는 한국어를 기본으로 한다.

## 9. Issue Scope Discipline

작업을 시작하기 전에 반드시 현재 Issue의 범위를 정의한다.

Issue에 포함되지 않은 문제를 발견하면 임의로 함께 수정하지 않는다.

현재 구현에 치명적이지 않다면 별도의 후속 Issue 후보로 기록한다.

다음은 금지한다.

- 기능 구현 중 unrelated refactoring
- 임의의 디자인 변경
- 필요 없는 dependency 추가
- 다른 화면의 코드까지 동시에 변경
- 아키텍처 전체 재설계

## 10. Existing Architecture

현재 저장소의 기술 스택과 구조를 먼저 확인한다.

사용자의 명시적 요청 없이 다음을 변경하지 않는다.

- framework
- package manager
- routing architecture
- state management
- database
- authentication system
- CSS strategy
- build system

기존 구조를 최대한 유지한다.

## 11. Product Rules

### English Learning First

학습 효과가 게임 표현보다 우선한다.

야구 요소 때문에 영어 학습 정보가 숨겨지거나 이해하기 어려워져서는 안 된다.

### Official At-Bat

공식 타석과 연습을 구분한다.

단어 연습과 문법 복습은 공식 타석 및 시즌 타율 계산에 포함하지 않는다.

문장 타석은 공식 타석이다.

### Plate Result

문장 타석 결과는 최소 다음 정보를 근거로 한다.

- accuracy
- relative typing speed
- difficulty adjustment

결과 화면에서는 사용자가 왜 해당 판정을 받았는지 이해할 수 있어야 한다.

### Important Algorithm Restriction

정확도, 상대 속도 및 난이도가 안타 결과에 영향을 준다는 원칙은 정의되어 있지만 구체적인 판정 threshold가 확정되지 않았다면 임의의 production 기준값을 만들지 않는다.

UI 개발 단계에서는 fixture 또는 mock 데이터를 사용할 수 있다.

구체적인 판정식이 필요한 경우 별도 Product Decision 또는 Issue로 분리한다.

### Inning

3 OUT이 되면 현재 이닝이 종료된다.

다음 이닝이 시작될 때 OUT은 0으로 초기화한다.

마지막 이닝이 종료되면 Game Complete 상태가 된다.

### Collection

컬렉션에는 실제 학습을 완료하여 해금된 콘텐츠만 표시한다.

단어 상세는 일반 영어 사전 페이지가 아니라 사용자의 학습 기록 페이지다.

가능한 경우 다음 기록을 보여준다.

- meaning
- pronunciation
- example
- accuracy
- attempts
- common mistakes

## 12. Copyright and Brand Safety

실제 프로야구 리그, 구단, 선수 또는 특정 스포츠 브랜드를 직접적으로 재현하지 않는다.

다음 요소를 무단으로 사용하지 않는다.

- team logos
- league logos
- official uniforms
- player likeness
- trademarked mascots
- recognizable proprietary graphics
- 특정 구단을 명확히 연상시키는 브랜드 자산 조합

야구공, 베이스, 홈플레이트, 스코어보드, 티켓, 기록지 등 일반적인 야구 개념은 독창적인 디자인으로 표현한다.

## 13. Dependency Rules

새 dependency를 추가하기 전에 기존 코드로 구현 가능한지 확인한다.

단순 UI 구현을 위해 무거운 library를 추가하지 않는다.

새 dependency가 반드시 필요하면 그 이유를 PR에 기록한다.

## 14. Validation Before Commit

Commit 전에 최소 다음을 확인한다.

1. 현재 Issue 범위만 변경되었는가
2. unrelated file이 포함되지 않았는가
3. lint가 통과하는가
4. test가 통과하는가
5. build가 통과하는가
6. 대상 사용자 플로우가 동작하는가
7. 기존 주요 플로우가 깨지지 않았는가
8. console error가 없는가
9. UI 문구와 기능 명세가 일치하는가

Repository에 해당 명령이 존재하는 경우 실제 명령을 실행한다.

명령을 추측하지 말고 `package.json` 또는 프로젝트 설정을 먼저 확인한다.

## 15. Definition of Done

Issue는 다음 조건을 모두 충족해야 완료로 판단한다.

- Issue 범위 구현 완료
- acceptance criteria 충족
- 테스트 또는 검증 완료
- build 성공
- unrelated 변경 없음
- 하나의 Issue commit으로 정리
- PR 한국어 작성
- 관련 Issue 연결
- main과 심각한 conflict 없음

완료되지 않은 항목이 있다면 완료되었다고 보고하지 않는다.
