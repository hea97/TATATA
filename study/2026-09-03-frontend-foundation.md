# 2026-09-03 Frontend Foundation 학습 기록

## 1. 이번 작업의 목적

이번 작업은 TATATA의 실제 제품 화면을 만드는 일이 아니라 이후 React 기능을 일관되게 개발하고 검증할 수 있는 최소 기반을 만드는 일이다. `frontend/`를 독립된 애플리케이션 경계로 두고 실행, 정적 검사, 테스트, production build가 모두 실제 명령으로 동작하도록 구성했다. Backend, API, 인증, 게임 규칙은 이 범위에 포함하지 않았다.

## 2. React의 역할

React는 사용자에게 보이는 화면을 컴포넌트 단위로 표현하고 상태 변화에 맞춰 다시 렌더링하는 UI 라이브러리다. 지금은 환경 확인용 `App`만 있지만 이후 문장 입력, 타석 결과, 이닝 상태 같은 화면을 작은 컴포넌트로 나누어 조합하는 기반이 된다.

## 3. Vite의 역할

Vite는 React 자체가 아니다. 개발 중에는 빠른 개발 서버와 변경 반영을 제공하고, 배포 전에는 브라우저가 사용할 정적 파일로 코드를 묶는다. React가 UI를 작성하는 도구라면 Vite는 그 코드를 개발하고 build하는 도구다.

## 4. TypeScript를 사용하는 이유

TypeScript는 JavaScript에 정적 타입 검사를 더한다. 이후 `PlateResult`나 `GameState`를 구현할 때 필수 필드, 허용되는 결과 값, 상태별 데이터 모양을 타입으로 선언할 수 있다. 잘못된 필드명이나 누락된 상태 처리를 실행 전에 발견해 화면과 비즈니스 데이터 사이의 계약을 명확하게 만든다.

## 5. package.json, npm, dependency

`package.json`은 프로젝트 이름, 실행 script, production dependency, 개발 도구 dependency를 기록하는 manifest다. npm은 이 manifest와 `package-lock.json`을 읽어 필요한 패키지를 설치하고 script를 실행한다. `package-lock.json`은 실제 설치 버전을 고정해 개발자와 CI가 같은 dependency 조합을 재현하도록 돕는다.

- `react`, `react-dom`: React 컴포넌트를 만들고 브라우저 DOM에 렌더링한다.
- `vite`, `@vitejs/plugin-react`: 개발 서버, React 변환, production build를 담당한다.
- `typescript`, 타입 패키지: 코드를 정적으로 검사한다.
- `oxlint`: 잠재적인 코드 문제와 일관성 위반을 정적으로 검사한다.
- `vitest`: Vite 환경과 잘 맞는 테스트 실행기다.
- `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`: DOM과 유사한 테스트 환경에서 사용자가 보는 결과를 중심으로 React 컴포넌트를 검증한다.

## 6. lint, test, build의 차이

- `lint`는 코드를 실행하지 않고 의심스러운 패턴과 규칙 위반을 찾는다.
- `test`는 정해진 입력과 렌더링 결과가 기대와 같은지 실행하여 확인한다.
- `build`는 TypeScript 검사와 번들 생성을 수행해 production 배포물이 실제로 만들어지는지 확인한다.

세 검증은 목적이 다르므로 하나가 성공해도 다른 두 검증을 대신하지 못한다.

## 7. Frontend folder 구조

```text
frontend/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── src/
    ├── App.tsx
    ├── App.test.tsx
    ├── index.css
    ├── main.tsx
    └── test/
        └── setup.ts
```

`index.html`은 브라우저 진입점이고, `main.tsx`가 React root를 만든다. `App.tsx`는 현재 최소 화면, `App.test.tsx`는 smoke test, `test/setup.ts`는 DOM assertion 설정이다. 설정 파일은 개발 서버, 테스트, TypeScript 검사 방법을 정의한다.

## 8. 실제 실행한 Validation

작업 완료 전 다음 명령을 실제로 실행하고 결과를 확인한다.

```powershell
cd frontend
npm install
npm run lint
npm test
npm run build
npm run dev -- --host 127.0.0.1
```

저장소 수준에서는 `git diff --check`, working tree 변경 범위, main 이후 작업 commit 수를 별도로 확인한다. 브라우저에서는 TATATA 제목과 상태 문구의 렌더링 및 console error 여부를 확인한다.

최종 검증 결과는 다음과 같다.

- `npm ci`: dependency 116개 설치, 취약점 0건
- `npm run lint`: 통과
- `npm test`: test file 1개, test 1개 통과
- `npm run build`: production bundle 생성 성공
- `npm run dev -- --host 127.0.0.1`: Vite 개발 서버 시작 성공
- 브라우저: `TATATA` 제목과 정상 동작 문구 렌더링 확인, warning/error 0건
- `git diff --check`: 통과

## 9. 작업 중 발생한 오류와 해결

로컬 Node.js 설치에서 사용자 npm prefix가 존재하지 않는 `npm-cli.js`를 가리켜 일반 `npm` 명령이 실패했다. 시스템 Node.js 설치에 포함된 npm은 정상임을 확인했고, 작업 명령에서 `npm_config_prefix`를 시스템 Node.js 경로로 한정해 설치와 실행을 복구했다. 프로젝트 파일이나 전역 dependency를 임의로 바꾸지 않고 현재 작업 프로세스에만 적용했다.

샌드박스 안에서 첫 `npm ci`를 실행했을 때 사용자 npm 캐시 접근 권한 오류가 발생했고 dependency가 제거된 상태여서 뒤의 lint, test, build도 실행 파일을 찾지 못했다. npm 캐시 접근을 허용한 뒤 `npm ci`부터 순서대로 다시 실행하여 모든 명령이 성공하는 것을 확인했다.

최신 Vite 템플릿에는 범위보다 큰 장식형 데모 화면과 이미지가 포함되어 있었다. 환경 검증이라는 Issue 목적에 맞춰 이를 제거하고 서비스명과 정상 동작 문구만 남겼다.

## 10. 다음에 공부할 내용

- React 컴포넌트의 props와 state
- TypeScript union type으로 화면 상태 표현하기
- React Testing Library의 사용자 중심 query
- Vitest의 unit test와 component test 구분
- Vite 환경 변수와 production 배포 방식
- CI에서 install, lint, test, build를 자동 실행하는 방법
