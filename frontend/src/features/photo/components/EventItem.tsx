import type { Event } from '../../event/types.ts'

interface EventItemProps {
  event: Event
  selected: boolean
  onSelect: (id: string) => void
}

export default function EventItem({ event, selected, onSelect }: EventItemProps) {
  function handleClick() {
    onSelect(event.id)
  }

  return (
    <label
      htmlFor={`event-${event.id}`}
      className={[
        'flex items-start justify-between gap-4 p-5 rounded-lg border cursor-pointer',
        'bg-surface-800 transition-all duration-200',
        selected
          ? 'border-accent-500 ring-1 ring-accent-500'
          : 'border-app-border hover:border-surface-600 hover:-translate-y-0.5 hover:shadow-card',
      ].join(' ')}
    >
      <div className="flex-1 min-w-0" onClick={handleClick}>
        <p className="text-app-text-h font-semibold truncate">{event.title}</p>
        {event.description && (
          <p className="text-app-text text-sm mt-0.5 line-clamp-2">{event.description}</p>
        )}
        <p className="text-app-text text-xs mt-1 opacity-60">
          {new Date(event.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>
      <input
        id={`event-${event.id}`}
        type="radio"
        name="event"
        value={event.id}
        checked={selected}
        onChange={() => onSelect(event.id)}
        className="mt-1 w-4 h-4 accent-accent-500 shrink-0"
      />
    </label>
  )
}
