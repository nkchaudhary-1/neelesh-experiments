'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { StatusGlyph } from '@/components/icons'
import { STATUS_LABEL } from '@/components/status-badge'
import { cn } from '@/lib/cn'
import { SORTS, VIEWS, type ExplorerState } from '@/lib/content/explorer'
import { STATUSES } from '@/lib/content/types'
import { pad, plural } from '@/lib/format'

export interface CategoryOption {
  slug: string
  name: string
  count: number
}

function FilterButton({
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
        'label inline-flex min-h-11 shrink-0 items-center gap-2 border px-3.5 md:min-h-9',
        pressed
          ? 'border-fg bg-fg text-bg'
          : 'border-border text-fg-muted hover:border-border-strong hover:text-fg focus-visible:border-border-strong focus-visible:text-fg',
      )}
    >
      {children}
    </button>
  )
}

/** Horizontal scroller that fades its edges only while there is more to reveal. */
function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: false, end: false })

  const measure = useCallback(() => {
    const element = ref.current
    if (!element) return
    const start = element.scrollLeft > 4
    const end = element.scrollLeft + element.clientWidth < element.scrollWidth - 4
    setEdge((previous) =>
      previous.start === start && previous.end === end ? previous : { start, end },
    )
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      ref={ref}
      onScroll={measure}
      data-start={edge.start}
      data-end={edge.end}
      className="scroll-x -mx-1 flex min-w-0 gap-1.5 px-1 py-1"
    >
      {children}
    </div>
  )
}

function FilterRow({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  const id = useId()
  return (
    <div
      role="group"
      aria-labelledby={id}
      className={cn(
        'cell flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:gap-5',
        className,
      )}
    >
      <span id={id} className="label w-20 shrink-0 text-fg-muted">
        {label}
      </span>
      <ScrollRow>{children}</ScrollRow>
    </div>
  )
}

export function FilterBar({
  categories,
  total,
  resultCount,
  state,
  onChange,
}: {
  categories: CategoryOption[]
  total: number
  resultCount: number
  state: ExplorerState
  onChange: (patch: Partial<ExplorerState>) => void
}) {
  const filtered = resultCount !== total

  return (
    <div className="rule-grid">
      <FilterRow label="Category">
        <FilterButton
          pressed={state.category === 'all'}
          onClick={() => onChange({ category: 'all' })}
        >
          All
        </FilterButton>
        {categories.map((category) => (
          <FilterButton
            key={category.slug}
            pressed={state.category === category.slug}
            onClick={() => onChange({ category: category.slug })}
          >
            {category.name}
            <span className={state.category === category.slug ? 'text-bg/70' : 'text-fg-muted'}>
              {pad(category.count)}
            </span>
          </FilterButton>
        ))}
      </FilterRow>

      <FilterRow label="Status" className="lg:col-span-6">
        <FilterButton pressed={state.status === 'all'} onClick={() => onChange({ status: 'all' })}>
          All
        </FilterButton>
        {STATUSES.map((status) => (
          <FilterButton
            key={status}
            pressed={state.status === status}
            onClick={() => onChange({ status })}
          >
            <StatusGlyph status={status} />
            {STATUS_LABEL[status]}
          </FilterButton>
        ))}
      </FilterRow>

      <FilterRow label="Sort" className="md:col-span-6 lg:col-span-3">
        {SORTS.map((sort) => (
          <FilterButton key={sort} pressed={state.sort === sort} onClick={() => onChange({ sort })}>
            {sort === 'latest' ? 'Latest' : 'Oldest'}
          </FilterButton>
        ))}
      </FilterRow>

      <FilterRow label="View" className="md:col-span-6 lg:col-span-3">
        {VIEWS.map((view) => (
          <FilterButton key={view} pressed={state.view === view} onClick={() => onChange({ view })}>
            {view === 'grid' ? 'Grid' : 'Index'}
          </FilterButton>
        ))}
      </FilterRow>

      <p role="status" className="cell label py-3 text-fg-muted">
        <span className="text-fg">{pad(resultCount)}</span>
        {filtered ? ` of ${pad(total)}` : ''} {plural(resultCount, 'Experiment')}
        {filtered ? ' match' : ''}
      </p>
    </div>
  )
}
