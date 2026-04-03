import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// strict: true 에서는 getElementById가 HTMLElement | null 을 반환한다
// null 체크로 런타임 에러를 방지한다
const root = document.getElementById('root')
if (!root) throw new Error('Root element not found: #root 요소가 index.html에 없습니다.')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
