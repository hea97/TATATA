import styles from './PlateResultScreen.module.css'
import { plateResultLabels, type PlateResultFixture } from './plateResult'

interface PlateResultScreenProps {
  fixture: PlateResultFixture
  onReviewGrammar: () => void
}

function formatRelativeSpeed(value: number) {
  return `${value > 0 ? '+' : ''}${value}%`
}

export function PlateResultScreen({
  fixture,
  onReviewGrammar,
}: PlateResultScreenProps) {
  const resultLabel = plateResultLabels[fixture.result]

  return (
    <main className={styles.page}>
      <section className={styles.scorecard} aria-labelledby="plate-result-title">
        <header className={styles.header}>
          <div>
            <p className={styles.brand}>TATATA</p>
            <p className={styles.eyebrow}>이번 타석 기록</p>
          </div>
          <dl className={styles.gameContext} aria-label="현재 경기 상황">
            <div>
              <dt>이닝</dt>
              <dd>{fixture.inning}회</dd>
            </div>
            <div>
              <dt>현재 OUT</dt>
              <dd>{fixture.outs}</dd>
            </div>
          </dl>
        </header>

        <div className={styles.result} data-result={fixture.result}>
          <p className={styles.resultCaption}>PLATE RESULT</p>
          <h1 id="plate-result-title">{resultLabel}</h1>
          <p className={styles.resultGuide}>
            이번 타석의 학습 결과를 확인해보세요.
          </p>
        </div>

        <section className={styles.metrics} aria-labelledby="learning-metrics-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionNumber}>01</p>
            <div>
              <h2 id="learning-metrics-title">학습 기록</h2>
              <p>정확도와 평소 대비 타이핑 속도를 함께 확인해보세요.</p>
            </div>
          </div>

          <dl className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <dt>정확도</dt>
              <dd>{fixture.accuracy}%</dd>
            </div>
            <div className={styles.metricCard}>
              <dt>평소 대비 속도</dt>
              <dd>{formatRelativeSpeed(fixture.relativeSpeedPercent)}</dd>
            </div>
          </dl>
        </section>

        <footer className={styles.nextStep}>
          <div>
            <p className={styles.nextLabel}>NEXT STEP</p>
            <p className={styles.nextCopy}>문장을 이해하는 단계로 이어집니다.</p>
          </div>
          <button className={styles.primaryButton} onClick={onReviewGrammar} type="button">
            문법 복습하기
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      </section>
    </main>
  )
}
