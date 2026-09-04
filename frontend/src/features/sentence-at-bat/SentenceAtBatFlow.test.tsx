import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SentenceAtBatFlow } from './SentenceAtBatFlow'
import {
  gameContextSnapshotFixture,
  sentenceAtBatSubmissionOutcomeFixture,
  typingSentenceAtBatFixture,
} from './fixtures'
import { createSubmittedSentenceAtBatState } from './sentenceAtBatTransition'

afterEach(cleanup)

function renderFlow() {
  render(
    <SentenceAtBatFlow
      initialState={typingSentenceAtBatFixture}
      submissionOutcome={sentenceAtBatSubmissionOutcomeFixture}
      gameContext={gameContextSnapshotFixture}
      onReviewGrammar={() => undefined}
    />,
  )
}

describe('SentenceAtBatFlow', () => {
  it('starts with the target sentence, textarea, and disabled submit button', () => {
    renderFlow()

    expect(
      screen.getByText('I practice English every day.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('영어 문장 입력')).toHaveValue('')
    expect(screen.getByRole('button', { name: '제출하기' })).toBeDisabled()
  })

  it('uses React state as the textarea value', () => {
    renderFlow()
    const textarea = screen.getByLabelText('영어 문장 입력')

    fireEvent.change(textarea, { target: { value: 'I practice' } })

    expect(textarea).toHaveValue('I practice')
  })

  it('keeps submission disabled for whitespace-only input', () => {
    renderFlow()

    fireEvent.change(screen.getByLabelText('영어 문장 입력'), {
      target: { value: '   ' },
    })

    expect(screen.getByRole('button', { name: '제출하기' })).toBeDisabled()
  })

  it('enables submission for any non-whitespace input', () => {
    renderFlow()

    fireEvent.change(screen.getByLabelText('영어 문장 입력'), {
      target: { value: 'x' },
    })

    expect(screen.getByRole('button', { name: '제출하기' })).toBeEnabled()
  })

  it('submits partial input with the fixture outcome', () => {
    renderFlow()

    fireEvent.change(screen.getByLabelText('영어 문장 입력'), {
      target: { value: 'I practice Engl' },
    })
    fireEvent.click(screen.getByRole('button', { name: '제출하기' }))

    expect(screen.getByRole('heading', { name: '2루타' })).toBeInTheDocument()
    expect(screen.getByText('96%')).toBeInTheDocument()
    expect(screen.getByText('+8%')).toBeInTheDocument()
    expect(screen.queryByLabelText('영어 문장 입력')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '제출하기' }),
    ).not.toBeInTheDocument()
  })

  it('allows incorrect input to reach the same fixture result', () => {
    renderFlow()

    fireEvent.change(screen.getByLabelText('영어 문장 입력'), {
      target: { value: 'This is not the target sentence.' },
    })
    fireEvent.click(screen.getByRole('button', { name: '제출하기' }))

    expect(screen.getByRole('heading', { name: '2루타' })).toBeInTheDocument()
  })

  it('preserves typedText when creating the submitted state', () => {
    const typedText = 'I practice Engl'

    expect(
      createSubmittedSentenceAtBatState(
        { ...typingSentenceAtBatFixture, typedText },
        sentenceAtBatSubmissionOutcomeFixture,
      ),
    ).toEqual({
      status: 'submitted',
      targetText: 'I practice English every day.',
      typedText,
      measurement: {
        accuracy: 96,
        relativeSpeedPercent: 8,
      },
      result: 'DOUBLE',
    })
  })
})
