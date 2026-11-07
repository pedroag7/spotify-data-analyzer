interface StatCardProps {
  label: string
  value: string
  hint?: string
  wide?: boolean
  accent?: boolean
}

export function StatCard({ label, value, hint, wide, accent }: StatCardProps) {
  return (
    <article className={`stat-card${wide ? ' stat-card--wide' : ''}${accent ? ' stat-card--accent' : ''}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint ? <span className="stat-hint">{hint}</span> : null}
    </article>
  )
}
