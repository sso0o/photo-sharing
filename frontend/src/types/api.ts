// API 에러 응답 공통 타입
// 향후 백엔드 API 연결 시 응답 타입을 이곳에 추가한다
export interface ApiError {
  message: string
  status: number
}
