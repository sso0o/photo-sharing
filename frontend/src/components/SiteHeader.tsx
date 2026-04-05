import { Link } from 'react-router-dom'
import { Button, Header } from './ui/index.ts'
import { useLogout } from '../features/auth/hooks/useLogout.ts'

interface SiteHeaderProps {
  /** Hide the Gallery / Upload / Events nav links (e.g. UserPage) */
  hideNav?: boolean
  /** Where to redirect after logout. Defaults to '/' */
  logoutRedirect?: string
}

export default function SiteHeader({ hideNav = false, logoutRedirect = '/' }: SiteHeaderProps) {
  const logout = useLogout()
  const nickname = localStorage.getItem('nickname') ?? '회원'

  return (
    <Header
      brand="PhotoShare"
      nav={hideNav ? undefined : (
        <>
          <a href="#" className="hover:text-app-text-h transition-colors">Gallery</a>
          <a href="#" className="hover:text-app-text-h transition-colors">Upload</a>
          <Link to="/events" className="hover:text-app-text-h transition-colors">Events</Link>
        </>
      )}
      actions={
        <>
          <span className="text-app-text-h text-sm">{nickname}님</span>
          <Button variant="secondary" size="sm" onClick={() => logout(logoutRedirect)}>로그아웃</Button>
        </>
      }
    />
  )
}
