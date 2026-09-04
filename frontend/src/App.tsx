import { grammarReviewFixture } from './features/grammar-review/fixtures'
import { AtBatLearningFlow } from './features/learning/AtBatLearningFlow'
import {
  gameContextSnapshotFixture,
  sentenceAtBatSubmissionOutcomeFixture,
  typingSentenceAtBatFixture,
} from './features/sentence-at-bat/fixtures'

function App() {
  return (
    <AtBatLearningFlow
      initialAtBatState={typingSentenceAtBatFixture}
      submissionOutcome={sentenceAtBatSubmissionOutcomeFixture}
      gameContext={gameContextSnapshotFixture}
      grammarReviewContent={grammarReviewFixture}
      onContinue={() => undefined}
    />
  )
}

export default App
