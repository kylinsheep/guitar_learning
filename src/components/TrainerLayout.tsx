import { ReactNode } from 'react'
import './TrainerLayout.css'

export interface TrainerLayoutProps {
  children: ReactNode
}

export function TrainerLayout({ children }: TrainerLayoutProps) {
  return <div className="trainer-layout">{children}</div>
}

export interface TrainerGridProps {
  controlPanel: ReactNode
  promptPanel: ReactNode
  fretboard: ReactNode
  statsPanel: ReactNode
}

export function TrainerGrid({ controlPanel, promptPanel, fretboard, statsPanel }: TrainerGridProps) {
  return (
    <TrainerLayout>
      <div className="trainer-grid">
        <div className="sidebar left-sidebar">{controlPanel}</div>
        <div className="main-area">
          <div className="prompt-area">{promptPanel}</div>
          <div className="fretboard-area">{fretboard}</div>
        </div>
        <div className="sidebar right-sidebar">{statsPanel}</div>
      </div>
    </TrainerLayout>
  )
}
