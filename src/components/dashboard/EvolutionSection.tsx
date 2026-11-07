import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyPoint } from '../../hooks/useDashboardData'
import { useChartTheme, type ChartTheme } from '../../hooks/useChartTheme'
import { formatNumber } from '../../lib/format'
import { cn } from '../../lib/utils'

export interface EvolutionSectionProps {
  monthlyData: MonthlyPoint[]
  monthTickInterval: number
  theme?: ChartTheme
  className?: string
}

export function EvolutionSection({
  monthlyData,
  monthTickInterval,
  theme: customTheme,
  className,
}: EvolutionSectionProps) {
  const defaultTheme = useChartTheme()
  const theme = customTheme ?? defaultTheme

  return (
    <section
      className={cn('liner flex flex-col gap-6 min-w-0 mt-12 sm:mt-16', className)}
      aria-labelledby="sec-evolucao"
    >
      <h2
        className="liner-title m-0 pb-2 border-b-2 border-foreground font-display font-extrabold text-3xl sm:text-4xl uppercase leading-none tracking-tight text-foreground"
        id="sec-evolucao"
      >
        Evolução mensal
      </h2>
      <div className="chart-block min-w-0">
        <div className="chart-block-head flex items-baseline justify-between gap-3 mb-3 pb-1.5 border-b border-border">
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide uppercase text-foreground m-0">
            Horas ouvidas
          </h3>
          <span className="chart-note shrink-0 text-xs text-muted-foreground">
            horas ouvidas
          </span>
        </div>
        {monthlyData.length === 0 ? (
          <p className="empty py-4 text-sm text-muted-foreground">
            Sem dados no período selecionado.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280} minHeight={200}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 12, right: 8, left: -12, bottom: 0 }}
            >
              <CartesianGrid stroke={theme.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={theme.tick}
                axisLine={false}
                tickLine={false}
                interval={monthTickInterval}
              />
              <YAxis
                tick={theme.tick}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                contentStyle={theme.tooltip}
                labelStyle={theme.label}
                formatter={(value, name) =>
                  name === 'horas'
                    ? [`${value} h`, 'Tempo']
                    : [formatNumber(Number(value)), 'Reproduções']
                }
              />
              <Area
                type="monotone"
                dataKey="horas"
                stroke={theme.text}
                strokeWidth={2}
                fill={theme.accent}
                fillOpacity={0.14}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}
