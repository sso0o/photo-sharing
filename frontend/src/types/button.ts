import type { ComponentPropsWithoutRef } from 'react'

// 버튼 스타일 변형: 주요(primary) / 보조(secondary) / 투명(ghost)
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

// 버튼 크기: 소(sm) / 중(md) / 대(lg)
export type ButtonSize = 'sm' | 'md' | 'lg'

// Button 컴포넌트 고유 props (HTML button 속성과 겹치는 항목을 명시적으로 선언)
interface ButtonOwnProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}

// 최종 ButtonProps: 고유 props + 나머지 HTML button 속성 (onClick, type 등)
// Omit으로 중복 선언을 방지한다
export type ButtonProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonOwnProps>
