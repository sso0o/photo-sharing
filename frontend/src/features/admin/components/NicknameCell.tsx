import { useState } from 'react'
import { Button } from '../../../components/ui/index.ts'
import type { HostSummary } from '../types.ts'

interface NicknameCellProps {
  host: HostSummary
  onSave: (id: string, nickname: string) => Promise<void>
}

export default function NicknameCell({ host, onSave }: NicknameCellProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(host.nickname)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleSave() {
    if (value.trim() === host.nickname || !value.trim()) {
      setEditing(false)
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      await onSave(host.id, value.trim())
      setEditing(false)
    } catch {
      setSaveError('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setValue(host.nickname); setEditing(false) }
  }

  if (!editing) {
    return (
      <button
        className="text-app-text-h text-left hover:text-accent-400 transition-colors"
        onClick={() => setEditing(true)}
        title="클릭하여 닉네임 수정"
      >
        {host.nickname}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          className="bg-surface-700 border border-app-border rounded px-2 py-1 text-app-text-h text-sm w-32 focus:outline-none focus:border-accent-400"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={saving}
        />
        <Button size="sm" variant="primary" onClick={handleSave} disabled={saving}>저장</Button>
        <Button size="sm" variant="ghost" onClick={() => { setValue(host.nickname); setEditing(false) }}>취소</Button>
      </div>
      {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
    </div>
  )
}
