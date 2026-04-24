import { CHROMATIC_NOTES, SCALE_FORMULAS } from '../music'
import { NoteName, ScaleType, TrainingMode, TrainerConfig } from '../types/ui'
import './ControlPanel.css'

export interface ControlPanelProps {
  config: TrainerConfig
  onConfigChange: (newConfig: Partial<TrainerConfig>) => void
  onStart?: () => void
  onReset?: () => void
}

export function ControlPanel({ config, onConfigChange, onStart, onReset }: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h2>Training Configuration</h2>

      <div className="control-group">
        <label htmlFor="root-select">Root Note:</label>
        <select
          id="root-select"
          value={config.root}
          onChange={(e) => onConfigChange({ root: e.target.value as NoteName })}
        >
          {CHROMATIC_NOTES.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="scale-select">Scale/Mode:</label>
        <select
          id="scale-select"
          value={config.scaleType}
          onChange={(e) => onConfigChange({ scaleType: e.target.value as ScaleType })}
        >
          {Object.keys(SCALE_FORMULAS).map((scale) => (
            <option key={scale} value={scale}>
              {scale.charAt(0).toUpperCase() + scale.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="mode-select">Training Mode:</label>
        <select
          id="mode-select"
          value={config.mode}
          onChange={(e) => onConfigChange({ mode: e.target.value as TrainingMode })}
        >
          <option value="note">Note Finder</option>
          <option value="interval">Interval Finder</option>
          <option value="mixed">Mixed Random Quiz</option>
        </select>
      </div>

      <div className="control-actions">
        {onStart && (
          <button className="btn btn-primary" onClick={onStart}>
            Start Training
          </button>
        )}
        {onReset && (
          <button className="btn btn-secondary" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
