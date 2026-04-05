import { useNavigate } from 'react-router-dom'
import { logout as logoutApi } from '../api/authService.ts'

export function useLogout() {
  const navigate = useNavigate()

  const logout = async (redirectPath = '/') => {
    await logoutApi()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('nickname')
    localStorage.removeItem('role')
    navigate(redirectPath)
  }

  return logout
}
