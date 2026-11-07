const MONTHS_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) return `${hours}h ${minutes}min`
  if (minutes > 0) return `${minutes}min`
  return `${totalSeconds}s`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-')
  return `${MONTHS_SHORT[Number(month) - 1]}/${year}`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}h`
}

export function heroHeadline(
  totalMs: number,
  totalPlays: number
): { value: string; unit: string; caption: string } {
  const safeMs = Number.isFinite(totalMs) && totalMs > 0 ? totalMs : 0
  const safePlays = Number.isFinite(totalPlays) && totalPlays > 0 ? Math.floor(totalPlays) : 0

  const oneHourMs = 3_600_000
  const oneMinuteMs = 60_000

  let value: string
  let unit: string

  if (safeMs >= oneHourMs) {
    const hours = Math.floor(safeMs / oneHourMs)
    value = formatNumber(hours)
    unit = hours === 1 ? 'hora' : 'horas'
  } else {
    const minutes = Math.floor(safeMs / oneMinuteMs)
    value = formatNumber(minutes)
    unit = minutes === 1 ? 'minuto' : 'minutos'
  }

  const playsLabel = safePlays === 1 ? 'reprodução' : 'reproduções'
  const caption = `${formatNumber(safePlays)} ${playsLabel}`

  return { value, unit, caption }
}

