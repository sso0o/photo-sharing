import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Header, Container } from '../components/ui/index.ts'
import { useLogout } from '../hooks/useLogout.ts'

interface Event {
  id: string
  title: string
  description?: string
  createdByUserId: string
  createdAt: string
}

export default function EventPage() {
  const navigate = useNavigate()
  const logout = useLogout()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [creating, setCreating] = useState(false)

  const accessToken = localStorage.getItem('accessToken')
  const nickname = localStorage.getItem('nickname') ?? '회원'

  useEffect(() => {
    if (!accessToken) {
      navigate('/login')
      return
    }
    fetchEvents()
  }, [accessToken, navigate])

  async function fetchEvents() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:8080/events', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Event title is required')
      return
    }

    try {
      setCreating(true)
      setError(null)
      const response = await fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      })

      if (!response.ok) throw new Error('Failed to create event')

      const newEvent = await response.json()
      setEvents([newEvent, ...events])
      setFormData({ title: '', description: '' })
      setShowCreateForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setCreating(false)
    }
  }

  function handleLogout() {
    logout('/')
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header
        brand="PhotoShare"
        nav={
          <>
            <a href="#" className="hover:text-app-text-h transition-colors">Gallery</a>
            <a href="#" className="hover:text-app-text-h transition-colors">Upload</a>
            <a href="#" className="hover:text-app-text-h transition-colors">Events</a>
          </>
        }
        actions={
          <>
            <span className="text-app-text-h text-sm">{nickname}님</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>로그아웃</Button>
          </>
        }
      />

      <Container maxWidth="7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-app-text-h text-3xl font-semibold mb-1">Events</h1>
              <p className="text-app-text text-sm">Manage and view events</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? '✕ Cancel' : '+ New Event'}
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {showCreateForm && (
            <Card title="Create New Event" className="mb-8">
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <Input
                  label="Event Title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-app-text-h text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-app-border rounded bg-app-bg text-app-text placeholder-app-text/50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Enter event description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Event'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowCreateForm(false)
                      setFormData({ title: '', description: '' })
                      setError(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-app-text">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-app-text mb-4">No events yet</p>
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              Create your first event
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                title={event.title}
                subtitle={new Date(event.createdAt).toLocaleDateString()}
                hover
              >
                <p className="text-app-text text-sm mb-4">
                  {event.description || 'No description'}
                </p>
                {/*<p className="text-app-text text-xs opacity-75">*/}
                {/*  By: {event.createdByUserId}*/}
                {/*</p>*/}
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
