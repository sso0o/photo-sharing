import type { CardProps, CardPadding } from '../../types/card.ts'

// Record<CardPadding, string> 으로 모든 padding 값이 빠짐없이 정의되었는지 보장한다
const PADDING: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  padding = 'md',
  hover = false,
  className = '',
  as: Tag = 'div',
}: CardProps) {
  const classes = [
    'bg-surface-800 border border-app-border rounded-lg overflow-hidden',
    hover &&
      'transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes}>
      <div className={PADDING[padding]}>
        {title && (
          <div className="mb-4">
            <h3 className="text-app-text-h font-semibold text-lg leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-app-text text-sm mt-0.5">{subtitle}</p>
            )}
          </div>
        )}
        {children}
        {footer && (
          <div className="border-t border-app-border pt-4 mt-4 flex items-center gap-3">
            {footer}
          </div>
        )}
      </div>
    </Tag>
  )
}
