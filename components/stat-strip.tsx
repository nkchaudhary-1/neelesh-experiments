import { cn } from '@/lib/cn'
import type { CollectionStats } from '@/lib/content/types'
import { siteConfig } from '@/lib/site-config'
import { pad } from '@/lib/format'

function Stat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className={cn('cell col-span-6 py-4 md:col-span-3 lg:col-span-2', className)}>
      <p className="label text-fg-muted">{label}</p>
      <p className="mt-2 font-mono text-section tabular-nums">{pad(value)}</p>
    </div>
  )
}

/** Technical status line: what is being explored and the archive's live counts. */
export function StatStrip({ stats }: { stats: CollectionStats }) {
  const segments = [
    { key: 'live', value: stats.live, className: 'bg-accent' },
    { key: 'building', value: stats.building, className: 'bg-fg-muted' },
    { key: 'archived', value: stats.archived, className: 'bg-border-strong' },
  ]

  return (
    <div>
      <div className="rule-grid">
        <div className="cell py-4 lg:col-span-4">
          <p className="label text-fg-muted">Currently exploring</p>
          <p className="label mt-2 text-fg">{siteConfig.exploring.join(' / ')}</p>
        </div>
        <Stat label="Total experiments" value={stats.total} />
        <Stat label="Live" value={stats.live} />
        <Stat label="Building" value={stats.building} />
        <Stat label="Archived" value={stats.archived} />
      </div>
      {/* Proportions of live / building / archived. The numbers above carry the information. */}
      <div aria-hidden className="rule-grid">
        <div className="cell flex h-1.5 gap-px p-0">
          {segments
            .filter((segment) => segment.value > 0)
            .map((segment) => (
              <div
                key={segment.key}
                className={segment.className}
                style={{ flexGrow: segment.value }}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
