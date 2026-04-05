interface StatCardProps {
  label: string
  value: number | null
  accentColor: string
  error?: boolean
}

export default function StatCard({ label, value, accentColor, error }: StatCardProps) {
  return (
    <div
      className="bg-surface-800 border border-app-border rounded-lg p-6 border-l-4"
      style={{ borderLeftColor: accentColor }}
    >
      <p className="text-app-text text-sm mb-1">{label}</p>
      {error ? (
        <p className="text-red-400 text-sm">불러오기 실패</p>
      ) : value === null ? (
        <div className="h-8 w-16 bg-surface-700 rounded animate-pulse" />
      ) : (
        <p className="text-app-text-h text-3xl font-bold">{value.toLocaleString()}</p>
      )}
    </div>
  )
}
