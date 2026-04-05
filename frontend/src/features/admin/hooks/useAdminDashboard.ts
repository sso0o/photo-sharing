import { useState, useCallback, useRef, useEffect } from 'react'
import {
  getStats,
  getUsers,
  getHosts,
  promoteToHost,
  revokeHostRole,
  updateHostNickname,
} from '../api/adminService.ts'
import type { AdminStats, UserSummary, HostSummary } from '../types.ts'

const PAGE_SIZE = 10

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsError, setStatsError] = useState(false)
  const [tab, setTab] = useState<'users' | 'hosts'>('users')
  const [users, setUsers] = useState<UserSummary[]>([])
  const [hosts, setHosts] = useState<HostSummary[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const actionErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showActionError(message: string) {
    if (actionErrorTimer.current) clearTimeout(actionErrorTimer.current)
    setActionError(message)
    actionErrorTimer.current = setTimeout(() => setActionError(null), 5000)
  }

  function refreshStats() {
    getStats().then(setStats).catch(() => setStatsError(true))
  }

  const fetchUsers = useCallback(() => {
    setLoading(true)
    setListError(null)
    getUsers({ page, size: PAGE_SIZE, sort: 'createdAt', direction: 'desc', nickname: search || undefined })
      .then(res => {
        setUsers(res.content)
        setTotalElements(res.totalElements)
        setTotalPages(res.totalPages)
      })
      .catch(() => setListError('회원 목록을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [page, search])

  const fetchHosts = useCallback(() => {
    setLoading(true)
    setListError(null)
    getHosts({ page, size: PAGE_SIZE, sort: 'createdAt', direction: 'desc', nickname: search || undefined })
      .then(res => {
        setHosts(res.content)
        setTotalElements(res.totalElements)
        setTotalPages(res.totalPages)
      })
      .catch(() => setListError('호스트 목록을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [page, search])

  useEffect(() => {
    refreshStats()
  }, [])

  useEffect(() => {
    if (tab === 'users') {
      fetchUsers()
    } else {
      fetchHosts()
    }
  }, [tab, fetchUsers, fetchHosts])

  async function handleRevoke(id: string) {
    if (!confirm('호스트 권한을 회수하시겠습니까?')) return
    try {
      await revokeHostRole(id)
      fetchHosts()
      refreshStats()
    } catch {
      showActionError('권한 회수에 실패했습니다. 다시 시도해주세요.')
    }
  }

  async function handlePromoteUser(id: string) {
    if (!confirm('이 사용자를 호스트로 승격하시겠습니까?')) return
    try {
      await promoteToHost(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      refreshStats()
    } catch {
      showActionError('호스트 승격에 실패했습니다. 다시 시도해주세요.')
    }
  }

  async function handleNicknameSave(id: string, newNickname: string) {
    await updateHostNickname(id, newNickname)
    setHosts(prev => prev.map(h => h.id === id ? { ...h, nickname: newNickname } : h))
  }

  function handleTabChange(newTab: 'users' | 'hosts') {
    setTab(newTab)
    setPage(0)
    setSearch('')
  }

  function handleSearch(value: string) {
    setPage(0)
    setSearch(value)
  }

  return {
    stats,
    statsError,
    tab,
    users,
    hosts,
    totalElements,
    totalPages,
    page,
    search,
    loading,
    listError,
    actionError,
    setPage,
    setActionError,
    handleTabChange,
    handleSearch,
    handleRevoke,
    handlePromoteUser,
    handleNicknameSave,
  }
}
