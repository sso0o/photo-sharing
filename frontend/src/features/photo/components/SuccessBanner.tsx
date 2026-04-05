interface SuccessBannerProps {
  onDismiss: () => void
}

export default function SuccessBanner({ onDismiss }: SuccessBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-green-950/60 border border-green-700 text-green-300 text-sm rounded-lg px-4 py-3">
      <span>사진이 업로드되었습니다.</span>
      <button
        onClick={onDismiss}
        className="shrink-0 text-green-400 hover:text-green-200 transition-colors"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  )
}
