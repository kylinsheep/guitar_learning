import './Fretboard.css'
import { Position } from '../types/ui'

export interface FretCellProps {
  stringIndex: number
  fret: number
  note: string
  cellState?: 'normal' | 'selected' | 'correct-selected' | 'incorrect-selected' | 'missed-answer'
  onClick?: (position: Position) => void
}

export function FretCell({ stringIndex, fret, note, cellState = 'normal', onClick }: FretCellProps) {
  const handleClick = () => {
    onClick?.({ string: stringIndex, fret })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      className={`fret-cell ${cellState !== 'normal' ? cellState : ''}`}
      data-string={stringIndex}
      data-fret={fret}
      data-note={note}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${note} (String ${stringIndex + 1}, Fret ${fret})`}
      aria-pressed={cellState === 'selected' || cellState === 'correct-selected'}
      type="button"
    >
      {fret === 0 ? '○' : '·'}
    </button>
  )
}

export interface StringRowProps {
  stringIndex: number
  stringNotes: string[]
  selectedPositions?: Set<string>
  feedback?: { correctSelected: Set<string>; incorrectSelected: Set<string>; missedAnswers: Set<string> } | null
  interactionState?: 'idle' | 'answering' | 'submitted'
  onFretClick?: (position: Position) => void
}

export function StringRow({ stringIndex, stringNotes, selectedPositions, feedback, interactionState = 'idle', onFretClick }: StringRowProps) {
  if (!stringNotes || stringNotes.length === 0) {
    return <div className="string-row" />
  }

  const getCellState = (fret: number): FretCellProps['cellState'] => {
    const key = `${stringIndex},${fret}`
    if (interactionState === 'answering') {
      if (selectedPositions?.has(key)) return 'selected'
      return 'normal'
    }
    if (interactionState === 'submitted' && feedback) {
      if (feedback.correctSelected.has(key)) return 'correct-selected'
      if (feedback.incorrectSelected.has(key)) return 'incorrect-selected'
      if (feedback.missedAnswers.has(key)) return 'missed-answer'
    }
    return 'normal'
  }

  return (
    <div className="string-row" role="row" aria-label={`String ${stringIndex + 1}`}>
      {stringNotes.map((note, fret) => (
        <FretCell
          key={`${stringIndex}-${fret}`}
          stringIndex={stringIndex}
          fret={fret}
          note={note ?? 'Unknown'}
          cellState={getCellState(fret)}
          onClick={onFretClick}
        />
      ))}
    </div>
  )
}

export interface FretboardProps {
  board: string[][]
  selectedPositions?: Set<string>
  feedback?: { correctSelected: Set<string>; incorrectSelected: Set<string>; missedAnswers: Set<string> } | null
  interactionState?: 'idle' | 'answering' | 'submitted'
  onFretClick?: (position: Position) => void
  showLabels?: boolean
}

export function Fretboard({ board, selectedPositions, feedback, interactionState = 'idle', onFretClick, showLabels = false }: FretboardProps) {
  if (!board || board.length === 0) {
    return (
      <div className="fretboard-container">
        <p>Error: Fretboard data unavailable</p>
      </div>
    )
  }

  return (
    <div className="fretboard-container" role="table" aria-label="Guitar fretboard">
      {showLabels && (
        <div className="fret-numbers" role="row" aria-label="Fret numbers">
          <div className="fret-header" />
          {board[0].map((_, fret) => (
            <div key={`fret-${fret}`} className="fret-number" role="columnheader">
              {fret}
            </div>
          ))}
        </div>
      )}
      <div className="fretboard">
        {board.map((stringNotes, stringIndex) => (
          <StringRow
            key={`string-${stringIndex}`}
            stringIndex={stringIndex}
            stringNotes={stringNotes}
            selectedPositions={selectedPositions}
            feedback={feedback}
            interactionState={interactionState}
            onFretClick={onFretClick}
          />
        ))}
      </div>
    </div>
  )
}
