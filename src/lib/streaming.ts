export interface StreamEntry {
  timestamp: Date
  msPlayed: number
  trackName: string | null
  artistName: string | null
  albumName: string | null
  trackUri: string | null
  episodeName: string | null
  showName: string | null
  platform: string | null
  skipped: boolean
  reasonStart: string | null
  reasonEnd: string | null
}

export interface ParseError {
  name: string
  message: string
}

export interface ParseResult {
  entries: StreamEntry[]
  errors: ParseError[]
}

export interface RankedItem {
  name: string
  detail: string
  msPlayed: number
  plays: number
}

export interface MonthlyPoint {
  month: string
  msPlayed: number
  plays: number
}

export interface PlatformStat {
  name: string
  msPlayed: number
  plays: number
}

export interface Analysis {
  totalMs: number
  totalPlays: number
  uniqueArtists: number
  uniqueTracks: number
  skippedPlays: number
  firstPlay: Date | null
  lastPlay: Date | null
  topArtists: RankedItem[]
  topTracks: RankedItem[]
  topAlbums: RankedItem[]
  platforms: PlatformStat[]
  monthly: MonthlyPoint[]
  hourly: number[]
  weekdays: number[]
  years: number[]
}

type RawRecord = Record<string, unknown>

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().replace(' ', 'T')
  if (normalized === '') return null
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

function parseRecord(record: RawRecord): StreamEntry | null {
  if ('ts' in record) {
    const timestamp = parseDate(record.ts)
    if (!timestamp) return null

    return {
      timestamp,
      msPlayed: Math.max(0, asNumber(record.ms_played)),
      trackName: asString(record.master_metadata_track_name),
      artistName: asString(record.master_metadata_album_artist_name),
      albumName: asString(record.master_metadata_album_album_name),
      trackUri: asString(record.spotify_track_uri),
      episodeName: asString(record.episode_name),
      showName: asString(record.episode_show_name),
      platform: asString(record.platform),
      skipped: record.skipped === true,
      reasonStart: asString(record.reason_start),
      reasonEnd: asString(record.reason_end),
    }
  }

  if ('endTime' in record) {
    const timestamp = parseDate(record.endTime)
    if (!timestamp) return null

    return {
      timestamp,
      msPlayed: Math.max(0, asNumber(record.msPlayed)),
      trackName: asString(record.trackName),
      artistName: asString(record.artistName),
      albumName: null,
      trackUri: null,
      episodeName: null,
      showName: null,
      platform: null,
      skipped: false,
      reasonStart: null,
      reasonEnd: null,
    }
  }

  return null
}

export function parseStreamingJson(raw: unknown): StreamEntry[] {
  if (!Array.isArray(raw)) return []

  const entries: StreamEntry[] = []
  for (const item of raw) {
    if (item === null || typeof item !== 'object') continue
    const parsed = parseRecord(item as RawRecord)
    if (parsed) entries.push(parsed)
  }
  return entries
}

export function parseStreamingFiles(
  files: { name: string; text: string }[],
): ParseResult {
  const entries: StreamEntry[] = []
  const errors: ParseError[] = []

  for (const file of files) {
    try {
      entries.push(...parseStreamingJson(JSON.parse(file.text)))
    } catch (error) {
      errors.push({
        name: file.name,
        message: error instanceof Error ? error.message : 'Invalid JSON file',
      })
    }
  }

  return { entries, errors }
}

function localMonthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

function rank(
  pairs: { name: string; detail: string; msPlayed: number; plays: number }[],
): RankedItem[] {
  const grouped = new Map<string, RankedItem>()

  for (const pair of pairs) {
    const key = `${pair.name}\u0000${pair.detail}`
    const current = grouped.get(key)
    if (current) {
      current.msPlayed += pair.msPlayed
      current.plays += pair.plays
    } else {
      grouped.set(key, { ...pair })
    }
  }

  return [...grouped.values()].sort(
    (a, b) => b.msPlayed - a.msPlayed || b.plays - a.plays || a.name.localeCompare(b.name),
  )
}

export function analyze(entries: StreamEntry[], year?: number): Analysis {
  const years = [
    ...new Set(entries.map((entry) => entry.timestamp.getFullYear())),
  ].sort((a, b) => a - b)

  const filtered =
    year === undefined
      ? entries
      : entries.filter((entry) => entry.timestamp.getFullYear() === year)

  const monthly = new Map<string, MonthlyPoint>()
  const artistPairs: Parameters<typeof rank>[0] = []
  const trackPairs: Parameters<typeof rank>[0] = []
  const albumPairs: Parameters<typeof rank>[0] = []
  const platformPairs: Parameters<typeof rank>[0] = []
  const hourly = new Array<number>(24).fill(0)
  const weekdays = new Array<number>(7).fill(0)

  let totalMs = 0
  let totalPlays = 0
  let skippedPlays = 0
  let firstPlay: Date | null = null
  let lastPlay: Date | null = null
  const artists = new Set<string>()
  const tracks = new Set<string>()

  for (const entry of filtered) {
    const isPlay = entry.msPlayed > 0
    if (isPlay) {
      totalPlays += 1
      hourly[entry.timestamp.getHours()] += 1
      weekdays[entry.timestamp.getDay()] += 1
    }

    totalMs += entry.msPlayed
    if (entry.skipped) skippedPlays += 1

    if (!firstPlay || entry.timestamp < firstPlay) firstPlay = entry.timestamp
    if (!lastPlay || entry.timestamp > lastPlay) lastPlay = entry.timestamp

    const monthKey = localMonthKey(entry.timestamp)
    const month = monthly.get(monthKey) ?? { month: monthKey, msPlayed: 0, plays: 0 }
    month.msPlayed += entry.msPlayed
    if (isPlay) month.plays += 1
    monthly.set(monthKey, month)

    const platform = entry.platform ?? 'Desconhecida'
    platformPairs.push({ name: platform, detail: '', msPlayed: entry.msPlayed, plays: isPlay ? 1 : 0 })

    if (entry.artistName) {
      artists.add(entry.artistName)
      artistPairs.push({
        name: entry.artistName,
        detail: '',
        msPlayed: entry.msPlayed,
        plays: isPlay ? 1 : 0,
      })
    }

    if (entry.trackName) {
      const artist = entry.artistName ?? 'Artista desconhecido'
      tracks.add(`${entry.trackName}\u0000${artist}`)
      trackPairs.push({
        name: entry.trackName,
        detail: artist,
        msPlayed: entry.msPlayed,
        plays: isPlay ? 1 : 0,
      })

      if (entry.albumName) {
        albumPairs.push({
          name: entry.albumName,
          detail: artist,
          msPlayed: entry.msPlayed,
          plays: isPlay ? 1 : 0,
        })
      }
    }
  }

  return {
    totalMs,
    totalPlays,
    uniqueArtists: artists.size,
    uniqueTracks: tracks.size,
    skippedPlays,
    firstPlay,
    lastPlay,
    topArtists: rank(artistPairs),
    topTracks: rank(trackPairs),
    topAlbums: rank(albumPairs),
    platforms: rank(platformPairs).map(({ name, msPlayed, plays }) => ({
      name,
      msPlayed,
      plays,
    })),
    monthly: [...monthly.values()].sort((a, b) => a.month.localeCompare(b.month)),
    hourly,
    weekdays,
    years,
  }
}
