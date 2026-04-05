import { useState } from 'react'
import { Button, Card } from '../../../components/ui/index.ts'
import NicknameCell from './NicknameCell.tsx'
import type { UserSummary, HostSummary } from '../types.ts'

interface AdminTableProps {
  tab: 'users' | 'hosts'
  users: UserSummary[]
  hosts: HostSummary[]
  totalElements: number
  totalPages: number
  page: number
  committedSearch: string
  loading: boolean
  listError: string | null
  onPromoteUser: (id: string) => void
  onRevokeHost: (id: string) => void
  onNicknameSave: (id: string, nickname: string) => Promise<void>
  onPageChange: (page: number) => void
  onSearch: (value: string) => void
}

export default function AdminTable({
  tab, users, hosts, totalElements, totalPages, page, committedSearch,
  loading, listError, onPromoteUser, onRevokeHost, onNicknameSave, onPageChange, onSearch,
}: AdminTableProps) {
  const [searchInput, setSearchInput] = useState(committedSearch)

  function handleSearchSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    onSearch(searchInput)
  }

  function handleReset() {
    setSearchInput('')
    onSearch('')
  }

  const rows = tab === 'users' ? users : hosts

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-app-text-h font-semibold text-lg">
            {tab === 'users' ? '회원 관리' : '호스트 관리'}
          </h2>
          <p className="text-app-text text-sm">총 {totalElements.toLocaleString()}명</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            className="bg-surface-700 border border-app-border rounded px-3 py-1.5 text-app-text-h text-sm focus:outline-none focus:border-accent-400 w-40"
            placeholder="닉네임 검색"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm">검색</Button>
          {committedSearch && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              초기화
            </Button>
          )}
        </form>
      </div>

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
            ) : listError ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-red-400">
                  {listError}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-app-text">
                  {committedSearch
                    ? `"${committedSearch}" 검색 결과가 없습니다.`
                    : `등록된 ${tab === 'users' ? '회원' : '호스트'}이 없습니다.`}
                </td>
              </tr>
            ) : tab === 'users' ? (
              (users as UserSummary[]).map(user => (
                <tr key={user.id} className="border-b border-app-border last:border-0 hover:bg-surface-700/30 transition-colors">
                  <td className="py-3 pr-4 text-app-text-h">{user.nickname}</td>
                  <td className="py-3 pr-4 text-app-text">{user.email}</td>
                  <td className="py-3 pr-4 text-app-text">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="primary" size="sm" onClick={() => onPromoteUser(user.id)}>
                      호스트로 승격
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              (hosts as HostSummary[]).map(host => (
                <tr key={host.id} className="border-b border-app-border last:border-0 hover:bg-surface-700/30 transition-colors">
                  <td className="py-3 pr-4">
                    <NicknameCell host={host} onSave={onNicknameSave} />
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
                      onClick={() => onRevokeHost(host.id)}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-app-border">
          <p className="text-app-text text-sm">
            {page + 1} / {totalPages} 페이지
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
              이전
            </Button>
            <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
              다음
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
