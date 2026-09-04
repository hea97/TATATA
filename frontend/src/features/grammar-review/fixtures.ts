import type { GrammarReviewContent } from './grammarReview'

export const grammarReviewFixture = {
  sentence: 'I practice English every day.',
  patternName: '현재시제 + 빈도 표현',
  explanationKo:
    '반복적으로 하는 습관이나 일상적인 행동은 현재시제로 표현할 수 있어요.',
  vocabularyUsage: [
    {
      word: 'practice',
      explanationKo:
        'practice는 반복해서 연습하거나 훈련한다는 의미로 사용돼요.',
    },
  ],
  examples: [
    'I study English every morning.',
    'She practices piano after school.',
  ],
} satisfies GrammarReviewContent
