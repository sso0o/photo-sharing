import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const client = axios.create({
  baseURL: '',
})

// 모든 요청에 JWT 토큰을 Authorization 헤더에 자동으로 추가한다
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 응답 시 /login으로 이동, 403 응답 시 /403 페이지로 이동
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('nickname')
      localStorage.removeItem('role')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      window.location.href = '/403'
    }
    return Promise.reject(error)
  }
)

export default client
