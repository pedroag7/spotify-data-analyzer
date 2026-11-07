import { describe, expect, it } from 'vitest'
import {
  analyze,
  parseStreamingFiles,
  parseStreamingJson,
  type StreamEntry,
} from './streaming'

const extendedEntry = {
  ts: '2023-01-15T10:30:00',
  platform: 'ios',
  ms_played: 180000,
  master_metadata_track_name: 'Song A',
  master_metadata_album_artist_name: 'Artist X',
  master_metadata_album_album_name: 'Album One',
  spotify_track_uri: 'spotify:track:1',
  episode_name: null,
  episode_show_name: null,
  spotify_episode_uri: null,
  reason_start: 'trackdone',
  reason_end: 'trackdone',
  skipped: false,
}

function entry(overrides: Partial<StreamEntry> = {}): StreamEntry {
  return {
    timestamp: new Date('2023-01-15T10:30:00'),
    msPlayed: 180000,
    trackName: 'Song A',
    artistName: 'Artist X',
    albumName: 'Album One',
    trackUri: 'spotify:track:1',
    episodeName: null,
    showName: null,
    platform: 'ios',
    skipped: false,
    reasonStart: 'trackdone',
    reasonEnd: 'trackdone',
    ...overrides,
  }
}

describe('parseStreamingJson', () => {
  it('maps the extended streaming history format', () => {
    const [parsed] = parseStreamingJson([extendedEntry])

    expect(parsed.timestamp).toEqual(new Date('2023-01-15T10:30:00'))
    expect(parsed.msPlayed).toBe(180000)
    expect(parsed.trackName).toBe('Song A')
    expect(parsed.artistName).toBe('Artist X')
    expect(parsed.albumName).toBe('Album One')
    expect(parsed.platform).toBe('ios')
    expect(parsed.skipped).toBe(false)
  })

  it('maps the basic streaming history format', () => {
    const [parsed] = parseStreamingJson([
      {
        endTime: '2023-02-01 18:45',
        artistName: 'Artist Y',
        trackName: 'Song B',
        msPlayed: 60000,
      },
    ])

    expect(parsed.timestamp).toEqual(new Date('2023-02-01T18:45:00'))
    expect(parsed.trackName).toBe('Song B')
    expect(parsed.artistName).toBe('Artist Y')
    expect(parsed.albumName).toBeNull()
    expect(parsed.skipped).toBe(false)
  })

  it('keeps podcast episodes separate from music fields', () => {
    const [parsed] = parseStreamingJson([
      {
        ...extendedEntry,
        master_metadata_track_name: null,
        master_metadata_album_artist_name: null,
        master_metadata_album_album_name: null,
        spotify_track_uri: null,
        episode_name: 'Episode 1',
        episode_show_name: 'Show Z',
      },
    ])

    expect(parsed.trackName).toBeNull()
    expect(parsed.episodeName).toBe('Episode 1')
    expect(parsed.showName).toBe('Show Z')
  })

  it('ignores entries without a valid timestamp and non-array input', () => {
    expect(parseStreamingJson([{ ...extendedEntry, ts: 'not a date' }])).toEqual([])
    expect(parseStreamingJson({ entries: [] })).toEqual([])
  })
})

describe('parseStreamingFiles', () => {
  it('collects entries from several files and reports broken ones', () => {
    const result = parseStreamingFiles([
      { name: 'history-1.json', text: JSON.stringify([extendedEntry]) },
      { name: 'history-2.json', text: JSON.stringify([{ ...extendedEntry, ts: '2023-03-01T08:00:00' }]) },
      { name: 'broken.json', text: '{ not json' },
    ])

    expect(result.entries).toHaveLength(2)
    expect(result.errors).toEqual([
      { name: 'broken.json', message: expect.any(String) },
    ])
  })
})

describe('analyze', () => {
  const entries: StreamEntry[] = [
    entry({ msPlayed: 180000 }),
    entry({ msPlayed: 120000, timestamp: new Date('2023-01-15T11:15:00') }),
    entry({
      msPlayed: 200000,
      trackName: 'Song B',
      artistName: 'Artist Y',
      albumName: 'Album Two',
      trackUri: 'spotify:track:2',
      timestamp: new Date('2023-02-02T23:05:00'),
      skipped: true,
    }),
    entry({
      msPlayed: 90000,
      trackName: 'Song C',
      artistName: 'Artist Y',
      albumName: 'Album Two',
      trackUri: 'spotify:track:3',
      timestamp: new Date('2024-02-02T23:05:00'),
    }),
    entry({
      msPlayed: 30000,
      trackName: null,
      artistName: null,
      albumName: null,
      trackUri: null,
      episodeName: 'Episode 1',
      showName: 'Show Z',
      timestamp: new Date('2024-02-03T09:00:00'),
    }),
  ]

  it('computes totals, unique counts and date range', () => {
    const result = analyze(entries)

    expect(result.totalMs).toBe(620000)
    expect(result.totalPlays).toBe(5)
    expect(result.uniqueArtists).toBe(2)
    expect(result.uniqueTracks).toBe(3)
    expect(result.skippedPlays).toBe(1)
    expect(result.firstPlay).toEqual(new Date('2023-01-15T10:30:00'))
    expect(result.lastPlay).toEqual(new Date('2024-02-03T09:00:00'))
  })

  it('ranks artists by listening time and counts plays', () => {
    const result = analyze(entries)

    expect(result.topArtists[0]).toMatchObject({
      name: 'Artist X',
      plays: 2,
      msPlayed: 300000,
    })
    expect(result.topArtists[1]).toMatchObject({
      name: 'Artist Y',
      plays: 2,
      msPlayed: 290000,
    })
    expect(result.topArtists).toHaveLength(2)
  })

  it('ranks tracks by listening time with artist as detail', () => {
    const result = analyze(entries)

    expect(result.topTracks[0]).toMatchObject({
      name: 'Song A',
      detail: 'Artist X',
      plays: 2,
      msPlayed: 300000,
    })
    expect(result.topTracks.map((track) => track.name)).toEqual([
      'Song A',
      'Song B',
      'Song C',
    ])
  })

  it('filters by year and rolls listening time up by month', () => {
    const result = analyze(entries, 2023)

    expect(result.totalPlays).toBe(3)
    expect(result.totalMs).toBe(500000)
    expect(result.monthly).toEqual([
      { month: '2023-01', plays: 2, msPlayed: 300000 },
      { month: '2023-02', plays: 1, msPlayed: 200000 },
    ])
    expect(result.years).toEqual([2023, 2024])
  })

  it('builds 24-hour and 7-day play distributions', () => {
    const result = analyze(entries, 2023)

    expect(result.hourly).toHaveLength(24)
    expect(result.weekdays).toHaveLength(7)
    expect(result.hourly[10]).toBe(1)
    expect(result.hourly[11]).toBe(1)
    expect(result.hourly[23]).toBe(1)
    expect(result.weekdays[0]).toBe(2)
  })

  it('ranks platforms', () => {
    const result = analyze(entries)

    expect(result.platforms).toEqual([{ name: 'ios', plays: 5, msPlayed: 620000 }])
  })
})
