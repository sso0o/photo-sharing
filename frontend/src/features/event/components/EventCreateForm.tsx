import { useState } from 'react'
import { Button, Input, Card } from '../../../components/ui/index.ts'
import type { CreateEventRequest } from '../types.ts'

interface EventCreateFormProps {
  onSubmit: (data: CreateEventRequest) => Promise<unknown>
  onCancel: () => void
}

export default function EventCreateForm({ onSubmit, onCancel }: EventCreateFormProps) {
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('이벤트 제목을 입력해주세요.')
      return
    }

    try {
      setCreating(true)
      setError(null)
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description || undefined,
      })
      handleCancel()
    } catch {
      setError('이벤트 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setCreating(false)
    }
  }

  function handleCancel() {
    setFormData({ title: '', description: '' })
    setError(null)
    onCancel()
  }

  return (
    <Card title="새 이벤트 만들기" className="mb-8">
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="이벤트 제목"
          placeholder="이벤트 제목을 입력하세요"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-app-text-h text-sm font-medium mb-2">설명</label>
          <textarea
            className="w-full px-3 py-2 border border-app-border rounded bg-app-bg text-app-text placeholder-app-text/50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="이벤트 설명을 입력하세요 (선택 사항)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={creating}>
            {creating ? '생성 중...' : '이벤트 생성'}
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancel}>
            취소
          </Button>
        </div>
      </form>
    </Card>
  )
}
