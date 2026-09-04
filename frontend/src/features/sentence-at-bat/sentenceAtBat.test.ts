import { describe, expect, it } from 'vitest'
import {
  gameContextSnapshotFixture,
  submittedSentenceAtBatFixture,
  typingSentenceAtBatFixture,
} from './fixtures'
import { toPlateResultFixture } from './plateResultAdapter'
import type { SentenceAtBatState } from './sentenceAtBat'

describe('SentenceAtBat contract', () => {
  it('keeps result data out of the typing state', () => {
    const state: SentenceAtBatState = typingSentenceAtBatFixture

    expect(state.status).toBe('typing')
    expect(state).not.toHaveProperty('measurement')
    expect(state).not.toHaveProperty('result')
  })

  it('requires measurement and a final result in the submitted state', () => {
    const state: SentenceAtBatState = submittedSentenceAtBatFixture

    expect(state.status).toBe('submitted')
    expect(state.measurement).toEqual({
      accuracy: 96,
      relativeSpeedPercent: 8,
    })
    expect(state.result).toBe('DOUBLE')
  })

  it('adapts submitted values and game context to PlateResultFixture', () => {
    expect(
      toPlateResultFixture(
        submittedSentenceAtBatFixture,
        gameContextSnapshotFixture,
      ),
    ).toEqual({
      result: 'DOUBLE',
      accuracy: 96,
      relativeSpeedPercent: 8,
      inning: 1,
      outs: 1,
    })
  })
})
