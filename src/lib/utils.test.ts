import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('combines class names correctly', () => {
    expect(cn('p-4', 'text-center')).toBe('p-4 text-center')
  })

  it('resolves conflicting tailwind classes via tailwind-merge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles falsy values', () => {
    const isHidden = false
    expect(cn('btn', isHidden && 'hidden', undefined, null)).toBe('btn')
  })
})
