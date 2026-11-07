import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { useChartTheme, getChartTheme, cssToken, type ChartTheme } from './useChartTheme'

function renderChartThemeHook(): ChartTheme {
  let theme!: ChartTheme
  function TestComponent() {
    theme = useChartTheme()
    return null
  }
  renderToString(React.createElement(TestComponent))
  return theme
}

describe('useChartTheme and cssToken', () => {
  it('falls back to default tokens in non-browser environment', () => {
    expect(cssToken('--text')).toBe('#17130f')
    expect(cssToken('--card')).toBe('#f4eee0')
    expect(cssToken('--accent')).toBe('#c2391f')
    expect(cssToken('--nonexistent', 'fallback-val')).toBe('fallback-val')
  })

  it('builds theme object with expected properties and fallbacks', () => {
    const theme = getChartTheme()
    expect(theme.text).toBe('#17130f')
    expect(theme.accent).toBe('#c2391f')
    expect(theme.grid).toBe('rgba(23, 19, 15, 0.22)')
    expect(theme.tick.fill).toBe('#5c5246')
    expect(theme.tick.fontSize).toBe(12)
    expect(theme.tooltip.background).toBe('#f4eee0')
    expect(theme.tooltip.color).toBe('#17130f')
    expect(theme.label.color).toBe('#17130f')
  })

  it('hook returns theme successfully via useChartTheme', () => {
    const theme = renderChartThemeHook()
    expect(theme).toBeDefined()
    expect(theme.accent).toBe('#c2391f')
  })
})
