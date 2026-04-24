import './Fretboard.css'
import { Position } from '../types/ui'

export interface FretCellProps {
  stringIndex: number
  fret: number
  note: string
  isActive?: boolean
  onClick?: (position: Position) => void
}

export function FretCell({ stringIndex, fret, note, isActive, onClick }: FretCellProps) {
  return (
    <button
      className={`fret-cell ${isActive ? 'active' : ''}`}
      data-string={stringIndex}
      data-fret={fret}
      data-note={note}
      onClick={() => onClick?.({ string: stringIndex, fret })}
      aria-label={`${note} (String ${stringIndex + 1}, Fret ${fret})`}
    >
      {fret === 0 ? '○' : '·'}
    </button>
  )
}

export interface StringRowProps {
  stringIndex: number
  stringNotes: string[]
  activePositions?: Set<string>
  onFretClick?: (position: Position) => void
}

export function StringRow({ stringIndex, stringNotes, activePositions, onFretClick }: StringRowProps) {
  return (
    <div className="string-row">
      {stringNotes.map((note, fret) => (
        <FretCell
          key={`${stringIndex}-${fret}`}
          stringIndex={stringIndex}
          fret={fret}
          note={note}
          isActive={activePositions?.has(`${stringIndex},${fret}`)}
          onClick={onFretClick}
        />
      ))}
    </div>
  )
}

export interface FretboardProps {
  board: string[][]
  activePositions?: Set<string>
  onFretClick?: (position: Position) => void
  showLabels?: boolean
}

export function Fretboard({ board, activePositions, onFretClick, showLabels = false }: FretboardProps) {
  return (
    <div className="fretboard-container">
      {showLabels && (
        <div className="fret-numbers">
          <div className="fret-header" />
          {board[0].map((_, fret) => (
            <div key={`fret-${fret}`} className="fret-number">
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
            activePositions={activePositions}
            onFretClick={onFretClick}
          />
        ))}
      </div>
    </div>
  )
}
