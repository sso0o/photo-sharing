import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Header } from '../components/ui/index.ts'
import {
  getStats,
  getHosts,
  promoteToHost,
  revokeHostRole,
  updateHostNickname,
  type AdminStats,
  type HostSummary,
} from '../api/adminService.ts'

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, accentColor }: { label: string; value: number | null; accentColor: string }) {
  return (
    <div className="bg-surface-800 border border-app-border rounded-lg p-6 border-l-4" style={{ borderLeftColor: accentColor }}>
      <p className="text-app-text text-sm mb-1">{label}</p>
      {value === null ? (
        <div className="h-8 w-16 bg-surface-700 rounded animate-pulse" />
      ) : (
        <p className="text-app-text-h text-3xl font-bold">{value.toLocaleString()}</p>
      )}
    </div>
  )
}

// ── Inline edit cell ────────────────────────────────────────────────────────

function NicknameCell({
  host,
  onSave,
}: {
  host: HostSummary
  onSave: (id: string, nickname: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(host.nickname)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (value.trim() === host.nickname || !value.trim()) {
      setEditing(false)
      return
    }
    setSaving(true)
    await onSave(host.id, value.trim())
    setSaving(false)
    setEditing(false)
  }

  if (!editing) {
    return (
      <button
        className="text-app-text-h text-left hover:text-accent-400 transition-colors"
        onClick={() => setEditing(true)}
        title="클릭하여 닉네임 수정"
      >
        {host.nickname}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        className="bg-surface-700 border border-app-border rounded px-2 py-1 text-app-text-h text-sm w-32 focus:outline-none focus:border-accent-400"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') { setValue(host.nickname); setEditing(false) }
        }}
        disabled={saving}
      />
      <Button size="sm" variant="primary" onClick={handleSave} disabled={saving}>저장</Button>
      <Button size="sm" variant="ghost" onClick={() => { setValue(host.nickname); setEditing(false) }}>취소</Button>
    </div>
  )
}

// ── Promote modal ───────────────────────────────────────────────────────────

function PromoteModal({ onConfirm, onClose }: { onConfirm: (userId: string) => Promise<void>; onClose: () => void }) {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!userId.trim()) return
    setLoading(true)
    setError('')
    try {
      await onConfirm(userId.trim())
      onClose()
    } catch {
      setError('호스트 승격에 실패했습니다. 사용자 ID를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-surface-800 border border-app-border rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-app-text-h font-semibold text-lg mb-4">호스트 승격</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-app-text text-sm mb-1 block">사용자 ID</label>
            <input
              autoFocus
              className="w-full bg-surface-700 border border-app-border rounded px-3 py-2 text-app-text-h text-sm focus:outline-none focus:border-accent-400"
              placeholder="MongoDB ObjectId"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose} disabled={loading}>취소</Button>
            <Button type="submit" variant="primary" disabled={loading || !userId.trim()}>
              {loading ? '처리 중...' : '승격'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const navigate = useNavigate()
  const nickname = localStorage.getItem('nickname') ?? '관리자'

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [hosts, setHosts] = useState<HostSummary[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPromoteModal, setShowPromoteModal] = useState(false)

  const PAGE_SIZE = 10

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('nickname')
    localStorage.removeItem('role')
    navigate('/login')
  }

  // fetch stats once
  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => {})
  }, [])

  const fetchHosts = useCallback(() => {
    setLoading(true)
    getHosts({ page, size: PAGE_SIZE, sort: 'createdAt', direction: 'desc', nickname: search || undefined })
      .then(res => {
        setHosts(res.content)
        setTotalElements(res.totalElements)
        setTotalPages(res.totalPages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, search])

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  async function handleRevoke(id: string) {
    if (!confirm('호스트 권한을 회수하시겠습니까?')) return
    await revokeHostRole(id)
    fetchHosts()
    getStats().then(setStats).catch(() => {})
  }

  async function handleNicknameSave(id: string, newNickname: string) {
    await updateHostNickname(id, newNickname)
    setHosts(prev => prev.map(h => h.id === id ? { ...h, nickname: newNickname } : h))
  }

  async function handlePromote(userId: string) {
    await promoteToHost(userId)
    fetchHosts()
    getStats().then(setStats).catch(() => {})
  }

  function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setPage(0)
    setSearch(searchInput)
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header
        brand="PhotoShare Admin"
        actions={
          <>
            <span className="text-app-text text-sm">{nickname}님</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>사이트로 이동</Button>
            <Button variant="secondary" size="sm" onClick={handleLogout}>로그아웃</Button>
          </>
        }
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <section className="mb-8">
          <h1 className="text-app-text-h text-2xl font-bold mb-6">대시보드</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="일반 회원" value={stats?.totalUsers ?? null} accentColor="#a855f7" />
            <StatCard label="호스트" value={stats?.totalHosts ?? null} accentColor="#22c55e" />
            <StatCard label="관리자" value={stats?.totalAdmins ?? null} accentColor="#eab308" />
          </div>
        </section>

        {/* Hosts table */}
        <Card>
          {/* Table header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-app-text-h font-semibold text-lg">호스트 관리</h2>
              <p className="text-app-text text-sm">총 {totalElements.toLocaleString()}명</p>
            </div>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  className="bg-surface-700 border border-app-border rounded px-3 py-1.5 text-app-text-h text-sm focus:outline-none focus:border-accent-400 w-40"
                  placeholder="닉네임 검색"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
                <Button type="submit" variant="secondary" size="sm">검색</Button>
                {search && (
                  <Button variant="ghost" size="sm" onClick={() => { setSearchInput(''); setSearch(''); setPage(0) }}>
                    초기화
                  </Button>
                )}
              </form>
              <Button variant="primary" size="sm" onClick={() => setShowPromoteModal(true)}>
                + 호스트 승격
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-app-border text-app-text text-left">
                  <th className="pb-3 pr-4 font-medium">닉네임</th>
                  <th className="pb-3 pr-4 font-medium">이메일</th>
                  <th className="pb-3 pr-4 font-medium">등록일</th>
                  <th className="pb-3 font-medium text-right">작업</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-app-border">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="py-3 pr-4">
                          <div className="h-4 bg-surface-700 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : hosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-app-text">
                      {search ? `"${search}" 검색 결과가 없습니다.` : '등록된 호스트가 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  hosts.map(host => (
                    <tr key={host.id} className="border-b border-app-border last:border-0 hover:bg-surface-700/30 transition-colors">
                      <td className="py-3 pr-4">
                        <NicknameCell host={host} onSave={handleNicknameSave} />
                      </td>
                      <td className="py-3 pr-4 text-app-text">{host.email}</td>
                      <td className="py-3 pr-4 text-app-text">
                        {new Date(host.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleRevoke(host.id)}
                        >
                          권한 회수
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-app-border">
              <p className="text-app-text text-sm">
                {page + 1} / {totalPages} 페이지
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  이전
                </Button>
                <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  다음
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>

      {showPromoteModal && (
        <PromoteModal
          onConfirm={handlePromote}
          onClose={() => setShowPromoteModal(false)}
        />
      )}
    </div>
  )
}
