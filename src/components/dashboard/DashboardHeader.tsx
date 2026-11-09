import { useState, useRef, useEffect } from 'react'
import type { Analysis } from '../../lib/streaming'
import type { HeroHeadline } from '../../hooks/useDashboardData'
import { useCountUp } from '../../hooks/useCountUp'
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
  const animatedHeroValue = useCountUp(hero.value, 500)
  const [confirmReset, setConfirmReset] = useState(false)
  const resetTimerRef = useRef<number | null>(null)

  const handleResetClick = () => {
    if (confirmReset) {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = null
      }
      setConfirmReset(false)
      onReset()
    } else {
      setConfirmReset(true)
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
      resetTimerRef.current = window.setTimeout(() => {
        setConfirmReset(false)
        resetTimerRef.current = null
      }, 3000)
    }
  }

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  return (
    <header
      className={cn(
        'cover grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-8 md:gap-12 pb-8 mb-8 border-b-2 border-foreground',
        className
      )}
    >
      <div className="cover-hero min-w-0">
        {analysis.totalPlays === 0 ? (
          <div className="cover-empty" role="status">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground m-0">
              Nenhuma reprodução em {year ?? 'este período'}.
            </h1>
            <p className="mt-2 font-sans text-base font-normal text-muted-foreground">
              Não encontramos registros de áudio para esta edição do histórico.
            </p>
            {year !== undefined ? (
              <button
                type="button"
                onClick={() => onYearChange(undefined)}
                className="mt-4 inline-flex items-center gap-1.5 border-b border-foreground pb-0.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
              >
                ← Voltar para todos os anos
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <h1 className="cover-number flex flex-wrap items-baseline gap-x-4 gap-y-1 m-0 leading-none">
              <span className="cover-value font-display text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-foreground tabular-nums">
                {animatedHeroValue}
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
          onClick={handleResetClick}
          className={cn(
            'ghost-button self-start text-xs font-semibold tracking-wider uppercase border border-border',
            'transition-[background-color,border-color,color] duration-160 [transition-timing-function:var(--ease-out)]',
            confirmReset &&
              'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-bold'
          )}
          aria-live="polite"
        >
          {confirmReset ? 'Descartar dados? Confirmar' : 'Trocar arquivos'}
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
