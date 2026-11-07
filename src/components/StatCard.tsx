import { Card } from './ui/card'
import { cn } from '../lib/utils'

export interface StatCardProps {
  label: string
  value: string
  hint?: string
  className?: string
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        'stat-card flex flex-col justify-between gap-1 p-4 sm:p-5 border-border bg-card/60 rounded-[2px] min-w-0',
        className
      )}
    >
      <dt className="stat-label text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="stat-value font-display text-3xl sm:text-4xl font-bold leading-tight text-foreground tabular-nums m-0">
        {value}
      </dd>
      {hint ? (
        <dd className="stat-hint text-xs text-muted-foreground m-0">
          {hint}
        </dd>
      ) : null}
    </Card>
  )
}
