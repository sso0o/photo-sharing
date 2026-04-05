import client from './client.ts'

export interface AdminStats {
  totalUsers: number
  totalHosts: number
  totalAdmins: number
}

export interface HostSummary {
  id: string
  email: string
  nickname: string
  createdAt: string
}

export interface HostDetail extends HostSummary {
  role: string
}

export interface HostsPage {
  content: HostSummary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export async function getStats(): Promise<AdminStats> {
  const { data } = await client.get<AdminStats>('/admin/hosts/stats')
  return data
}

export async function getHosts(params: {
  page?: number
  size?: number
  sort?: string
  direction?: string
  nickname?: string
}): Promise<HostsPage> {
  const { data } = await client.get<HostsPage>('/admin/hosts', { params })
  return data
}

export async function promoteToHost(userId: string): Promise<HostDetail> {
  const { data } = await client.post<HostDetail>('/admin/hosts', { userId })
  return data
}

export async function revokeHostRole(id: string): Promise<void> {
  await client.delete(`/admin/hosts/${id}/role`)
}

export async function updateHostNickname(id: string, nickname: string): Promise<HostDetail> {
  const { data } = await client.put<HostDetail>(`/admin/hosts/${id}`, { nickname })
  return data
}
