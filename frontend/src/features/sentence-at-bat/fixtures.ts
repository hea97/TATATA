import type {
  GameContextSnapshot,
  SentenceAtBatSubmittedState,
  SentenceAtBatSubmissionOutcome,
  SentenceAtBatTypingState,
} from './sentenceAtBat'

export const typingSentenceAtBatFixture = {
  status: 'typing',
  targetText: 'I practice English every day.',
  typedText: '',
} satisfies SentenceAtBatTypingState

export const sentenceAtBatSubmissionOutcomeFixture = {
  measurement: {
    accuracy: 96,
    relativeSpeedPercent: 8,
  },
  result: 'DOUBLE',
} satisfies SentenceAtBatSubmissionOutcome

export const submittedSentenceAtBatFixture = {
  status: 'submitted',
  targetText: 'I practice English every day.',
  typedText: 'I practice English every day.',
  measurement: {
    accuracy: 96,
    relativeSpeedPercent: 8,
  },
  result: 'DOUBLE',
} satisfies SentenceAtBatSubmittedState

export const gameContextSnapshotFixture = {
  inning: 1,
  outs: 1,
} satisfies GameContextSnapshot
