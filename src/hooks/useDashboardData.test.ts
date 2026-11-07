import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { useDashboardData, type DashboardData } from './useDashboardData'
import type { Analysis } from '../lib/streaming'
import { formatDate } from '../lib/format'

function renderDashboardHook(analysis: Analysis): DashboardData {
  let data!: DashboardData
  function TestComponent() {
    data = useDashboardData(analysis)
    return null
  }
  renderToString(React.createElement(TestComponent))
  return data
}

describe('useDashboardData', () => {
  const baseAnalysis: Analysis = {
    totalMs: 7_200_000, // 2h
    totalPlays: 100,
    uniqueArtists: 15,
    uniqueTracks: 40,
    skippedPlays: 25,
    firstPlay: new Date('2023-01-01T12:00:00Z'),
    lastPlay: new Date('2023-12-31T18:00:00Z'),
    topArtists: [],
    topTracks: [],
    topAlbums: [],
    platforms: [
      { name: 'iOS', msPlayed: 5_000_000, plays: 70 },
      { name: 'Web Player', msPlayed: 2_200_000, plays: 30 },
    ],
    monthly: [
      { month: '2023-01', msPlayed: 3_600_000, plays: 50 },
      { month: '2023-02', msPlayed: 1_800_000, plays: 25 },
    ],
    hourly: Array.from({ length: 24 }, (_, i) => i * 2),
    weekdays: [10, 15, 20, 15, 20, 10, 10],
    years: [2023],
  }

  it('transforms monthly data with formatted labels and rounded hours', () => {
    const result = renderDashboardHook(baseAnalysis)

    expect(result.monthlyData).toEqual([
      { label: 'jan/2023', horas: 1, reproducoes: 50 },
      { label: 'fev/2023', horas: 0.5, reproducoes: 25 },
    ])
  })

  it('transforms hourly data into 24 points with formatted hour labels', () => {
    const result = renderDashboardHook(baseAnalysis)

    expect(result.hourlyData).toHaveLength(24)
    expect(result.hourlyData[0]).toEqual({ label: '00h', reproducoes: 0 })
    expect(result.hourlyData[14]).toEqual({ label: '14h', reproducoes: 28 })
  })

  it('transforms weekday data into 7 points matching weekday labels', () => {
    const result = renderDashboardHook(baseAnalysis)

    expect(result.weekdayData).toEqual([
      { label: 'Dom', reproducoes: 10 },
      { label: 'Seg', reproducoes: 15 },
      { label: 'Ter', reproducoes: 20 },
      { label: 'Qua', reproducoes: 15 },
      { label: 'Qui', reproducoes: 20 },
      { label: 'Sex', reproducoes: 10 },
      { label: 'Sáb', reproducoes: 10 },
    ])
  })

  it('transforms platforms into items with empty detail', () => {
    const result = renderDashboardHook(baseAnalysis)

    expect(result.platformItems).toEqual([
      { name: 'iOS', detail: '', msPlayed: 5_000_000, plays: 70 },
      { name: 'Web Player', detail: '', msPlayed: 2_200_000, plays: 30 },
    ])
  })

  it('calculates hero headline and rounded skipRate correctly', () => {
    const result = renderDashboardHook(baseAnalysis)

    expect(result.hero).toEqual({
      value: '2',
      unit: 'horas',
      caption: '100 reproduções',
    })
    expect(result.skipRate).toBe(25)
  })

  it('calculates monthTickInterval based on monthly data length', () => {
    const result = renderDashboardHook(baseAnalysis)
    expect(result.monthTickInterval).toBe(0)

    // Test with >12 months
    const longAnalysis: Analysis = {
      ...baseAnalysis,
      monthly: Array.from({ length: 26 }, (_, i) => ({
        month: `202${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`,
        msPlayed: 1_000_000,
        plays: 10,
      })),
    }
    const longResult = renderDashboardHook(longAnalysis)
    // ceil(26 / 12) - 1 = 3 - 1 = 2
    expect(longResult.monthTickInterval).toBe(2)
  })

  it('formats period range between firstPlay and lastPlay', () => {
    const result = renderDashboardHook(baseAnalysis)
    const expected = `${formatDate(baseAnalysis.firstPlay!)} — ${formatDate(baseAnalysis.lastPlay!)}`
    expect(result.period).toBe(expected)
  })

  it('handles empty / zero analysis safely', () => {
    const emptyAnalysis: Analysis = {
      totalMs: 0,
      totalPlays: 0,
      uniqueArtists: 0,
      uniqueTracks: 0,
      skippedPlays: 0,
      firstPlay: null,
      lastPlay: null,
      topArtists: [],
      topTracks: [],
      topAlbums: [],
      platforms: [],
      monthly: [],
      hourly: new Array(24).fill(0),
      weekdays: new Array(7).fill(0),
      years: [],
    }

    const result = renderDashboardHook(emptyAnalysis)

    expect(result.monthlyData).toEqual([])
    expect(result.platformItems).toEqual([])
    expect(result.skipRate).toBe(0)
    expect(result.monthTickInterval).toBe(0)
    expect(result.period).toBe('—')
    expect(result.hero).toEqual({
      value: '0',
      unit: 'minutos',
      caption: '0 reproduções',
    })
  })
})
