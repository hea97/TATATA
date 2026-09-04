import type { PlateResultFixture } from '../plate-result/plateResult'
import type {
  GameContextSnapshot,
  SentenceAtBatSubmittedState,
} from './sentenceAtBat'

export function toPlateResultFixture(
  submittedAtBat: SentenceAtBatSubmittedState,
  gameContext: GameContextSnapshot,
): PlateResultFixture {
  return {
    result: submittedAtBat.result,
    accuracy: submittedAtBat.measurement.accuracy,
    relativeSpeedPercent: submittedAtBat.measurement.relativeSpeedPercent,
    inning: gameContext.inning,
    outs: gameContext.outs,
  }
}
