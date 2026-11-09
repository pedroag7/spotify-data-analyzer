import { Card } from './ui/card'
import { useCountUp } from '../hooks/useCountUp'
import { cn } from '../lib/utils'

export interface StatCardProps {
  label: string
  value: string
  hint?: string
  className?: string
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  const animatedValue = useCountUp(value)

  return (
    <Card
      className={cn(
        'stat-card flex flex-col justify-between gap-1 p-4 sm:p-5 border-border bg-card/60 rounded-[2px] min-w-0',
        'transition-[background-color,border-color,transform] duration-150 [transition-timing-function:var(--ease-out)]',
        'hover:bg-card hover:border-foreground/40 hover:-translate-y-0.5',
        className
      )}
    >
      <dt className="stat-label text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="stat-value font-display text-3xl sm:text-4xl font-bold leading-tight text-foreground tabular-nums m-0">
        {animatedValue}
      </dd>
      {hint ? (
        <dd className="stat-hint text-xs text-muted-foreground m-0">
          {hint}
        </dd>
      ) : null}
    </Card>
  )
}
