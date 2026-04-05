import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../components/ui/index.ts'
import { login } from '../api/authService.ts'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(email: string, password: string): { email?: string; password?: string } {
  const errors: { email?: string; password?: string } = {}
  if (!email) {
    errors.email = '이메일을 입력해주세요.'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.'
  }
  if (!password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.'
  }
  return errors
}

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }))
    if (apiError) setApiError('')
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }))
    if (apiError) setApiError('')
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const errors = validate(email, password)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)
    setApiError('')

    try {
      const { accessToken, refreshToken, nickname, role } = await login({ email, password })
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('nickname', nickname)
      localStorage.setItem('role', role)
      navigate(role === 'ROLE_ADMIN' ? '/admin' : '/user')
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.'
      setApiError(message)
    } finally {
      setIsLoading(false)
    }
  }

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
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">
              <Input
                label="이메일"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                error={fieldErrors.email}
                disabled={isLoading}
                required
              />
              <Input
                label="비밀번호"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                error={fieldErrors.password}
                disabled={isLoading}
                required
              />

              {/* API 에러 메시지 */}
              {apiError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
                  {apiError}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-app-text text-sm mt-6">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-accent-400 hover:text-accent-300 transition-colors">
            회원가입
          </Link>
        </p>
        <p className="text-center text-app-text text-sm mt-3">
          <Link to="/" className="hover:text-accent-400 transition-colors">
            ← 메인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}
