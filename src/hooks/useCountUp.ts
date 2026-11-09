import { useEffect, useRef, useState } from 'react'

/**
 * Animate a formatted number or percentage string over time.
 * If prefers-reduced-motion is active or the value cannot be parsed,
 * it returns the target value immediately.
 */
export function useCountUp(value: string | number, durationMs: number = 400): string {
  const stringValue = String(value)
  const [display, setDisplay] = useState(stringValue)
  const prevValueRef = useRef<number>(0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // If running outside browser, return immediately
    if (typeof window === 'undefined') {
      setDisplay(stringValue)
      return
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplay(stringValue)
      return
    }

    // Parse numeric target from formatted string (e.g. "1.200" -> 1200, "28%" -> 28)
    const isPercent = stringValue.includes('%')
    const digitsOnly = stringValue.replace(/[^\d]/g, '')
    const target = parseInt(digitsOnly, 10)

    if (Number.isNaN(target)) {
      setDisplay(stringValue)
      return
    }

    const start = isFirstRender.current ? 0 : prevValueRef.current
    isFirstRender.current = false
    prevValueRef.current = target

    if (start === target) {
      setDisplay(stringValue)
      return
    }

    const startTime = performance.now()
    let rafId: number

    // Strong ease-out: cubic-bezier(0.23, 1, 0.32, 1) approx: 1 - (1 - t)^3.5
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.5)

    const formatValue = (num: number) => {
      const formatted = new Intl.NumberFormat('pt-BR').format(num)
      return isPercent ? `${formatted}%` : formatted
    }

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      const current = Math.round(start + (target - start) * easeOut(progress))

      setDisplay(formatValue(current))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setDisplay(stringValue)
      }
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [stringValue, durationMs])

  return display
}

