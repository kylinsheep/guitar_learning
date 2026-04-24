import { Question } from '../types/ui'
import { SubmissionFeedback } from '../state/reducer'
import './PromptPanel.css'

export interface PromptPanelProps {
  question?: Question | null
  feedback?: SubmissionFeedback | null
  interactionState?: 'idle' | 'answering' | 'submitted'
  selectedPositions?: Set<string>
  onSubmit?: () => void
  onNext?: () => void
}

export function PromptPanel({ question, feedback, interactionState = 'idle', selectedPositions, onSubmit, onNext }: PromptPanelProps) {
  if (!question) {
    return (
      <div className="prompt-panel">
        <p className="prompt-placeholder">Configure and start training to begin</p>
      </div>
    )
  }

  const promptText = question?.prompt ?? 'No question'
  const hasSelections = (selectedPositions?.size ?? 0) > 0
  const correctCount = feedback?.correctSelected.size ?? 0
  const totalCorrect = question.validPositions.length
  const incorrectCount = feedback?.incorrectSelected.size ?? 0
  const missedCount = feedback?.missedAnswers.size ?? 0

  return (
    <div className="prompt-panel">
      <div className="prompt-content">
        <h3 className="prompt-text">{promptText}</h3>
        {interactionState === 'answering' && (
          <p className="selection-info">
            {hasSelections ? `${selectedPositions?.size} selected` : 'Click fretboard to select'}
          </p>
        )}
        {interactionState === 'submitted' && feedback && (
          <div className={`feedback ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`} role="status" aria-live="polite">
            <div className="feedback-summary">
              <div className="feedback-line correct">✓ Correct: {correctCount}/{totalCorrect}</div>
              {incorrectCount > 0 && <div className="feedback-line incorrect">✗ Wrong: {incorrectCount}</div>}
              {missedCount > 0 && <div className="feedback-line missed">⊘ Missed: {missedCount}</div>}
            </div>
            <p className="feedback-message">{feedback.isCorrect ? 'Perfect! All correct.' : 'Try to find all correct positions.'}</p>
          </div>
        )}
      </div>
      <div className="button-group">
        {interactionState === 'answering' && (
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!hasSelections}
            aria-label="Submit your answer"
          >
            Submit Answer
          </button>
        )}
        {interactionState === 'submitted' && onNext && (
          <button className="btn btn-primary" onClick={onNext} aria-label="Move to next question">
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}
