import type { RankedItem } from '../lib/streaming'
import { formatDuration, formatNumber } from '../lib/format'

interface TopListProps {
  title: string
  items: RankedItem[]
  limit?: number
  showDetail?: boolean
}

export function TopList({ title, items, limit = 10, showDetail = true }: TopListProps) {
  const visible = items.slice(0, limit)
  const max = visible[0]?.msPlayed ?? 1

  return (
    <section className="card">
      <header className="card-head">
        <h2>{title}</h2>
        <span className="card-tag">top {visible.length}</span>
      </header>

      {visible.length === 0 ? (
        <p className="empty">Sem dados suficientes.</p>
      ) : (
        <ol className="rank-list">
          {visible.map((item, index) => (
            <li key={`${item.name}-${item.detail}-${index}`}>
              <span className="rank">{index + 1}</span>
              <div className="rank-body">
                <div className="rank-line">
                  <span className="rank-name" title={item.name}>
                    {item.name}
                  </span>
                  <span className="rank-time">{formatDuration(item.msPlayed)}</span>
                </div>
                <div className="rank-bar">
                  <span style={{ width: `${Math.max(4, (item.msPlayed / max) * 100)}%` }} />
                </div>
                <div className="rank-meta">
                  <span>{showDetail ? item.detail : ''}</span>
                  <span>{formatNumber(item.plays)} reproduções</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
