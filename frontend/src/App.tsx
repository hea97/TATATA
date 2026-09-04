import { PlateResultScreen } from './features/plate-result/PlateResultScreen'
import { plateResultFixtures } from './features/plate-result/fixtures'

function App() {
  return (
    <PlateResultScreen
      fixture={plateResultFixtures.DOUBLE}
      onReviewGrammar={() => undefined}
    />
  )
}

export default App
