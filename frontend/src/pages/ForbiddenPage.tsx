import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui/index.ts'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-app-text-h hover:text-accent-400 transition-colors">
            PhotoShare
          </Link>
        </div>

        <Card padding="lg">
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="text-8xl font-bold text-accent-400">403</p>
            <p className="text-app-text-h text-lg font-semibold">접근이 거부되었습니다.</p>
            <p className="text-app-text text-sm">
              이 페이지에 접근할 권한이 없습니다.
            </p>
            <Link to="/">
              <Button variant="primary" fullWidth>
                홈으로 가기
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-center text-app-text text-sm mt-6">
          <Link to="/" className="hover:text-accent-400 transition-colors">
            ← 메인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}
