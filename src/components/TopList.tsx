import type { RankedItem } from '../lib/streaming'
import { formatDuration, formatNumber } from '../lib/format'
import { cn } from '../lib/utils'

export interface TopListProps {
  title: string
  items: RankedItem[]
  limit?: number
  showDetail?: boolean
  className?: string
}

export function TopList({
  title,
  items,
  limit = 10,
  showDetail = true,
  className,
}: TopListProps) {
  const visible = items.slice(0, limit)
  const max = visible[0]?.msPlayed || 1

  return (
    <section className={cn('ranking min-w-0', className)}>
      <header className="ranking-head flex items-baseline justify-between gap-3 mb-3 pb-1.5 border-b border-border">
        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide uppercase text-foreground m-0">
          {title}
        </h3>
        <span className="chart-note shrink-0 text-xs text-muted-foreground">
          top {visible.length}
        </span>
      </header>

      {visible.length === 0 ? (
        <p className="empty py-4 text-sm text-muted-foreground">Sem dados suficientes.</p>
      ) : (
        <ol className="ranking-list list-none m-0 p-0">
          {visible.map((item, index) => {
            const isFirst = index === 0
            return (
              <li
                key={`${item.name}-${item.detail}-${index}`}
                className={cn(
                  'grid items-start gap-3 border-b border-border transition-colors duration-150 hover:bg-muted/30 px-1 -mx-1 rounded-[2px]',
                  isFirst
                    ? 'grid-cols-[2.5rem_minmax(0,1fr)] py-3.5'
                    : 'grid-cols-[2rem_minmax(0,1fr)] py-2.5 min-h-[44px]'
                )}
              >
                <span
                  className={cn(
                    'rank font-display font-bold tabular-nums',
                    isFirst
                      ? 'text-3xl sm:text-4xl leading-none text-primary'
                      : 'text-base sm:text-lg leading-snug text-muted-foreground'
                  )}
                >
                  {index + 1}
                </span>
                <div className="rank-body min-w-0">
                  <div className="rank-line flex items-baseline justify-between gap-3 text-sm sm:text-base">
                    <span
                      className={cn(
                        'rank-name min-w-0 truncate',
                        isFirst
                          ? 'font-display text-xl sm:text-2xl font-extrabold uppercase leading-tight'
                          : 'font-semibold text-foreground'
                      )}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <span className="rank-time shrink-0 text-xs text-muted-foreground tabular-nums">
                      {formatDuration(item.msPlayed)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'rank-bar my-1.5 bg-muted rounded-[2px] overflow-hidden',
                      isFirst ? 'h-1' : 'h-[3px]'
                    )}
                  >
                    <span
                      key={`${item.name}-${item.msPlayed}`}
                      className="animate-bar block w-full h-full bg-foreground origin-left transition-transform duration-250 [transition-timing-function:var(--ease-out)] motion-reduce:transition-none motion-reduce:animation-none"
                      style={{
                        transform: `scaleX(${Math.max(0.04, item.msPlayed / max)})`,
                        animationDelay: `${index * 30}ms`,
                      }}
                    />
                  </div>
                  <div className="rank-meta flex justify-between gap-3 text-xs text-muted-foreground">
                    <span className="min-w-0 truncate" title={showDetail ? item.detail : undefined}>
                      {showDetail ? item.detail : ''}
                    </span>
                    <span className="shrink-0 tabular-nums" title={`${formatNumber(item.plays)} reproduções`}>
                      {formatNumber(item.plays)} reproduções
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
