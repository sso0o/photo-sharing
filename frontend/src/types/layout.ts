import type { ElementType, ReactNode } from 'react'

// Container 최대 너비 옵션 (Tailwind max-w-* 클래스와 대응)
export type ContainerMaxWidth =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '4xl'
  | '6xl'
  | '7xl'
  | 'full'

// Header 컴포넌트 props
export interface HeaderProps {
  // 좌측 브랜드명
  brand?: string
  // 가운데 네비게이션 영역 (링크 등 ReactNode)
  nav?: ReactNode
  // 우측 액션 영역 (버튼 등 ReactNode)
  actions?: ReactNode
  className?: string
}

// Container 컴포넌트 props
// as?: ElementType 으로 렌더링 태그를 변경할 수 있다 (기본값: <main>)
export interface ContainerProps {
  children?: ReactNode
  maxWidth?: ContainerMaxWidth
  className?: string
  as?: ElementType
}
