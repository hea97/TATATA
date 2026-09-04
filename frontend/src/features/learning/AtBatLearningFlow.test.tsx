import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { grammarReviewFixture } from '../grammar-review/fixtures'
import {
  gameContextSnapshotFixture,
  sentenceAtBatSubmissionOutcomeFixture,
  typingSentenceAtBatFixture,
} from '../sentence-at-bat/fixtures'
import { AtBatLearningFlow } from './AtBatLearningFlow'

afterEach(cleanup)

function renderFlow(onContinue = () => undefined) {
  render(
    <AtBatLearningFlow
      initialAtBatState={typingSentenceAtBatFixture}
      submissionOutcome={sentenceAtBatSubmissionOutcomeFixture}
      gameContext={gameContextSnapshotFixture}
      grammarReviewContent={grammarReviewFixture}
      onContinue={onContinue}
    />,
  )
}

describe('AtBatLearningFlow', () => {
  it('connects sentence submission and PlateResult to GrammarReview', () => {
    renderFlow()
    fireEvent.change(screen.getByLabelText('영어 문장 입력'), {
      target: { value: 'I practce Engl' },
    })
    fireEvent.click(screen.getByRole('button', { name: '제출하기' }))
    expect(screen.getByRole('heading', { name: '2루타' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '문법 복습하기' }))

    expect(screen.getByRole('heading', { name: '문법 복습' })).toBeInTheDocument()
    expect(screen.getByText(typingSentenceAtBatFixture.targetText)).toBeInTheDocument()
    expect(screen.queryByText('I practce Engl')).not.toBeInTheDocument()
  })

  it('leaves the next destination to the parent callback', () => {
    const onContinue = vi.fn()
    renderFlow(onContinue)
    fireEvent.change(screen.getByLabelText('영어 문장 입력'), {
      target: { value: 'partial' },
    })
    fireEvent.click(screen.getByRole('button', { name: '제출하기' }))
    fireEvent.click(screen.getByRole('button', { name: '문법 복습하기' }))
    fireEvent.click(screen.getByRole('button', { name: '계속하기' }))

    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
