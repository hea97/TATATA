import type {
  SentenceAtBatSubmissionOutcome,
  SentenceAtBatSubmittedState,
  SentenceAtBatTypingState,
} from './sentenceAtBat'

export function createSubmittedSentenceAtBatState(
  typingState: SentenceAtBatTypingState,
  submissionOutcome: SentenceAtBatSubmissionOutcome,
): SentenceAtBatSubmittedState {
  return {
    status: 'submitted',
    targetText: typingState.targetText,
    typedText: typingState.typedText,
    measurement: submissionOutcome.measurement,
    result: submissionOutcome.result,
  }
}
