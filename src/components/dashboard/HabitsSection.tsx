import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HourlyPoint, WeekdayPoint } from '../../hooks/useDashboardData'
import { useChartTheme, type ChartTheme } from '../../hooks/useChartTheme'
import { formatNumber } from '../../lib/format'
import { cn } from '../../lib/utils'

export interface HabitsSectionProps {
  hourlyData: HourlyPoint[]
  weekdayData: WeekdayPoint[]
  theme?: ChartTheme
  className?: string
}

export function HabitsSection({
  hourlyData,
  weekdayData,
  theme: customTheme,
  className,
}: HabitsSectionProps) {
  const defaultTheme = useChartTheme()
  const theme = customTheme ?? defaultTheme

  return (
    <section
      className={cn('liner liner--tight flex flex-col gap-6 min-w-0 mt-10 sm:mt-12', className)}
      aria-labelledby="sec-habitos"
    >
      <h2
        className="liner-title m-0 pb-2 border-b-2 border-foreground font-display font-extrabold text-3xl sm:text-4xl uppercase leading-none tracking-tight text-foreground"
        id="sec-habitos"
      >
        Hábitos
      </h2>
      <div className="habits grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 md:gap-12">
        <div className="chart-block min-w-0">
          <div className="chart-block-head flex items-baseline justify-between gap-3 mb-3 pb-1.5 border-b border-border">
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide uppercase text-foreground m-0">
              Horário do dia
            </h3>
            <span className="chart-note shrink-0 text-xs text-muted-foreground">
              reproduções
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220} minHeight={180}>
            <BarChart
              key={`hourly-${hourlyData.reduce((a, b) => a + b.reproducoes, 0)}`}
              data={hourlyData}
              margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke={theme.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={theme.tick}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis
                tick={theme.tick}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: theme.cursor }}
                contentStyle={theme.tooltip}
                labelStyle={theme.label}
                formatter={(value) => [formatNumber(Number(value)), 'Reproduções']}
              />
              <Bar
                dataKey="reproducoes"
                fill={theme.text}
                isAnimationActive={true}
                animationDuration={300}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-block min-w-0">
          <div className="chart-block-head flex items-baseline justify-between gap-3 mb-3 pb-1.5 border-b border-border">
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide uppercase text-foreground m-0">
              Dias da semana
            </h3>
            <span className="chart-note shrink-0 text-xs text-muted-foreground">
              reproduções
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220} minHeight={180}>
            <BarChart
              key={`weekday-${weekdayData.reduce((a, b) => a + b.reproducoes, 0)}`}
              data={weekdayData}
              margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke={theme.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={theme.tick}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={theme.tick}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: theme.cursor }}
                contentStyle={theme.tooltip}
                labelStyle={theme.label}
                formatter={(value) => [formatNumber(Number(value)), 'Reproduções']}
              />
              <Bar
                dataKey="reproducoes"
                fill={theme.text}
                isAnimationActive={true}
                animationDuration={300}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
