import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Card } from '../components/ui/index.ts'

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-app-text-h hover:text-accent-400 transition-colors">
            PhotoShare
          </Link>
          <p className="text-app-text text-sm mt-2">계정에 로그인하세요</p>
        </div>

        <Card padding="lg">
          <div className="flex flex-col gap-5">
            <Input
              label="이메일"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button variant="primary" fullWidth>
              로그인
            </Button>
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
