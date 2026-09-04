import { useState } from 'react'
import { PlateResultScreen } from '../plate-result/PlateResultScreen'
import { toPlateResultFixture } from './plateResultAdapter'
import { SentenceAtBatScreen } from './SentenceAtBatScreen'
import { createSubmittedSentenceAtBatState } from './sentenceAtBatTransition'
import type {
  GameContextSnapshot,
  SentenceAtBatState,
  SentenceAtBatSubmissionOutcome,
  SentenceAtBatTypingState,
} from './sentenceAtBat'

interface SentenceAtBatFlowProps {
  initialState: SentenceAtBatTypingState
  submissionOutcome: SentenceAtBatSubmissionOutcome
  gameContext: GameContextSnapshot
  onReviewGrammar: () => void
}

export function SentenceAtBatFlow({
  initialState,
  submissionOutcome,
  gameContext,
  onReviewGrammar,
}: SentenceAtBatFlowProps) {
  const [state, setState] = useState<SentenceAtBatState>(initialState)

  if (state.status === 'submitted') {
    return (
      <PlateResultScreen
        fixture={toPlateResultFixture(state, gameContext)}
        onReviewGrammar={onReviewGrammar}
      />
    )
  }

  function handleTypedTextChange(typedText: string) {
    setState((currentState) => {
      if (currentState.status !== 'typing') {
        return currentState
      }

      return { ...currentState, typedText }
    })
  }

  function handleSubmit() {
    setState((currentState) => {
      if (
        currentState.status !== 'typing' ||
        currentState.typedText.trim().length === 0
      ) {
        return currentState
      }

      return createSubmittedSentenceAtBatState(
        currentState,
        submissionOutcome,
      )
    })
  }

  return (
    <SentenceAtBatScreen
      targetText={state.targetText}
      typedText={state.typedText}
      gameContext={gameContext}
      onTypedTextChange={handleTypedTextChange}
      onSubmit={handleSubmit}
    />
  )
}
