import type { ComponentPropsWithoutRef } from 'react'

// Input 컴포넌트 고유 props
interface InputOwnProps {
  // 입력 필드 위에 표시되는 라벨 텍스트
  label?: string
  // 명시적으로 id를 넘기지 않으면 useId()로 자동 생성된다
  id?: string
  // 에러 메시지 (값이 있으면 빨간 테두리 + 메시지 표시)
  error?: string
  // 에러가 없을 때 표시되는 안내 텍스트
  hint?: string
  className?: string
}

// 최종 InputProps: 고유 props + 나머지 HTML input 속성
// (type, value, onChange, onBlur, required, disabled, placeholder 등 모두 포함)
export type InputProps = InputOwnProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof InputOwnProps>
