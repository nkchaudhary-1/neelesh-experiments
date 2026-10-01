import { DoubleRule } from '@/components/double-rule'
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
      <DoubleRule />
    </div>
  )
}
