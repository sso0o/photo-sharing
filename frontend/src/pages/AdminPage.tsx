import { useNavigate } from 'react-router-dom'
import { Button, Header } from '../components/ui/index.ts'
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard.ts'
import StatCard from '../features/admin/components/StatCard.tsx'
import ErrorBanner from '../features/admin/components/ErrorBanner.tsx'
import AdminTable from '../features/admin/components/AdminTable.tsx'
import { useLogout } from '../features/auth/hooks/useLogout.ts'

export default function AdminPage() {
  const navigate = useNavigate()
  const logout = useLogout()
  const nickname = localStorage.getItem('nickname') ?? '관리자'

  const {
    stats, statsError,
    tab, users, hosts,
    totalElements, totalPages, page, search,
    loading, listError, actionError,
    setPage, setActionError,
    handleTabChange, handleSearch,
    handleRevoke, handlePromoteUser, handleNicknameSave,
  } = useAdminDashboard()

  function handleLogout() {
    logout('/login')
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

        <section className="mb-8">
          <h1 className="text-app-text-h text-2xl font-bold mb-6">대시보드</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="일반 회원" value={stats?.totalUsers ?? null} accentColor="#a855f7" error={statsError} />
            <StatCard label="호스트" value={stats?.totalHosts ?? null} accentColor="#22c55e" error={statsError} />
            <StatCard label="관리자" value={stats?.totalAdmins ?? null} accentColor="#eab308" error={statsError} />
          </div>
        </section>

        <div className="flex gap-3 mb-6 border-b border-app-border">
          <button
            onClick={() => handleTabChange('users')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              tab === 'users'
                ? 'text-accent-400 border-b-accent-400'
                : 'text-app-text border-b-transparent hover:text-app-text-h'
            }`}
          >
            일반 회원 ({stats?.totalUsers || 0})
          </button>
          <button
            onClick={() => handleTabChange('hosts')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              tab === 'hosts'
                ? 'text-accent-400 border-b-accent-400'
                : 'text-app-text border-b-transparent hover:text-app-text-h'
            }`}
          >
            호스트 ({stats?.totalHosts || 0})
          </button>
        </div>

        {actionError && (
          <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />
        )}

        <AdminTable
          key={tab}
          tab={tab}
          users={users}
          hosts={hosts}
          totalElements={totalElements}
          totalPages={totalPages}
          page={page}
          committedSearch={search}
          loading={loading}
          listError={listError}
          onPromoteUser={handlePromoteUser}
          onRevokeHost={handleRevoke}
          onNicknameSave={handleNicknameSave}
          onPageChange={setPage}
          onSearch={handleSearch}
        />
      </main>
    </div>
  )
}
