import type { Analysis } from '../../lib/streaming'
import type { HeroHeadline } from '../../hooks/useDashboardData'
import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { cn } from '../../lib/utils'

export interface DashboardHeaderProps {
  analysis: Pick<Analysis, 'totalPlays' | 'years'>
  hero: HeroHeadline
  period: string
  year: number | undefined
  onYearChange: (year: number | undefined) => void
  onReset: () => void
  fileCount: number
  className?: string
}

export function DashboardHeader({
  analysis,
  hero,
  period,
  year,
  onYearChange,
  onReset,
  fileCount,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        'cover grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-8 md:gap-12 pb-8 mb-8 border-b-2 border-foreground',
        className
      )}
    >
      <div className="cover-hero min-w-0">
        {analysis.totalPlays === 0 ? (
          <h1
            className="cover-empty font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground m-0"
            role="status"
          >
            Nenhuma reprodução em {year ?? 'este período'}.
            <span className="block mt-2 font-sans text-base font-normal text-muted-foreground">
              Escolha outro período para ver seus números.
            </span>
          </h1>
        ) : (
          <>
            <h1 className="cover-number flex flex-wrap items-baseline gap-x-4 gap-y-1 m-0 leading-none">
              <span className="cover-value font-display text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-foreground tabular-nums">
                {hero.value}
              </span>
              <span className="cover-unit font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-primary">
                {hero.unit}
              </span>
            </h1>
            <p className="cover-caption mt-3 text-lg sm:text-xl leading-snug text-muted-foreground max-w-prose">
              {hero.caption}
            </p>
          </>
        )}
      </div>

      <div className="cover-side flex flex-col gap-5 min-w-0">
        <label className="year-select flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Edição</span>
          <Select
            value={year === undefined ? 'all' : String(year)}
            onChange={(event) =>
              onYearChange(
                event.target.value === 'all' ? undefined : Number(event.target.value)
              )
            }
          >
            <option value="all">Todos os anos</option>
            {analysis.years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>

        <dl className="cover-period flex flex-col gap-0.5 m-0">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Período
          </dt>
          <dd className="text-sm sm:text-base font-semibold text-foreground m-0 tabular-nums">
            {period}
          </dd>
          <dd className="cover-period-hint text-xs font-normal text-muted-foreground m-0">
            primeira e última reprodução
          </dd>
        </dl>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="ghost-button self-start text-xs font-semibold tracking-wider uppercase border border-border"
        >
          Trocar arquivos
        </Button>
      </div>

      <p className="cover-credits md:col-span-2 pt-3 border-t border-border flex justify-between items-baseline gap-4 m-0 text-xs uppercase tracking-wider text-muted-foreground">
        <strong className="font-bold text-foreground">Spotify Data Analyzer</strong>
        <span>
          {fileCount} arquivo{fileCount === 1 ? '' : 's'} importado
          {fileCount === 1 ? '' : 's'}
        </span>
      </p>
    </header>
  )
}
