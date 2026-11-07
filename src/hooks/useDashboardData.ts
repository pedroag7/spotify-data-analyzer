import { useMemo } from 'react'
import type { Analysis } from '../lib/streaming'
import {
  WEEKDAY_LABELS,
  formatDate,
  heroHeadline,
  formatHour,
  formatMonthLabel,
} from '../lib/format'

export interface MonthlyPoint {
  label: string
  horas: number
  reproducoes: number
}
export type MonthlyDataPoint = MonthlyPoint

export interface HourlyPoint {
  label: string
  reproducoes: number
}
export type HourlyDataPoint = HourlyPoint

export interface WeekdayPoint {
  label: string
  reproducoes: number
}
export type WeekdayDataPoint = WeekdayPoint

export interface PlatformItem {
  name: string
  detail: string
  msPlayed: number
  plays: number
}

export interface HeroHeadline {
  value: string
  unit: string
  caption: string
}

export interface DashboardData {
  monthlyData: MonthlyPoint[]
  hourlyData: HourlyPoint[]
  weekdayData: WeekdayPoint[]
  platformItems: PlatformItem[]
  hero: HeroHeadline
  skipRate: number
  monthTickInterval: number
  period: string
}

export function useDashboardData(analysis: Analysis): DashboardData {
  return useMemo(() => {
    const monthlyData = analysis.monthly.map((point) => ({
      label: formatMonthLabel(point.month),
      horas: Number((point.msPlayed / 3_600_000).toFixed(1)),
      reproducoes: point.plays,
    }))

    const hourlyData = analysis.hourly.map((plays, hour) => ({
      label: formatHour(hour),
      reproducoes: plays,
    }))

    const weekdayData = WEEKDAY_LABELS.map((label, index) => ({
      label,
      reproducoes: analysis.weekdays[index] ?? 0,
    }))

    const platformItems = analysis.platforms.map((platform) => ({
      name: platform.name,
      detail: '',
      msPlayed: platform.msPlayed,
      plays: platform.plays,
    }))

    const hero = heroHeadline(analysis.totalMs, analysis.totalPlays)

    const skipRate =
      analysis.totalPlays > 0
        ? Math.round((analysis.skippedPlays / analysis.totalPlays) * 100)
        : 0

    const monthTickInterval = Math.max(0, Math.ceil(monthlyData.length / 12) - 1)

    const period =
      analysis.firstPlay && analysis.lastPlay
        ? `${formatDate(analysis.firstPlay)} — ${formatDate(analysis.lastPlay)}`
        : '—'

    return {
      monthlyData,
      hourlyData,
      weekdayData,
      platformItems,
      hero,
      skipRate,
      monthTickInterval,
      period,
    }
  }, [analysis])
}
