import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../components/ui/index.ts'
import { signUp } from '../api/authService.ts'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9_-]+$/

interface FieldErrors {
  email?: string
  password?: string
  nickname?: string
}

function validate(email: string, password: string, nickname: string): FieldErrors {
  const errors: FieldErrors = {}

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

  if (!nickname) {
    errors.nickname = '닉네임을 입력해주세요.'
  } else if (nickname.length < 2) {
    errors.nickname = '닉네임은 2자 이상이어야 합니다.'
  } else if (nickname.length > 30) {
    errors.nickname = '닉네임은 30자 이하이어야 합니다.'
  } else if (!NICKNAME_REGEX.test(nickname)) {
    errors.nickname = '닉네임은 한글, 영문, 숫자, _, - 만 사용할 수 있습니다.'
  }

  return errors
}

export default function SignUpPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [nickname, setNickname] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
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

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value)
    if (fieldErrors.nickname) setFieldErrors(prev => ({ ...prev, nickname: undefined }))
    if (apiError) setApiError('')
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const errors = validate(email, password, nickname)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)
    setApiError('')

    try {
      await signUp({ email, password, nickname })
      navigate('/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.'
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
          <p className="text-app-text text-sm mt-2">새 계정을 만드세요</p>
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
              <Input
                label="닉네임"
                type="text"
                placeholder="홍길동"
                value={nickname}
                onChange={handleNicknameChange}
                error={fieldErrors.nickname}
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
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-app-text text-sm mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-accent-400 hover:text-accent-300 transition-colors">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
