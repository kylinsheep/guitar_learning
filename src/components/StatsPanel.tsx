import { SessionStats } from '../types/ui'
import './StatsPanel.css'

export interface StatsPanelProps {
  stats?: SessionStats | null
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return (
      <div className="stats-panel">
        <h2>Session Statistics</h2>
        <p className="stats-placeholder">Start training to see stats</p>
      </div>
    )
  }

  const accuracy = Math.min(100, Math.max(0, stats.accuracy ?? 0))
  const avgResponseMs = Math.max(0, stats.avgResponseMs ?? 0)
  const attempts = Math.max(0, stats.attempts ?? 0)
  const correct = Math.max(0, Math.min(attempts, stats.correct ?? 0))
  const streak = Math.max(0, stats.streak ?? 0)
  const bestStreak = Math.max(0, stats.bestStreak ?? 0)

  return (
    <div className="stats-panel">
      <h2>Session Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">{accuracy.toFixed(1)}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Current Streak</div>
          <div className="stat-value">{streak}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Best Streak</div>
          <div className="stat-value">{bestStreak}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg Response</div>
          <div className="stat-value">{avgResponseMs.toFixed(0)}ms</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Attempts</div>
          <div className="stat-value">{attempts}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Correct</div>
          <div className="stat-value">{correct}</div>
        </div>
      </div>
    </div>
  )
}
