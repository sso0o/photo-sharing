import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const client = axios.create({
  baseURL: '/api',
})

// 모든 요청에 JWT 토큰을 Authorization 헤더에 자동으로 추가한다
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
