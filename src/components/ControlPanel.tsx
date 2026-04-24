import { CHROMATIC_NOTES, SCALE_FORMULAS } from '../music'
import { NoteName, ScaleType, TrainingMode, TrainerConfig } from '../types/ui'
import './ControlPanel.css'

export interface ControlPanelProps {
  config: TrainerConfig
  onConfigChange: (newConfig: Partial<TrainerConfig>) => void
  disableConfigChanges?: boolean
  onStart?: () => void
  onReset?: () => void
}

export function ControlPanel({ config, onConfigChange, disableConfigChanges = false, onStart, onReset }: ControlPanelProps) {
  // Validate and fallback config values
  const safeRoot: NoteName = CHROMATIC_NOTES.includes(config?.root) ? config.root : 'C'
  const safeScaleType: ScaleType = Object.keys(SCALE_FORMULAS).includes(config?.scaleType)
    ? config.scaleType
    : 'major'
  const safeMode: TrainingMode = ['note', 'interval', 'mixed'].includes(config?.mode)
    ? config.mode
    : 'note'

  return (
    <div className="control-panel">
      <h2>Training Configuration</h2>

      <div className="control-group">
        <label htmlFor="root-select">Root Note:</label>
        <select
          id="root-select"
          value={safeRoot}
          disabled={disableConfigChanges}
          onChange={(e) => onConfigChange({ root: e.target.value as NoteName })}
          aria-label="Select root note for training"
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
          value={safeScaleType}
          disabled={disableConfigChanges}
          onChange={(e) => onConfigChange({ scaleType: e.target.value as ScaleType })}
          aria-label="Select scale or mode for training"
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
          value={safeMode}
          disabled={disableConfigChanges}
          onChange={(e) => onConfigChange({ mode: e.target.value as TrainingMode })}
          aria-label="Select training mode"
        >
          <option value="note">Note Finder</option>
          <option value="interval">Interval Finder</option>
          <option value="mixed">Mixed Random Quiz</option>
        </select>
      </div>

      <div className="control-actions">
        {onStart && (
          <button
            className="btn btn-primary"
            onClick={onStart}
            aria-label="Start training session with selected configuration"
          >
            Start Training
          </button>
        )}
        {onReset && (
          <button
            className="btn btn-secondary"
            onClick={onReset}
            aria-label="Reset training session and clear statistics"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
