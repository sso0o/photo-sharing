import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Container } from '../components/ui/index.ts'
import SiteHeader from '../components/SiteHeader.tsx'
import { useEvents } from '../features/event/hooks/useEvents.ts'
import EventCreateForm from '../features/event/components/EventCreateForm.tsx'

export default function EventPage() {
  const navigate = useNavigate()
  const { events, loading, error, fetchEvents, addEvent } = useEvents()
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
      return
    }
    fetchEvents()
  }, [navigate, fetchEvents])

  return (
    <div className="min-h-screen bg-app-bg">
      <SiteHeader />

      <Container maxWidth="7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-app-text-h text-3xl font-semibold mb-1">이벤트</h1>
              <p className="text-app-text text-sm">이벤트를 관리하고 확인하세요</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateForm(prev => !prev)}
            >
              {showCreateForm ? '✕ 취소' : '+ 새 이벤트'}
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {showCreateForm && (
            <EventCreateForm
              onSubmit={addEvent}
              onCancel={() => setShowCreateForm(false)}
            />
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface-800 border border-app-border rounded-lg p-6 space-y-3">
                <div className="h-5 w-3/4 bg-surface-700 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-surface-700 rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-700 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-surface-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-app-text mb-4">아직 이벤트가 없습니다</p>
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              첫 이벤트 만들기
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                title={event.title}
                subtitle={new Date(event.createdAt).toLocaleDateString('ko-KR')}
                hover
              >
                <p className="text-app-text text-sm mb-4">
                  {event.description || '설명 없음'}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
