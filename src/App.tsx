import { useState } from 'react'
import './App.css'
import { Fretboard, ControlPanel, PromptPanel, StatsPanel, TrainerGrid } from './components'
import { DEFAULT_FRETBOARD_MAP } from './music'
import { TrainerConfig } from './types/ui'

function App() {
  const [config, setConfig] = useState<TrainerConfig>({
    root: 'C',
    scaleType: 'major',
    mode: 'note',
  })

  const handleConfigChange = (newConfig: Partial<TrainerConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Guitar Trainer MVP</h1>
        <p className="subtitle">Interactive Fretboard Training (Phase 2)</p>
      </header>

      <TrainerGrid
        controlPanel={
          <ControlPanel
            config={config}
            onConfigChange={handleConfigChange}
            onStart={() => console.log('Training started:', config)}
            onReset={() =>
              setConfig({
                root: 'C',
                scaleType: 'major',
                mode: 'note',
              })
            }
          />
        }
        promptPanel={
          <PromptPanel
            question={undefined}
            feedback={undefined}
            onNext={undefined}
          />
        }
        fretboard={
          <Fretboard
            board={DEFAULT_FRETBOARD_MAP}
            activePositions={new Set()}
            showLabels={true}
          />
        }
        statsPanel={<StatsPanel stats={undefined} />}
      />
    </div>
  )
}

export default App
