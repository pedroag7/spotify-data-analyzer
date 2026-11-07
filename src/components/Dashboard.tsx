import type { Analysis, ParseError } from '../lib/streaming'
import { useDashboardData } from '../hooks/useDashboardData'
import { useChartTheme } from '../hooks/useChartTheme'
import { DashboardHeader } from './dashboard/DashboardHeader'
import { MetricsGrid } from './dashboard/MetricsGrid'
import { TracksSection } from './dashboard/TracksSection'
import { EvolutionSection } from './dashboard/EvolutionSection'
import { HabitsSection } from './dashboard/HabitsSection'
import { PlatformsSection } from './dashboard/PlatformsSection'

export interface DashboardProps {
  analysis: Analysis
  year: number | undefined
  onYearChange: (year: number | undefined) => void
  onReset: () => void
  fileCount: number
  errors: ParseError[]
}

export function Dashboard({
  analysis,
  year,
  onYearChange,
  onReset,
  fileCount,
  errors,
}: DashboardProps) {
  const chartTheme = useChartTheme()
  const {
    monthlyData,
    hourlyData,
    weekdayData,
    platformItems,
    hero,
    skipRate,
    monthTickInterval,
    period,
  } = useDashboardData(analysis)

  return (
    <div className="dashboard mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 md:py-12 min-h-screen">
      <DashboardHeader
        analysis={analysis}
        hero={hero}
        period={period}
        year={year}
        onYearChange={onYearChange}
        onReset={onReset}
        fileCount={fileCount}
      />

      {errors.length > 0 ? (
        <div
          className="warning-box mb-6 rounded-[2px] border border-[var(--warning)] bg-card p-3.5 text-sm text-[var(--warning)]"
          role="status"
        >
          {errors.length} arquivo(s) foram ignorados por não serem JSONs válidos.
        </div>
      ) : null}

      <MetricsGrid analysis={analysis} skipRate={skipRate} />

      {analysis.totalPlays === 0 ? (
        <p
          className="liner-empty mt-14 py-8 border-y border-border font-display text-2xl sm:text-3xl font-bold uppercase text-muted-foreground"
          role="status"
        >
          Sem dados para exibir neste período.
        </p>
      ) : (
        <>
          <TracksSection
            topArtists={analysis.topArtists}
            topTracks={analysis.topTracks}
            topAlbums={analysis.topAlbums}
          />

          <EvolutionSection
            monthlyData={monthlyData}
            monthTickInterval={monthTickInterval}
            theme={chartTheme}
          />

          <HabitsSection
            hourlyData={hourlyData}
            weekdayData={weekdayData}
            theme={chartTheme}
          />

          <PlatformsSection platformItems={platformItems} />
        </>
      )}

      <footer className="footer mt-16 pt-6 border-t border-border text-xs uppercase tracking-wider text-muted-foreground text-center">
        <span>Processado localmente no seu navegador · seus dados não saem daqui</span>
      </footer>
    </div>
  )
}
