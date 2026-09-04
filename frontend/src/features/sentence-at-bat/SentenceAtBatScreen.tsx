import type { FormEvent } from 'react'
import styles from './SentenceAtBatScreen.module.css'
import type { GameContextSnapshot } from './sentenceAtBat'

interface SentenceAtBatScreenProps {
  targetText: string
  typedText: string
  gameContext: GameContextSnapshot
  onTypedTextChange: (typedText: string) => void
  onSubmit: () => void
}

export function SentenceAtBatScreen({
  targetText,
  typedText,
  gameContext,
  onTypedTextChange,
  onSubmit,
}: SentenceAtBatScreenProps) {
  const canSubmit = typedText.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (canSubmit) {
      onSubmit()
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.scorecard} aria-labelledby="sentence-at-bat-title">
        <header className={styles.header}>
          <div>
            <p className={styles.brand}>TATATA</p>
            <p className={styles.eyebrow}>문장 타석</p>
          </div>
          <dl className={styles.gameContext} aria-label="현재 경기 상황">
            <div>
              <dt>이닝</dt>
              <dd>{gameContext.inning}회</dd>
            </div>
            <div>
              <dt>현재 OUT</dt>
              <dd>{gameContext.outs}</dd>
            </div>
          </dl>
        </header>

        <div className={styles.content}>
          <div className={styles.intro}>
            <p className={styles.step}>OFFICIAL AT-BAT</p>
            <h1 id="sentence-at-bat-title">영어 문장을 입력해보세요</h1>
            <p>문장을 직접 입력하고 이번 타석을 완료하세요.</p>
          </div>

          <section className={styles.targetSection} aria-labelledby="target-sentence-title">
            <p className={styles.sectionNumber}>01</p>
            <div>
              <h2 id="target-sentence-title">목표 문장</h2>
              <p className={styles.targetText} lang="en">
                {targetText}
              </p>
            </div>
          </section>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputHeading}>
              <span className={styles.sectionNumber}>02</span>
              <label htmlFor="sentence-input">영어 문장 입력</label>
            </div>
            <textarea
              id="sentence-input"
              value={typedText}
              onChange={(event) => onTypedTextChange(event.target.value)}
              placeholder="위 문장을 영어로 입력하세요"
              rows={4}
              autoComplete="off"
              spellCheck={false}
            />
            <div className={styles.formFooter}>
              <p>공백이 아닌 문자를 입력하면 제출할 수 있습니다.</p>
              <button type="submit" disabled={!canSubmit}>
                제출하기
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
