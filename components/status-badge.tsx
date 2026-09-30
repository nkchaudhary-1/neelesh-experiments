import { StatusGlyph } from '@/components/icons'
import { cn } from '@/lib/cn'
import type { ExperimentStatus } from '@/lib/content/types'

export const STATUS_LABEL: Record<ExperimentStatus, string> = {
  live: 'Live',
  building: 'Building',
  archived: 'Archived',
}

const TONE: Record<ExperimentStatus, string> = {
  live: 'text-accent',
  building: 'text-fg',
  archived: 'text-fg-muted',
}

/** Symbol + word, so status never depends on colour alone. */
export function StatusBadge({
  status,
  className,
}: {
  status: ExperimentStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'label inline-flex items-center gap-1.5 whitespace-nowrap',
        TONE[status],
        className,
      )}
    >
      <StatusGlyph status={status} />
      {STATUS_LABEL[status]}
    </span>
  )
}
