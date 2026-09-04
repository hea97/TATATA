import type { PlateResult, PlateResultFixture } from './plateResult'

export const plateResultFixtures: Record<PlateResult, PlateResultFixture> = {
  STRIKE: {
    result: 'STRIKE',
    accuracy: 78,
    relativeSpeedPercent: -12,
    inning: 1,
    outs: 0,
  },
  OUT: {
    result: 'OUT',
    accuracy: 84,
    relativeSpeedPercent: -6,
    inning: 1,
    outs: 1,
  },
  SINGLE: {
    result: 'SINGLE',
    accuracy: 91,
    relativeSpeedPercent: 2,
    inning: 1,
    outs: 1,
  },
  DOUBLE: {
    result: 'DOUBLE',
    accuracy: 96,
    relativeSpeedPercent: 8,
    inning: 1,
    outs: 1,
  },
  TRIPLE: {
    result: 'TRIPLE',
    accuracy: 98,
    relativeSpeedPercent: 11,
    inning: 2,
    outs: 0,
  },
  HOME_RUN: {
    result: 'HOME_RUN',
    accuracy: 100,
    relativeSpeedPercent: 15,
    inning: 2,
    outs: 2,
  },
}
