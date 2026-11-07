import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Analysis, ParseError } from '../lib/streaming'
import {
  WEEKDAY_LABELS,
  formatDate,
  heroHeadline,
  formatHour,
  formatMonthLabel,
  formatNumber,
} from '../lib/format'
import { StatCard } from './StatCard'
import { TopList } from './TopList'

interface DashboardProps {
  analysis: Analysis
  year: number | undefined
  onYearChange: (year: number | undefined) => void
  onReset: () => void
  fileCount: number
  errors: ParseError[]
}

function cssToken(name: string): string {
  if (typeof document === 'undefined') return `var(${name})`
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || `var(${name})`
}

function chartTheme() {
  const text = cssToken('--text')
  const card = cssToken('--card')
  const border = cssToken('--border')
  return {
    text,
    accent: cssToken('--accent'),
    grid: border,
    cursor: cssToken('--accent-soft'),
    tick: { fill: cssToken('--muted'), fontSize: 12 },
    tooltip: {
      background: card,
      border: `1px solid ${border}`,
      borderRadius: 2,
      color: text,
    },
    label: { color: text },
  }
}

export function Dashboard({
  analysis,
  year,
  onYearChange,
  onReset,
  fileCount,
  errors,
}: DashboardProps) {
  const theme = chartTheme()
  const monthlyData = analysis.monthly.map((point) => ({
    label: formatMonthLabel(point.month),
    horas: Number((point.msPlayed / 3_600_000).toFixed(1)),
    reproducoes: point.plays,
  }))

  const hourlyData = analysis.hourly.map((plays, hour) => ({
    label: formatHour(hour),
    reproducoes: plays,
  }))

  const weekdayData = WEEKDAY_LABELS.map((label, index) => ({
    label,
    reproducoes: analysis.weekdays[index],
  }))

  const platformItems = analysis.platforms.map((platform) => ({
    name: platform.name,
    detail: '',
    msPlayed: platform.msPlayed,
    plays: platform.plays,
  }))

  const hero = heroHeadline(analysis.totalMs, analysis.totalPlays)

  const skipRate =
    analysis.totalPlays > 0
      ? Math.round((analysis.skippedPlays / analysis.totalPlays) * 100)
      : 0

  const monthTickInterval = Math.max(0, Math.ceil(monthlyData.length / 12) - 1)
  const period =
    analysis.firstPlay && analysis.lastPlay
      ? `${formatDate(analysis.firstPlay)} â€” ${formatDate(analysis.lastPlay)}`
      : 'â€”'

  return (
    <div className="dashboard">
      <header className="cover">
        <div className="cover-hero">
          {analysis.totalPlays === 0 ? (
            <p className="cover-empty" role="status">
              Nenhuma reproduÃ§Ã£o em {year ?? 'este perÃ­odo'}.
              <span>Escolha outro perÃ­odo para ver seus nÃºmeros.</span>
            </p>
          ) : (
            <>
              <p className="cover-number">
                <span className="cover-value">{hero.value}</span>
                <span className="cover-unit">{hero.unit}</span>
              </p>
              <p className="cover-caption">{hero.caption}</p>
            </>
          )}
        </div>

        <div className="cover-side">
          <label className="year-select">
            <span>PerÃ­odo</span>
            <select
              value={year === undefined ? 'all' : String(year)}
              onChange={(event) =>
                onYearChange(
                  event.target.value === 'all' ? undefined : Number(event.target.value),
                )
              }
            >
              <option value="all">Todos os anos</option>
              {analysis.years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <dl className="cover-period">
            <dt>PerÃ­odo</dt>
            <dd>{period}</dd>
            <dd className="cover-period-hint">primeira e Ãºltima reproduÃ§Ã£o</dd>
          </dl>
          <button type="button" className="ghost-button" onClick={onReset}>
            Trocar arquivos
          </button>
        </div>

        <p className="cover-credits">
          <strong>Spotify Data Analyzer</strong>
          <span>
            {fileCount} arquivo{fileCount === 1 ? '' : 's'} importado
            {fileCount === 1 ? '' : 's'}
          </span>
        </p>
      </header>

      {errors.length > 0 ? (
        <div className="warning-box" role="status">
          {errors.length} arquivo(s) foram ignorados por nÃ£o serem JSONs vÃ¡lidos.
        </div>
      ) : null}

      <dl className="kpi-grid">
        <StatCard
          label="Artistas Ãºnicos"
          value={formatNumber(analysis.uniqueArtists)}
          hint="no perÃ­odo selecionado"
        />
        <StatCard
          label="MÃºsicas Ãºnicas"
          value={formatNumber(analysis.uniqueTracks)}
          hint="no perÃ­odo selecionado"
        />
        <StatCard
          label="Taxa de skip"
          value={`${skipRate}%`}
          hint={`${formatNumber(analysis.skippedPlays)} faixas puladas`}
        />
      </dl>


      {analysis.totalPlays === 0 ? (
        <p className="liner-empty" role="status">
          Sem dados para exibir neste período.
        </p>
      ) : (
        <>
          <section className="liner" aria-labelledby="sec-faixas">
            <h2 className="liner-title" id="sec-faixas">Faixas</h2>
            <div className="tracks">
              <TopList title="Artistas mais ouvidos" items={analysis.topArtists} />
              <TopList title="Músicas mais ouvidas" items={analysis.topTracks} />
              <TopList title="Álbuns mais ouvidos" items={analysis.topAlbums} />
            </div>
          </section>

          <section className="liner" aria-labelledby="sec-evolucao">
            <h2 className="liner-title" id="sec-evolucao">Evolução mensal</h2>
            <div className="chart-block">
              <div className="chart-block-head">
                <h3>Horas ouvidas</h3>
                <span className="chart-note">horas ouvidas</span>
              </div>
              {monthlyData.length === 0 ? (
                <p className="empty">Sem dados no período selecionado.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280} minHeight={200}>
                  <AreaChart data={monthlyData} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke={theme.grid} vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={theme.tick}
                      axisLine={false}
                      tickLine={false}
                      interval={monthTickInterval}
                    />
                    <YAxis tick={theme.tick} axisLine={false} tickLine={false} width={44} />
                    <Tooltip
                      contentStyle={theme.tooltip}
                      labelStyle={theme.label}
                      formatter={(value, name) =>
                        name === 'horas'
                          ? [`${value} h`, 'Tempo']
                          : [formatNumber(Number(value)), 'Reproduções']
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="horas"
                      stroke={theme.text}
                      strokeWidth={2}
                      fill={theme.accent}
                      fillOpacity={0.14}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section className="liner liner--tight" aria-labelledby="sec-habitos">
            <h2 className="liner-title" id="sec-habitos">Hábitos</h2>
            <div className="habits">
              <div className="chart-block">
                <div className="chart-block-head">
                  <h3>Horário do dia</h3>
                  <span className="chart-note">reproduções</span>
                </div>
                <ResponsiveContainer width="100%" height={220} minHeight={180}>
                  <BarChart data={hourlyData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke={theme.grid} vertical={false} />
                    <XAxis dataKey="label" tick={theme.tick} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={theme.tick} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: theme.cursor }}
                      contentStyle={theme.tooltip}
                      labelStyle={theme.label}
                      formatter={(value) => [formatNumber(Number(value)), 'Reproduções']}
                    />
                    <Bar dataKey="reproducoes" fill={theme.text} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-block">
                <div className="chart-block-head">
                  <h3>Dias da semana</h3>
                  <span className="chart-note">reproduções</span>
                </div>
                <ResponsiveContainer width="100%" height={220} minHeight={180}>
                  <BarChart data={weekdayData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke={theme.grid} vertical={false} />
                    <XAxis dataKey="label" tick={theme.tick} axisLine={false} tickLine={false} />
                    <YAxis tick={theme.tick} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: theme.cursor }}
                      contentStyle={theme.tooltip}
                      labelStyle={theme.label}
                      formatter={(value) => [formatNumber(Number(value)), 'Reproduções']}
                    />
                    <Bar dataKey="reproducoes" fill={theme.text} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="liner" aria-labelledby="sec-plataformas">
            <h2 className="liner-title" id="sec-plataformas">Plataformas</h2>
            <TopList title="Onde você ouve" items={platformItems} showDetail={false} />
          </section>
        </>
      )}

      <footer className="footer">
        <span>Processado localmente no seu navegador Â· seus dados nÃ£o saem daqui</span>
      </footer>
    </div>
  )
}
