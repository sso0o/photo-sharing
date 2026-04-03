import type { ElementType, ReactNode } from 'react'

// 카드 내부 여백 크기
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

// Card 컴포넌트 props
// as?: ElementType 은 렌더링할 HTML 태그 또는 컴포넌트를 교체할 수 있게 한다
// 예) <Card as="article"> → <article> 태그로 렌더링
export interface CardProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  // footer 슬롯: 카드 하단에 버튼 등을 자유롭게 넣을 수 있다
  footer?: ReactNode
  padding?: CardPadding
  // hover가 true이면 마우스를 올렸을 때 그림자 + 위로 올라오는 효과가 적용된다
  hover?: boolean
  className?: string
  as?: ElementType
}
