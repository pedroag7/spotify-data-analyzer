import type { PlatformItem } from '../../hooks/useDashboardData'
import { cn } from '../../lib/utils'

export interface PlatformsSectionProps {
  platformItems: PlatformItem[]
  className?: string
}

export function PlatformsSection({
  platformItems,
  className,
}: PlatformsSectionProps) {
  if (!platformItems || platformItems.length === 0) return null

  const totalPlays = platformItems.reduce((acc, p) => acc + p.plays, 0)

  return (
    <section
      className={cn(
        'liner-colophon mt-12 sm:mt-16 pt-6 border-t-2 border-foreground flex flex-col gap-3 min-w-0 text-xs uppercase tracking-wider',
        className
      )}
      aria-labelledby="sec-colofao"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-2">
        <h2
          id="sec-colofao"
          className="font-display font-bold text-base sm:text-lg text-foreground m-0 tracking-tight"
        >
          Ficha Técnica · Sistemas & Dispositivos
        </h2>
        <span className="text-muted-foreground tabular-nums font-mono text-[11px]">
          {platformItems.length} plataformas registradas
        </span>
      </div>

      <p className="text-foreground leading-relaxed m-0 font-medium pt-1">
        {platformItems.map((item, index) => {
          const share = totalPlays > 0 ? Math.round((item.plays / totalPlays) * 100) : 0
          return (
            <span key={item.name} className="inline-block">
              <span className="font-semibold text-foreground">{item.name}</span>{' '}
              <span className="text-muted-foreground tabular-nums">
                ({share}% · {item.plays} plays)
              </span>
              {index < platformItems.length - 1 ? (
                <span className="mx-2 text-primary font-bold" aria-hidden="true">
                  ·
                </span>
              ) : null}
            </span>
          )
        })}
      </p>
    </section>
  )
}
