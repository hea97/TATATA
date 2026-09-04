import styles from './GrammarReviewScreen.module.css'
import type { GrammarReviewContent } from './grammarReview'

interface GrammarReviewScreenProps {
  content: GrammarReviewContent
  onContinue: () => void
}

export function GrammarReviewScreen({
  content,
  onContinue,
}: GrammarReviewScreenProps) {
  return (
    <main className={styles.page}>
      <article className={styles.review} aria-labelledby="grammar-review-title">
        <header className={styles.header}>
          <div>
            <p className={styles.brand}>TATATA</p>
            <p className={styles.eyebrow}>문법 복습</p>
          </div>
          <p className={styles.practiceNote}>학습 보조 단계 · 공식 타석 아님</p>
        </header>

        <div className={styles.content}>
          <section className={styles.sentenceSection} aria-labelledby="grammar-review-title">
            <p className={styles.step}>REVIEW THE SENTENCE</p>
            <h1 id="grammar-review-title">문법 복습</h1>
            <p className={styles.sentence} lang="en">
              {content.sentence}
            </p>
          </section>

          <section className={styles.patternSection} aria-labelledby="grammar-pattern-title">
            <p className={styles.sectionNumber}>01</p>
            <div>
              <h2 id="grammar-pattern-title">문법 패턴</h2>
              <p className={styles.patternName}>{content.patternName}</p>
              <p className={styles.explanation}>{content.explanationKo}</p>
            </div>
          </section>

          <section className={styles.detailSection} aria-labelledby="vocabulary-usage-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionNumber}>02</p>
              <h2 id="vocabulary-usage-title">단어 사용</h2>
            </div>
            <dl className={styles.vocabularyList}>
              {content.vocabularyUsage.map((usage) => (
                <div key={usage.word}>
                  <dt lang="en">{usage.word}</dt>
                  <dd>{usage.explanationKo}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.detailSection} aria-labelledby="related-examples-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionNumber}>03</p>
              <h2 id="related-examples-title">관련 예문</h2>
            </div>
            <ul className={styles.exampleList}>
              {content.examples.map((example) => (
                <li key={example} lang="en">{example}</li>
              ))}
            </ul>
          </section>
        </div>

        <footer className={styles.footer}>
          <div>
            <p className={styles.nextLabel}>NEXT STEP</p>
            <p>복습을 마치고 학습 흐름을 이어가세요.</p>
          </div>
          <button type="button" onClick={onContinue}>
            계속하기
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      </article>
    </main>
  )
}
