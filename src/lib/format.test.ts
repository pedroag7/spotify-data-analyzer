import { describe, expect, it } from 'vitest'
import { formatDate, formatDuration, formatMonthLabel, formatNumber } from './format'

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
