interface ErrorBannerProps {
  message: string
  onDismiss: () => void
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-red-950/60 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 text-red-400 hover:text-red-200 transition-colors"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  )
}
