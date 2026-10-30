'use client'

import { STATUS_LABEL } from '@/components/status-badge'
import { cn } from '@/lib/cn'
import { VIEWS, type ExplorerState } from '@/lib/content/explorer'
import type { ExperimentStatus } from '@/lib/content/types'
import { pad, plural } from '@/lib/format'

export interface CategoryOption {
  slug: string
  name: string
  count: number
}

function Segment({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'label inline-flex min-h-11 items-center rounded-full px-3.5 md:min-h-8',
        pressed ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg focus-visible:text-fg',
      )}
    >
      {children}
    </button>
  )
}

/** One rounded pill holding a small set of mutually exclusive choices. */
function Pill({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-full border border-border-strong p-0.5"
    >
      {children}
    </div>
  )
}

/**
 * The directory's only controls: a status pill and a grid/index pill. Categories live in the top
 * navigation, so they are not repeated here. A category still in the URL from an older link shows
 * as a removable pill so the list never filters silently.
 */
export function FilterBar({
  categories,
  statuses,
  total,
  resultCount,
  state,
  onChange,
}: {
  categories: CategoryOption[]
  statuses: ExperimentStatus[]
  total: number
  resultCount: number
  state: ExplorerState
  onChange: (patch: Partial<ExplorerState>) => void
}) {
  const filtered = resultCount !== total
  const activeCategory =
    state.category === 'all'
      ? null
      : categories.find((category) => category.slug === state.category)

  return (
    <div className="rule-grid">
      <div className="cell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
        <p role="status" className="label text-fg-muted">
          <span className="text-fg">{pad(resultCount)}</span>
          {filtered ? ` of ${pad(total)}` : ''} {plural(resultCount, 'Experiment')}
          {filtered ? ' match' : ''}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {activeCategory ? (
            <button
              type="button"
              aria-label={`Clear category: ${activeCategory.name}`}
              onClick={() => onChange({ category: 'all' })}
              className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-fg px-4 md:min-h-9"
            >
              {activeCategory.name}
              <span aria-hidden>×</span>
            </button>
          ) : null}

          {statuses.length > 1 ? (
            <Pill label="Status">
              <Segment pressed={state.status === 'all'} onClick={() => onChange({ status: 'all' })}>
                All
              </Segment>
              {statuses.map((status) => (
                <Segment
                  key={status}
                  pressed={state.status === status}
                  onClick={() => onChange({ status })}
                >
                  {STATUS_LABEL[status]}
                </Segment>
              ))}
            </Pill>
          ) : null}

          <Pill label="View">
            {VIEWS.map((view) => (
              <Segment key={view} pressed={state.view === view} onClick={() => onChange({ view })}>
                {view === 'grid' ? 'Grid' : 'Index'}
              </Segment>
            ))}
          </Pill>
        </div>
      </div>
    </div>
  )
}
