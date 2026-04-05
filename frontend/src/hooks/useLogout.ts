import { useNavigate } from 'react-router-dom'

export function useLogout() {
  const navigate = useNavigate()

  const logout = (redirectPath = '/') => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('nickname')
    localStorage.removeItem('role')
    navigate(redirectPath)
  }

  return logout
}
