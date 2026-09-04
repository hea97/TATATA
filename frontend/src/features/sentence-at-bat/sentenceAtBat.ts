import type { PlateResult } from '../plate-result/plateResult'

export interface SentenceAtBatTypingState {
  status: 'typing'
  targetText: string
  typedText: string
}

export interface SentenceAtBatMeasurement {
  accuracy: number
  relativeSpeedPercent: number
}

export interface SentenceAtBatSubmittedState {
  status: 'submitted'
  targetText: string
  typedText: string
  measurement: SentenceAtBatMeasurement
  result: PlateResult
}

export type SentenceAtBatState =
  | SentenceAtBatTypingState
  | SentenceAtBatSubmittedState

export interface GameContextSnapshot {
  inning: number
  outs: number
}
