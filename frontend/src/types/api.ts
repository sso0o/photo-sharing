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
