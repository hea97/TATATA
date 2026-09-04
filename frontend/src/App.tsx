import { SentenceAtBatFlow } from './features/sentence-at-bat/SentenceAtBatFlow'
import {
  gameContextSnapshotFixture,
  sentenceAtBatSubmissionOutcomeFixture,
  typingSentenceAtBatFixture,
} from './features/sentence-at-bat/fixtures'

function App() {
  return (
    <SentenceAtBatFlow
      initialState={typingSentenceAtBatFixture}
      submissionOutcome={sentenceAtBatSubmissionOutcomeFixture}
      gameContext={gameContextSnapshotFixture}
      onReviewGrammar={() => undefined}
    />
  )
}

export default App
