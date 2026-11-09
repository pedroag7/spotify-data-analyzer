import type { RankedItem } from '../../lib/streaming'
import { formatDuration } from '../../lib/format'
import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../lib/utils'

export interface TopObsessionSectionProps {
  topTracks: RankedItem[]
  className?: string
}

export function TopObsessionSection({
  topTracks,
  className,
}: TopObsessionSectionProps) {
  if (!topTracks || topTracks.length === 0) return null

  // A faixa mais repetida em contagem absoluta de reproduções
  const mostRepeated = [...topTracks].sort((a, b) => b.plays - a.plays)[0]
  const animatedPlays = useCountUp(mostRepeated?.plays ?? 0, 450)
  if (!mostRepeated || mostRepeated.plays <= 0) return null

  return (
    <section
      className={cn(
        'liner-highlight mt-12 sm:mt-16 p-6 sm:p-8 border-2 border-foreground bg-card flex flex-col md:flex-row md:items-end justify-between gap-6',
        'transition-[border-color,box-shadow] duration-200 [transition-timing-function:var(--ease-out)] hover:border-primary',
        className
      )}
      aria-labelledby="sec-obsessao"
    >
      <div className="flex flex-col gap-2 min-w-0 max-w-2xl">
        <h2
          id="sec-obsessao"
          className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-primary m-0"
        >
          Obsessão Musical
        </h2>
        <p className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground m-0 leading-none truncate">
          {mostRepeated.name}
        </p>
        {mostRepeated.detail ? (
          <p className="text-base sm:text-lg text-muted-foreground m-0 font-medium">
            {mostRepeated.detail}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-baseline gap-4 md:text-right shrink-0">
        <div className="flex flex-col">
          <span className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tabular-nums leading-none">
            {animatedPlays}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            reproduções
          </span>
        </div>
        <div className="hidden sm:block text-2xl text-border font-light" aria-hidden="true">
          /
        </div>
        <div className="flex flex-col">
          <span className="font-display text-2xl sm:text-3xl font-bold text-primary tabular-nums leading-none">
            {formatDuration(mostRepeated.msPlayed)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            tempo total
          </span>
        </div>
      </div>
    </section>
  )
}
