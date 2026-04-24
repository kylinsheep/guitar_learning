import './App.css'
import { Fretboard, ControlPanel, PromptPanel, StatsPanel, TrainerGrid } from './components'
import { DEFAULT_FRETBOARD_MAP } from './music'
import { TrainerProvider, useTrainer } from './state'
import { Position } from './types/ui'

function TrainerApp() {
  const { state, dispatch } = useTrainer()

  const handleConfigChange = (newConfig: any) => {
    dispatch({ type: 'CONFIG_CHANGE', payload: newConfig })
  }

  const handleStartTraining = () => {
    dispatch({ type: 'START_TRAINING' })
    dispatch({ type: 'GENERATE_QUESTION' })
  }

  const handleResetTraining = () => {
    dispatch({ type: 'RESET' })
  }

  const handleFretClick = (position: Position) => {
    if (state.isTraining && !state.feedback) {
      dispatch({ type: 'HANDLE_CLICK', payload: position })
    }
  }

  const handleNextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' })
  }

  const activePositions = new Set<string>()
  if (state.question && state.isTraining) {
    state.question.validPositions.forEach((pos) => {
      activePositions.add(`${pos.string},${pos.fret}`)
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Guitar Trainer MVP</h1>
        <p className="subtitle">Interactive Fretboard Training (Phase 3)</p>
      </header>

      <TrainerGrid
        controlPanel={
          <ControlPanel
            config={state.config}
            onConfigChange={handleConfigChange}
            onStart={handleStartTraining}
            onReset={handleResetTraining}
          />
        }
        promptPanel={
          <PromptPanel
            question={state.question}
            feedback={state.feedback}
            onNext={state.feedback ? handleNextQuestion : undefined}
          />
        }
        fretboard={
          <Fretboard
            board={DEFAULT_FRETBOARD_MAP}
            activePositions={activePositions}
            showLabels={true}
            onFretClick={handleFretClick}
          />
        }
        statsPanel={<StatsPanel stats={state.stats} />}
      />
    </div>
  )
}

function App() {
  return (
    <TrainerProvider>
      <TrainerApp />
    </TrainerProvider>
  )
}

export default App
