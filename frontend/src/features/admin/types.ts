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

export interface UserSummary {
  id: string
  email: string
  nickname: string
  createdAt: string
}

export interface UsersPage {
  content: UserSummary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
