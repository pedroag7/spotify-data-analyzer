import type { Analysis } from '../../lib/streaming'
import { formatNumber } from '../../lib/format'
import { StatCard } from '../StatCard'
import { cn } from '../../lib/utils'

export interface MetricsGridProps {
  analysis: Pick<Analysis, 'uniqueArtists' | 'uniqueTracks' | 'skippedPlays'>
  skipRate: number
  className?: string
}

export function MetricsGrid({ analysis, skipRate, className }: MetricsGridProps) {
  return (
    <dl className={cn('kpi-grid grid grid-cols-1 sm:grid-cols-3 gap-3 my-8', className)}>
      <StatCard
        label="Artistas únicos"
        value={formatNumber(analysis.uniqueArtists)}
        hint="no período selecionado"
      />
      <StatCard
        label="Músicas únicas"
        value={formatNumber(analysis.uniqueTracks)}
        hint="no período selecionado"
      />
      <StatCard
        label="Taxa de skip"
        value={`${skipRate}%`}
        hint={`${formatNumber(analysis.skippedPlays)} faixas puladas`}
      />
    </dl>
  )
}
