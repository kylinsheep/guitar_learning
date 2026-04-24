import { SessionStats } from '../types/ui'
import './StatsPanel.css'

export interface StatsPanelProps {
  stats?: SessionStats
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

  return (
    <div className="stats-panel">
      <h2>Session Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">{stats.accuracy.toFixed(1)}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Current Streak</div>
          <div className="stat-value">{stats.streak}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Best Streak</div>
          <div className="stat-value">{stats.bestStreak}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg Response</div>
          <div className="stat-value">{stats.avgResponseMs.toFixed(0)}ms</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Attempts</div>
          <div className="stat-value">{stats.attempts}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Correct</div>
          <div className="stat-value">{stats.correct}</div>
        </div>
      </div>
    </div>
  )
}
