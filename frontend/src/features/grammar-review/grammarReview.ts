export interface GrammarVocabularyUsage {
  word: string
  explanationKo: string
}

export interface GrammarReviewContent {
  sentence: string
  patternName: string
  explanationKo: string
  vocabularyUsage: GrammarVocabularyUsage[]
  examples: string[]
}
