import axios from 'axios'
import client from './client.ts'
import type { LoginRequest, LoginResponse, ApiErrorResponse } from '../types/api.ts'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await client.post<LoginResponse>('/auth/login', payload)
    return data
  } catch (err) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      const serverMessage = err.response?.data?.message

      if (err.response?.status === 401) {
        throw new Error(serverMessage ?? '이메일 또는 비밀번호가 올바르지 않습니다.')
      }
      if (err.response?.status === 400) {
        throw new Error(serverMessage ?? '입력 형식을 확인해주세요.')
      }
    }

    throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
  }
}
