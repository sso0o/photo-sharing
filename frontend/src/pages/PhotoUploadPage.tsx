import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { Button, Card, Container } from '../components/ui/index.ts'
import SiteHeader from '../components/SiteHeader.tsx'
import { useEvents } from '../features/event/hooks/useEvents.ts'
import { usePhotoUpload } from '../features/photo/hooks/usePhotoUpload.ts'
import EventItem from '../features/photo/components/EventItem.tsx'
import SuccessBanner from '../features/photo/components/SuccessBanner.tsx'

export default function PhotoUploadPage() {
  const navigate = useNavigate()
  const { events, loading: loadingEvents, error: eventsError, fetchEvents } = useEvents()
  const { fileInputRef, file, uploading, uploadError, uploadSuccess, handleFileChange, upload, dismissSuccess } = usePhotoUpload()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
      return
    }
    fetchEvents()
  }, [navigate, fetchEvents])

  async function handleUpload(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    await upload(selectedEventId)
  }

  const selectedEvent = events.find(e => e.id === selectedEventId) ?? null

  return (
    <div className="min-h-screen bg-app-bg">
      <SiteHeader />

      <Container maxWidth="7xl">
        <div className="mb-8">
          <h1 className="text-app-text-h text-3xl font-semibold mb-1">사진 업로드</h1>
          <p className="text-app-text text-sm">이벤트를 선택하고 사진을 업로드하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 이벤트 목록 */}
          <div className="lg:col-span-2 space-y-3">
            {loadingEvents ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-800 border border-app-border rounded-lg p-5 space-y-2">
                  <div className="h-4 w-1/2 bg-surface-700 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-surface-700 rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-surface-700 rounded animate-pulse" />
                </div>
              ))
            ) : eventsError ? (
              <Card>
                <p className="text-red-400 text-sm text-center py-4">{eventsError}</p>
              </Card>
            ) : events.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-app-text mb-4">등록된 이벤트가 없습니다</p>
                <Button variant="primary" onClick={() => navigate('/events')}>
                  이벤트 만들기
                </Button>
              </Card>
            ) : (
              events.map(event => (
                <EventItem
                  key={event.id}
                  event={event}
                  selected={selectedEventId === event.id}
                  onSelect={setSelectedEventId}
                />
              ))
            )}
          </div>

          {/* QR 코드 & 업로드 폼 */}
          <div className="space-y-4">
            {selectedEvent ? (
              <>
                <Card title="이벤트 QR 코드">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-lg">
                      <QRCode
                        value={`${window.location.origin}/events/${selectedEvent.id}`}
                        size={160}
                        level="H"
                      />
                    </div>
                    <p className="text-app-text text-xs text-center opacity-60">
                      스캔하여 이벤트 페이지로 이동
                    </p>
                  </div>
                </Card>

                <Card title="사진 업로드">
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                      <label className="block text-app-text-h text-sm font-medium mb-2">
                        사진 선택
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-app-border rounded bg-app-bg text-app-text text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-surface-700 file:text-app-text-h file:text-sm file:cursor-pointer"
                      />
                      {file && (
                        <p className="text-app-text text-xs mt-1.5 opacity-60 truncate">
                          {file.name}
                        </p>
                      )}
                    </div>

                    {uploadError && (
                      <p className="text-red-400 text-sm">{uploadError}</p>
                    )}
                    {uploadSuccess && (
                      <SuccessBanner onDismiss={dismissSuccess} />
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={uploading || !file}
                    >
                      {uploading ? '업로드 중...' : '업로드'}
                    </Button>
                  </form>
                </Card>
              </>
            ) : (
              <Card className="text-center py-10">
                <p className="text-app-text text-sm opacity-60">
                  이벤트를 선택하면<br />QR 코드와 업로드 폼이 나타납니다
                </p>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
