import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { grammarReviewFixture } from './fixtures'
import { GrammarReviewScreen } from './GrammarReviewScreen'

afterEach(cleanup)

describe('GrammarReviewScreen', () => {
  it('renders the sentence, pattern, explanation, vocabulary, and every example', () => {
    render(
      <GrammarReviewScreen
        content={grammarReviewFixture}
        onContinue={() => undefined}
      />,
    )

    expect(screen.getByText(grammarReviewFixture.sentence)).toBeInTheDocument()
    expect(screen.getByText(grammarReviewFixture.patternName)).toBeInTheDocument()
    expect(screen.getByText(grammarReviewFixture.explanationKo)).toBeInTheDocument()
    for (const usage of grammarReviewFixture.vocabularyUsage) {
      expect(screen.getByText(usage.word)).toBeInTheDocument()
      expect(screen.getByText(usage.explanationKo)).toBeInTheDocument()
    }
    for (const example of grammarReviewFixture.examples) {
      expect(screen.getByText(example)).toBeInTheDocument()
    }
  })

  it('calls onContinue exactly once from the continue button', () => {
    const onContinue = vi.fn()
    render(
      <GrammarReviewScreen
        content={grammarReviewFixture}
        onContinue={onContinue}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '계속하기' }))

    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
