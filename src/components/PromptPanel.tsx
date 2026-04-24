import { Question } from '../types/ui'
import './PromptPanel.css'

export interface PromptPanelProps {
  question?: Question
  feedback?: 'correct' | 'incorrect' | null
  onNext?: () => void
}

export function PromptPanel({ question, feedback, onNext }: PromptPanelProps) {
  if (!question) {
    return (
      <div className="prompt-panel">
        <p className="prompt-placeholder">Configure and start training to begin</p>
      </div>
    )
  }

  return (
    <div className="prompt-panel">
      <div className="prompt-content">
        <h3 className="prompt-text">{question.prompt}</h3>
        {feedback && (
          <div className={`feedback feedback-${feedback}`}>
            {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect, try again'}
          </div>
        )}
      </div>
      {feedback && onNext && (
        <button className="btn btn-primary" onClick={onNext}>
          Next Question
        </button>
      )}
    </div>
  )
}
