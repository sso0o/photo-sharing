import type { HeaderProps, ContainerProps, ContainerMaxWidth } from '../../types/layout.ts'

// Record<ContainerMaxWidth, string> 으로 모든 maxWidth 값이 빠짐없이 정의되었는지 보장한다
const MAX_WIDTHS: Record<ContainerMaxWidth, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-xl',
  '2xl':'max-w-2xl',
  '4xl':'max-w-4xl',
  '6xl':'max-w-6xl',
  '7xl':'max-w-7xl',
  full: 'max-w-full',
}

export function Header({ brand = 'PhotoShare', nav, actions, className = '' }: HeaderProps) {
  return (
    <header
      className={[
        'sticky top-0 z-50 w-full',
        'border-b border-app-border',
        'bg-app-bg bg-opacity-80 backdrop-blur-md',
        className,
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <span className="text-app-text-h font-semibold text-lg tracking-tight">
            {brand}
          </span>
          {nav && (
            <nav className="hidden md:flex items-center gap-6 text-sm text-app-text">
              {nav}
            </nav>
          )}
          {actions && (
            <div className="flex items-center gap-3">{actions}</div>
          )}
        </div>
      </div>
    </header>
  )
}

export function Container({
  children,
  maxWidth = '7xl',
  className = '',
  as: Tag = 'main',
}: ContainerProps) {
  return (
    <Tag
      className={[
        'mx-auto w-full px-4 sm:px-6 lg:px-8 py-8',
        MAX_WIDTHS[maxWidth],
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  )
}
