import { useState } from 'react'
import { GrammarReviewScreen } from '../grammar-review/GrammarReviewScreen'
import type { GrammarReviewContent } from '../grammar-review/grammarReview'
import { SentenceAtBatFlow } from '../sentence-at-bat/SentenceAtBatFlow'
import type {
  GameContextSnapshot,
  SentenceAtBatSubmissionOutcome,
  SentenceAtBatTypingState,
} from '../sentence-at-bat/sentenceAtBat'

interface AtBatLearningFlowProps {
  initialAtBatState: SentenceAtBatTypingState
  submissionOutcome: SentenceAtBatSubmissionOutcome
  gameContext: GameContextSnapshot
  grammarReviewContent: GrammarReviewContent
  onContinue: () => void
}

export function AtBatLearningFlow({
  initialAtBatState,
  submissionOutcome,
  gameContext,
  grammarReviewContent,
  onContinue,
}: AtBatLearningFlowProps) {
  const [step, setStep] = useState<'at-bat' | 'grammar-review'>('at-bat')
  const content = {
    ...grammarReviewContent,
    sentence: initialAtBatState.targetText,
  }

  if (step === 'grammar-review') {
    return <GrammarReviewScreen content={content} onContinue={onContinue} />
  }

  return (
    <SentenceAtBatFlow
      initialState={initialAtBatState}
      submissionOutcome={submissionOutcome}
      gameContext={gameContext}
      onReviewGrammar={() => setStep('grammar-review')}
    />
  )
}
