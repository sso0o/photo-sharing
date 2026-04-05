import client from '../../../api/client.ts'
import type { Event, CreateEventRequest } from '../types.ts'

export async function getEvents(): Promise<Event[]> {
  const { data } = await client.get<Event[]>('/events')
  return data
}

export async function createEvent(body: CreateEventRequest): Promise<Event> {
  const { data } = await client.post<Event>('/events', body)
  return data
}
