import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { StatCard } from '../../StatCard'
import { TopList } from '../../TopList'
import { DashboardHeader } from '../DashboardHeader'
import { MetricsGrid } from '../MetricsGrid'
import { TracksSection } from '../TracksSection'
import { PlatformsSection } from '../PlatformsSection'
import { Dashboard } from '../../Dashboard'
import type { Analysis } from '../../../lib/streaming'

const mockAnalysis: Analysis = {
  totalMs: 360_000_000,
  totalPlays: 1200,
  skippedPlays: 120,
  uniqueArtists: 85,
  uniqueTracks: 450,
  firstPlay: new Date('2023-01-15T10:00:00Z'),
  lastPlay: new Date('2023-12-20T22:30:00Z'),
  years: [2022, 2023],
  monthly: [
    { month: '2023-01', msPlayed: 36_000_000, plays: 120 },
    { month: '2023-02', msPlayed: 40_000_000, plays: 130 },
  ],
  hourly: Array.from({ length: 24 }, (_, i) => i * 5),
  weekdays: [100, 150, 180, 200, 220, 250, 100],
  topArtists: [
    { name: 'Radiohead', detail: '', msPlayed: 50_000_000, plays: 150 },
    { name: 'Pink Floyd', detail: '', msPlayed: 40_000_000, plays: 110 },
  ],
  topTracks: [
    { name: 'Paranoid Android', detail: 'Radiohead', msPlayed: 6_000_000, plays: 25 },
  ],
  topAlbums: [
    { name: 'OK Computer', detail: 'Radiohead', msPlayed: 30_000_000, plays: 80 },
  ],
  platforms: [
    { name: 'iOS', msPlayed: 200_000_000, plays: 700 },
    { name: 'macOS', msPlayed: 160_000_000, plays: 500 },
  ],
}

const emptyAnalysis: Analysis = {
  totalMs: 0,
  totalPlays: 0,
  skippedPlays: 0,
  uniqueArtists: 0,
  uniqueTracks: 0,
  firstPlay: null,
  lastPlay: null,
  years: [2023],
  monthly: [],
  hourly: Array.from({ length: 24 }, () => 0),
  weekdays: [0, 0, 0, 0, 0, 0, 0],
  topArtists: [],
  topTracks: [],
  topAlbums: [],
  platforms: [],
}

describe('Dashboard Modular Components', () => {
  describe('StatCard', () => {
    it('renders label, value, and hint', () => {
      const html = renderToStaticMarkup(
        <StatCard label="Artistas únicos" value="85" hint="no período selecionado" />
      )
      expect(html).toContain('Artistas únicos')
      expect(html).toContain('85')
      expect(html).toContain('no período selecionado')
      expect(html).toContain('tabular-nums')
    })
  })

  describe('TopList', () => {
    it('renders ranked items with correct labels', () => {
      const html = renderToStaticMarkup(
        <TopList title="Artistas mais ouvidos" items={mockAnalysis.topArtists} />
      )
      expect(html).toContain('Artistas mais ouvidos')
      expect(html).toContain('Radiohead')
      expect(html).toContain('Pink Floyd')
      expect(html).toContain('top 2')
    })

    it('renders empty message when no items', () => {
      const html = renderToStaticMarkup(
        <TopList title="Artistas mais ouvidos" items={[]} />
      )
      expect(html).toContain('Sem dados suficientes.')
    })
  })

  describe('DashboardHeader', () => {
    it('renders hero and edition selector', () => {
      const html = renderToStaticMarkup(
        <DashboardHeader
          analysis={mockAnalysis}
          hero={{ value: '100', unit: 'horas', caption: 'de música reproduzida' }}
          period="15 jan 2023 — 20 dez 2023"
          year={2023}
          onYearChange={() => {}}
          onReset={() => {}}
          fileCount={2}
        />
      )
      expect(html).toContain('100')
      expect(html).toContain('horas')
      expect(html).toContain('Edição')
      expect(html).toContain('Trocar arquivos')
      expect(html).toContain('2 arquivos importados')
    })

    it('renders empty state when totalPlays is 0', () => {
      const html = renderToStaticMarkup(
        <DashboardHeader
          analysis={emptyAnalysis}
          hero={{ value: '0', unit: 'min', caption: 'nenhuma reprodução' }}
          period="—"
          year={2024}
          onYearChange={() => {}}
          onReset={() => {}}
          fileCount={1}
        />
      )
      expect(html).toContain('Nenhuma reprodução em 2024.')
    })
  })

  describe('MetricsGrid', () => {
    it('renders three stat cards', () => {
      const html = renderToStaticMarkup(
        <MetricsGrid analysis={mockAnalysis} skipRate={10} />
      )
      expect(html).toContain('Artistas únicos')
      expect(html).toContain('Músicas únicas')
      expect(html).toContain('Taxa de skip')
      expect(html).toContain('10%')
    })
  })

  describe('TracksSection', () => {
    it('renders all three top lists under Repertório', () => {
      const html = renderToStaticMarkup(
        <TracksSection
          topArtists={mockAnalysis.topArtists}
          topTracks={mockAnalysis.topTracks}
          topAlbums={mockAnalysis.topAlbums}
        />
      )
      expect(html).toContain('Repertório')
      expect(html).toContain('Artistas mais ouvidos')
      expect(html).toContain('Músicas mais ouvidas')
      expect(html).toContain('Álbuns mais ouvidos')
    })
  })

  describe('PlatformsSection', () => {
    it('renders platforms colophon', () => {
      const html = renderToStaticMarkup(
        <PlatformsSection
          platformItems={mockAnalysis.platforms.map((p) => ({
            name: p.name,
            detail: '',
            msPlayed: p.msPlayed,
            plays: p.plays,
          }))}
        />
      )
      expect(html).toContain('Ficha Técnica · Sistemas &amp; Dispositivos')
      expect(html).toContain('iOS')
      expect(html).toContain('macOS')
    })
  })

  describe('Dashboard Composition', () => {
    it('renders complete dashboard tree with data', () => {
      const html = renderToStaticMarkup(
        <Dashboard
          analysis={mockAnalysis}
          year={2023}
          onYearChange={() => {}}
          onReset={() => {}}
          fileCount={2}
          errors={[]}
        />
      )
      expect(html).toContain('Repertório')
      expect(html).toContain('Evolução mensal')
      expect(html).toContain('Hábitos')
      expect(html).toContain('Obsessão Musical')
      expect(html).toContain('Ficha Técnica')
      expect(html).toContain('Processado localmente')
    })

    it('renders empty message when totalPlays is 0 without crashing and omits metrics grid', () => {
      const html = renderToStaticMarkup(
        <Dashboard
          analysis={emptyAnalysis}
          year={2024}
          onYearChange={() => {}}
          onReset={() => {}}
          fileCount={1}
          errors={[]}
        />
      )
      expect(html).toContain('Nenhuma reprodução em 2024.')
      expect(html).toContain('Voltar para todos os anos')
      expect(html).not.toContain('Artistas únicos')
    })

    it('displays error warning banner when errors are present', () => {
      const html = renderToStaticMarkup(
        <Dashboard
          analysis={mockAnalysis}
          year={undefined}
          onYearChange={() => {}}
          onReset={() => {}}
          fileCount={3}
          errors={[{ name: 'bad.json', message: 'Invalid JSON' }]}
        />
      )
      expect(html).toContain('1 arquivo(s) foram ignorados por não serem JSONs válidos.')
    })
  })
})
