import type { ButtonProps, ButtonVariant, ButtonSize } from '../../types/button.ts'

// 모든 버튼에 공통으로 적용되는 기본 클래스
const BASE =
  'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-200 border focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:outline-none'

// Record<ButtonVariant, string> 을 사용해 모든 variant가 누락 없이 정의되었는지 컴파일 타임에 확인한다
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white border-transparent',
  secondary:
    'bg-transparent border-app-border text-app-text-h hover:border-accent-400 hover:text-accent-400',
  ghost:
    'bg-transparent border-transparent text-app-text hover:text-accent-400',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
