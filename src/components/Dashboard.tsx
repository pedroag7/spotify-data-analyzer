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
  formatDuration,
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

const tooltipStyle = {
  background: '#141a16',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 12,
  color: '#eef5f0',
}

const axisTick = { fill: '#8fa096', fontSize: 12 }

export function Dashboard({
  analysis,
  year,
  onYearChange,
  onReset,
  fileCount,
  errors,
}: DashboardProps) {
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

  const skipRate =
    analysis.totalPlays > 0
      ? Math.round((analysis.skippedPlays / analysis.totalPlays) * 100)
      : 0

  const monthTickInterval = Math.max(0, Math.ceil(monthlyData.length / 12) - 1)
  const period =
    analysis.firstPlay && analysis.lastPlay
      ? `${formatDate(analysis.firstPlay)} — ${formatDate(analysis.lastPlay)}`
      : '—'

  return (
    <div className="dashboard">
      <div className="dashboard-glow" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <div>
            <strong>Spotify Data Analyzer</strong>
            <span>
              {fileCount} arquivo{fileCount === 1 ? '' : 's'} importado
              {fileCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="topbar-actions">
          <label className="year-select">
            <span>Período</span>
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
          <button type="button" className="ghost-button" onClick={onReset}>
            Trocar arquivos
          </button>
        </div>
      </header>

      {errors.length > 0 ? (
        <div className="warning-box" role="status">
          {errors.length} arquivo(s) foram ignorados por não serem JSONs válidos.
        </div>
      ) : null}

      <section className="kpi-grid">
        <StatCard
          label="Tempo ouvido"
          value={formatDuration(analysis.totalMs)}
          hint={`${formatNumber(analysis.totalPlays)} reproduções`}
          accent
        />
        <StatCard
          label="Artistas únicos"
          value={formatNumber(analysis.uniqueArtists)}
          hint="no período selecionado"
        />
        <StatCard
          label="Músicas únicas"
          value={formatNumber(analysis.uniqueTracks)}
          hint="no período selecionado"
        />
        <StatCard
          label="Taxa de skip"
          value={`${skipRate}%`}
          hint={`${formatNumber(analysis.skippedPlays)} faixas puladas`}
        />
        <StatCard label="Período" value={period} hint="primeira e última reprodução" wide />
      </section>

      <section className="chart-grid">
        <article className="card card--wide">
          <header className="card-head">
            <h2>Evolução mensal</h2>
            <span className="card-tag">horas ouvidas</span>
          </header>
          {monthlyData.length === 0 ? (
            <p className="empty">Sem dados no período selecionado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1ed760" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#1ed760" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  interval={monthTickInterval}
                />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={44} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: '#eef5f0' }}
                  formatter={(value, name) =>
                    name === 'horas'
                      ? [`${value} h`, 'Tempo']
                      : [formatNumber(Number(value)), 'Reproduções']
                  }
                />
                <Area
                  type="monotone"
                  dataKey="horas"
                  stroke="#1ed760"
                  strokeWidth={2}
                  fill="url(#monthlyFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </article>

        <article className="card">
          <header className="card-head">
            <h2>Horário do dia</h2>
            <span className="card-tag">reproduções</span>
          </header>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(30, 215, 96, 0.08)' }}
                contentStyle={tooltipStyle}
                labelStyle={{ color: '#eef5f0' }}
                formatter={(value) => [formatNumber(Number(value)), 'Reproduções']}
              />
              <Bar dataKey="reproducoes" fill="#1ed760" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="card">
          <header className="card-head">
            <h2>Dias da semana</h2>
            <span className="card-tag">reproduções</span>
          </header>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekdayData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(30, 215, 96, 0.08)' }}
                contentStyle={tooltipStyle}
                labelStyle={{ color: '#eef5f0' }}
                formatter={(value) => [formatNumber(Number(value)), 'Reproduções']}
              />
              <Bar dataKey="reproducoes" fill="#1ed760" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <TopList title="Artistas mais ouvidos" items={analysis.topArtists} />
        <TopList title="Músicas mais ouvidas" items={analysis.topTracks} />
        <TopList title="Álbuns mais ouvidos" items={analysis.topAlbums} />
        <TopList title="Plataformas" items={platformItems} showDetail={false} />
      </section>

      <footer className="footer">
        <span>Processado localmente no seu navegador · seus dados não saem daqui</span>
      </footer>
    </div>
  )
}
