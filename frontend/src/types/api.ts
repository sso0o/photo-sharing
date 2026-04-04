// API 에러 응답 공통 타입
export interface ApiError {
  message: string
  status: number
}

// 백엔드 에러 응답 바디 (code + message)
export interface ApiErrorResponse {
  code: string
  message: string
}

// POST /auth/signup
export interface SignUpRequest {
  email: string
  password: string
  nickname: string
}

// POST /auth/login
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}
