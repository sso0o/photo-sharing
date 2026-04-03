import { useId } from 'react'
import type { InputProps } from '../../types/input.ts'

export function Input({
  label,
  id: idProp,
  error,
  hint,
  className = '',
  ...rest
}: InputProps) {
  // idProp이 없으면 React가 자동으로 고유한 id를 생성한다 (접근성 향상)
  const autoId = useId()
  const id = idProp ?? autoId
  const hasError = Boolean(error)

  return (
    <div className={['flex flex-col gap-1.5', className].join(' ')}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-app-text-h">
          {label}
          {/* rest.required는 ComponentPropsWithoutRef<'input'>에 포함되어 있으므로 별도 타입 선언 없이 사용 가능 */}
          {rest.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        className={[
          'bg-app-code-bg border text-app-text-h rounded px-3 py-2 w-full text-sm outline-none transition-colors',
          'placeholder:text-app-text',
          hasError
            ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400'
            : 'border-app-border focus:border-accent-400 focus:ring-1 focus:ring-accent-400',
          rest.disabled && 'opacity-50 cursor-not-allowed',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {hasError && <p className="text-xs text-red-400">{error}</p>}
      {!hasError && hint && <p className="text-xs text-app-text">{hint}</p>}
    </div>
  )
}
