import { useNavigate } from 'react-router-dom'
import { Button, Card, Header } from '../components/ui/index.ts'
import { useLogout } from '../hooks/useLogout.ts'

export default function UserPage() {
  const navigate = useNavigate()
  const logout = useLogout()
  const nickname = localStorage.getItem('nickname') ?? '회원'

  function handleLogout() {
    logout('/login')
  }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Header
        brand="PhotoShare"
        actions={
          <>
            <span className="text-app-text-h text-sm">{nickname}님 반갑습니다!</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>logout</Button>
          </>
        }
      />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
      {/* 환영 메시지 */}
      <div className="text-center mb-12">
        <h1 className="text-app-text-h text-3xl font-bold mb-2">
          안녕하세요, {nickname}님!
        </h1>
        <p className="text-app-text text-base">무엇을 하시겠어요?</p>
      </div>

      {/* 액션 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* 사진 업로드 */}
        <Card hover className="flex flex-col items-center text-center" padding="lg">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <h2 className="text-app-text-h text-xl font-semibold mb-1">사진 업로드</h2>
            <p className="text-app-text text-sm">새 사진을 앨범에 추가하세요</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/photos/upload')}
          >
            사진 업로드
          </Button>
        </Card>

        {/* 이벤트 관리 */}
        <Card hover className="flex flex-col items-center text-center" padding="lg">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
            </div>
            <h2 className="text-app-text-h text-xl font-semibold mb-1">이벤트 관리</h2>
            <p className="text-app-text text-sm">내 이벤트를 관리해보세요</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/events')}
          >
            이벤트 만들기
          </Button>
        </Card>
      </div>
    </div>
  </div>
  )
}
