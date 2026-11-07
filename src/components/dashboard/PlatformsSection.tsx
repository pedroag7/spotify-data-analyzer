import type { PlatformItem } from '../../hooks/useDashboardData'
import { TopList } from '../TopList'
import { cn } from '../../lib/utils'

export interface PlatformsSectionProps {
  platformItems: PlatformItem[]
  className?: string
}

export function PlatformsSection({
  platformItems,
  className,
}: PlatformsSectionProps) {
  return (
    <section
      className={cn('liner flex flex-col gap-6 min-w-0 mt-12 sm:mt-16', className)}
      aria-labelledby="sec-plataformas"
    >
      <h2
        className="liner-title m-0 pb-2 border-b-2 border-foreground font-display font-extrabold text-3xl sm:text-4xl uppercase leading-none tracking-tight text-foreground"
        id="sec-plataformas"
      >
        Plataformas
      </h2>
      <TopList title="Plataformas" items={platformItems} showDetail={false} />
    </section>
  )
}
