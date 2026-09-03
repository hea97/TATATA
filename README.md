# TATATA

TATATA는 야구의 경기와 시즌 기록 비유를 활용한 한국어권 영어 타이핑 학습 서비스입니다. 영어 학습이 제품의 중심이며, 야구 요소는 학습 동기와 성장 기록을 표현하는 게임화 장치입니다.

## 현재 저장소 상태

Frontend 개발 기반은 `frontend/`에 React, TypeScript, Vite, npm으로 구성되어 있습니다. Backend는 아직 구성하지 않았습니다.

## 개발 시작 전 확인

모든 작업은 저장소 루트의 [`AGENTS.md`](./AGENTS.md)를 먼저 확인합니다. 핵심 Git 운영 원칙은 다음과 같습니다.

- `1 Issue = 1 Branch = 1 Pull Request = 1 Commit`
- `main`에 직접 commit 또는 push하지 않습니다.
- 작업 branch는 최신 `main`에서 생성합니다.
- Commit 메시지는 영어 Conventional Commits 형식을 사용합니다.
- Pull Request 제목과 본문은 한국어로 작성합니다.
- 현재 Issue와 무관한 리팩터링이나 dependency를 포함하지 않습니다.
- 원격 commit을 amend한 경우 `git push --force-with-lease`만 사용합니다.
- merge 후 작업 branch를 삭제합니다.

## 개발 명령

Frontend dependency를 설치하고 각 명령을 실행합니다.

```powershell
cd frontend
npm install
npm run dev
```

개발 서버 외의 검증 명령은 다음과 같습니다.

```powershell
npm run lint
npm test
npm run build
```

## 제품 및 브랜드 원칙

- 기능 명세서를 비즈니스 규칙의 기준으로 사용합니다.
- 유저 플로우를 화면 이동의 기준으로 사용합니다.
- 승인된 최신 디자인과 기존 구현 구조를 UI 기준으로 사용합니다.
- 정의되지 않은 판정 기준이나 제품 규칙을 임의로 만들지 않습니다.
- 실제 프로야구 리그·구단·선수의 로고, 유니폼, 마스코트, 이미지 또는 고유 브랜드 그래픽을 사용하거나 재현하지 않습니다.
