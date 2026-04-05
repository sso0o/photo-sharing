import { useState, useCallback } from 'react'
import { getEvents, createEvent } from '../api/eventService.ts'
import type { Event, CreateEventRequest } from '../types.ts'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEvents()
      setEvents(data)
    } catch {
      setError('이벤트 목록을 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addEvent = useCallback(async (body: CreateEventRequest): Promise<Event> => {
    const newEvent = await createEvent(body)
    setEvents(prev => [newEvent, ...prev])
    return newEvent
  }, [])

  return { events, loading, error, fetchEvents, addEvent }
}
