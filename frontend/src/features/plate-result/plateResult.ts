export type PlateResult =
  | 'STRIKE'
  | 'OUT'
  | 'SINGLE'
  | 'DOUBLE'
  | 'TRIPLE'
  | 'HOME_RUN'

export interface PlateResultFixture {
  result: PlateResult
  accuracy: number
  relativeSpeedPercent: number
  inning: number
  outs: number
}

export const plateResultLabels: Record<PlateResult, string> = {
  STRIKE: '스트라이크',
  OUT: '아웃',
  SINGLE: '단타',
  DOUBLE: '2루타',
  TRIPLE: '3루타',
  HOME_RUN: '홈런',
}
