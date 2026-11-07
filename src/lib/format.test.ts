import { describe, expect, it } from 'vitest'
import { formatDate, formatDuration, formatMonthLabel, formatNumber, heroHeadline } from './format'

describe('formatDuration', () => {
  it('shows seconds below a minute', () => {
    expect(formatDuration(0)).toBe('0s')
    expect(formatDuration(45000)).toBe('45s')
  })

  it('shows minutes below an hour', () => {
    expect(formatDuration(180000)).toBe('3min')
  })

  it('shows hours and minutes', () => {
    expect(formatDuration(3660000)).toBe('1h 1min')
    expect(formatDuration(90000000)).toBe('25h 0min')
  })
})

describe('formatNumber', () => {
  it('uses brazilian thousands separators', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })
})

describe('formatMonthLabel', () => {
  it('renders a short month and year', () => {
    expect(formatMonthLabel('2023-01')).toBe('jan/2023')
    expect(formatMonthLabel('2024-12')).toBe('dez/2024')
  })
})

describe('formatDate', () => {
  it('renders a brazilian date', () => {
    expect(formatDate(new Date(2023, 0, 5))).toBe('05/01/2023')
  })
})

describe('heroHeadline', () => {
  it('devolve valor 0 e legenda sem NaN para valores zerados ou inválidos', () => {
    const zero = heroHeadline(0, 0)
    expect(zero.value).toBe('0')
    expect(zero.caption).not.toContain('NaN')

    const invalid = heroHeadline(Number.NaN, Number.NaN)
    expect(invalid.value).toBe('0')
    expect(invalid.caption).not.toContain('NaN')

    const negative = heroHeadline(-1000, -10)
    expect(negative.value).toBe('0')
    expect(negative.caption).not.toContain('NaN')
  })

  it('formata milhares de horas no plural com separador pt-BR', () => {
    const result = heroHeadline(3_600_000 * 4212, 90000)
    expect(result.value).toBe('4.212')
    expect(result.unit).toBe('horas')
  })

  it('usa singular "hora" e valor 1 para exatamente 1 hora', () => {
    const result = heroHeadline(3_600_000, 10)
    expect(result.value).toBe('1')
    expect(result.unit).toBe('hora')
  })

  it('expressa menos de 1 hora em minutos com flexão de singular e plural', () => {
    const plural = heroHeadline(5 * 60_000, 3)
    expect(plural.value).toBe('5')
    expect(plural.unit).toBe('minutos')

    const singular = heroHeadline(60_000, 1)
    expect(singular.value).toBe('1')
    expect(singular.unit).toBe('minuto')
  })

  it('descreve as reproduções na legenda em pt-BR com flexão correta', () => {
    const plural = heroHeadline(3_600_000 * 4212, 90000)
    expect(plural.caption).toContain('90.000')
    expect(plural.caption).toContain('reproduções')

    const singular = heroHeadline(60_000, 1)
    expect(singular.caption).toContain('1')
    expect(singular.caption).toContain('reprodução')
  })
})

