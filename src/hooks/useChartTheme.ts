import { useMemo } from 'react'

const DEFAULT_THEME_TOKENS: Record<string, string> = {
  '--text': '#17130f',
  '--card': '#f4eee0',
  '--border': 'rgba(23, 19, 15, 0.22)',
  '--accent': '#c2391f',
  '--accent-soft': 'rgba(194, 57, 31, 0.12)',
  '--muted': '#e2d8c2',
  '--muted-foreground': '#5c5246',
}

export function cssToken(name: string, fallback?: string): string {
  const defaultFallback = fallback ?? DEFAULT_THEME_TOKENS[name] ?? `var(${name})`
  if (typeof document === 'undefined') return defaultFallback
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return defaultFallback
  }
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || defaultFallback
}

export interface ChartTickStyle {
  fill: string
  fontSize: number
}

export interface ChartTooltipStyle {
  background: string
  border: string
  borderRadius: number
  color: string
}

export interface ChartLabelStyle {
  color: string
}

export interface ChartTheme {
  text: string
  accent: string
  grid: string
  cursor: string
  tick: ChartTickStyle
  tooltip: ChartTooltipStyle
  label: ChartLabelStyle
}

export function getChartTheme(): ChartTheme {
  const text = cssToken('--text')
  const card = cssToken('--card')
  const border = cssToken('--border')
  return {
    text,
    accent: cssToken('--accent'),
    grid: border,
    cursor: cssToken('--accent-soft'),
    tick: { fill: cssToken('--muted'), fontSize: 12 },
    tooltip: {
      background: card,
      border: `1px solid ${border}`,
      borderRadius: 2,
      color: text,
    },
    label: { color: text },
  }
}

export function useChartTheme(): ChartTheme {
  return useMemo(() => getChartTheme(), [])
}
