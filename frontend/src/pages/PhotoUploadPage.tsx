import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { Button, Card, Header, Container } from '../components/ui/index.ts'
import { useLogout } from '../hooks/useLogout.ts'

interface Event {
  id: string
  title: string
  description?: string
  createdByUserId: string
  createdAt: string
}

export default function PhotoUploadPage() {
  const navigate = useNavigate()
  const logout = useLogout()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedEventId) {
      setError('Please select an event')
      return
    }

    if (!file) {
      setError('Please select a file')
      return
    }

    try {
      setUploading(true)
      setError(null)

      // Get presigned URL
      const presignedResponse = await fetch('http://localhost:8080/photos/presigned-url', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!presignedResponse.ok) throw new Error('Failed to get presigned URL')
      const { presignedUrl } = await presignedResponse.json()

      // Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!uploadResponse.ok) throw new Error('Failed to upload file')

      setFile(null)
      setSelectedEventId(null)
      setError(null)
      alert('Photo uploaded successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleLogout() {
    logout('/')
  }

  const selectedEvent = events.find(e => e.id === selectedEventId)

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
          <h1 className="text-app-text-h text-3xl font-semibold mb-1">Upload Photo</h1>
          <p className="text-app-text text-sm">Upload a photo to an event</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event List */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <p className="text-app-text">Loading events...</p>
              </Card>
            ) : events.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-app-text mb-4">No events available</p>
                <Button variant="primary" onClick={() => navigate('/events')}>
                  Create an event first
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    hover
                    className={`cursor-pointer transition-all ${
                      selectedEventId === event.id
                        ? 'ring-2 ring-accent-500'
                        : ''
                    }`}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-app-text-h text-lg font-semibold mb-1">
                          {event.title}
                        </h3>
                        <p className="text-app-text text-sm mb-2">
                          {event.description || 'No description'}
                        </p>
                        <p className="text-app-text text-xs opacity-75">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <input
                          type="radio"
                          name="event"
                          value={event.id}
                          checked={selectedEventId === event.id}
                          onChange={(e) => setSelectedEventId(e.target.value)}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* QR Code and Upload Form */}
          <div>
            {selectedEvent ? (
              <div className="space-y-6">
                {/* QR Code */}
                <Card title="Event QR Code" className="flex flex-col items-center">
                  <QRCode
                    value={`${window.location.origin}/events/${selectedEvent.id}`}
                    size={200}
                    level="H"
                    className="mb-4"
                  />
                  <p className="text-app-text text-xs text-center opacity-75">
                    Scan to view event
                  </p>
                </Card>

                {/* Upload Form */}
                <Card title="Upload Photo">
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                      <label className="block text-app-text-h text-sm font-medium mb-2">
                        Select Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-app-border rounded bg-app-bg text-app-text"
                      />
                      {file && (
                        <p className="text-app-text text-xs mt-2 opacity-75">
                          Selected: {file.name}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={uploading || !file}
                    >
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </form>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-8">
                <p className="text-app-text text-sm">
                  Select an event to view its QR code and upload a photo
                </p>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
