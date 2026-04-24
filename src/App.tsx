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
    if (state.isTraining && state.interactionState === 'answering') {
      dispatch({ type: 'SELECT_POSITION', payload: position })
    }
  }

  const handleSubmitAnswer = () => {
    if (state.interactionState === 'answering') {
      dispatch({ type: 'SUBMIT_ANSWER' })
    }
  }

  const handleNextQuestion = () => {
    if (state.interactionState === 'submitted') {
      dispatch({ type: 'NEXT_QUESTION' })
    }
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
            disableConfigChanges={state.interactionState === 'answering'}
            onStart={handleStartTraining}
            onReset={handleResetTraining}
          />
        }
        promptPanel={
          <PromptPanel
            question={state.question}
            feedback={state.feedback}
            interactionState={state.interactionState}
            selectedPositions={state.selectedPositions}
            onSubmit={handleSubmitAnswer}
            onNext={state.interactionState === 'submitted' ? handleNextQuestion : undefined}
          />
        }
        fretboard={
          <Fretboard
            board={DEFAULT_FRETBOARD_MAP}
            selectedPositions={state.selectedPositions}
            feedback={state.feedback}
            interactionState={state.interactionState}
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
