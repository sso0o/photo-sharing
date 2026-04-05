export interface Event {
  id: string
  title: string
  description?: string
  createdAt: string
}

export interface CreateEventRequest {
  title: string
  description?: string
}
