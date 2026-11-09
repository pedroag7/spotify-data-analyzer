import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { useCountUp } from './useCountUp'

function TestComponent({ value }: { value: string }) {
  const animated = useCountUp(value)
  return <span>{animated}</span>
}

describe('useCountUp', () => {
  it('returns initial string value synchronously for SSR / static markup', () => {
    const html = renderToStaticMarkup(<TestComponent value="1.200" />)
    expect(html).toContain('1.200')
  })

  it('renders percentage strings synchronously', () => {
    const html = renderToStaticMarkup(<TestComponent value="28%" />)
    expect(html).toContain('28%')
  })

  it('renders non-numeric strings as is', () => {
    const html = renderToStaticMarkup(<TestComponent value="N/A" />)
    expect(html).toContain('N/A')
  })
})
