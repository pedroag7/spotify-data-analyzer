interface StatCardProps {
  label: string
  value: string
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="stat-card">
      <dt className="stat-label">{label}</dt>
      <dd className="stat-value">{value}</dd>
      {hint ? <dd className="stat-hint">{hint}</dd> : null}
    </div>
  )
}
