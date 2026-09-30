import { compareNewestFirst } from '@/lib/content/sort'
import { STATUSES, type ExperimentCard, type ExperimentStatus } from '@/lib/content/types'

export const SORTS = ['latest', 'oldest'] as const
export const VIEWS = ['grid', 'index'] as const

export type SortKey = (typeof SORTS)[number]
export type ViewMode = (typeof VIEWS)[number]

export interface ExplorerState {
  /** Category slug, or "all". */
  category: string
  status: ExperimentStatus | 'all'
  sort: SortKey
  view: ViewMode
}

export const DEFAULT_EXPLORER_STATE: ExplorerState = {
  category: 'all',
  status: 'all',
  sort: 'latest',
  view: 'grid',
}

interface ParamReader {
  get(name: string): string | null
}

function pick<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  const normalized = value?.trim().toLowerCase()
  return allowed.find((candidate) => candidate === normalized)
}

/** Reads state from URL params, falling back to defaults for anything unknown. */
export function parseExplorerState(
  params: ParamReader,
  categorySlugs: readonly string[],
): ExplorerState {
  return {
    category: pick(params.get('category'), categorySlugs) ?? DEFAULT_EXPLORER_STATE.category,
    status: pick(params.get('status'), STATUSES) ?? DEFAULT_EXPLORER_STATE.status,
    sort: pick(params.get('sort'), SORTS) ?? DEFAULT_EXPLORER_STATE.sort,
    view: pick(params.get('view'), VIEWS) ?? DEFAULT_EXPLORER_STATE.view,
  }
}

/** Query string for a state. Defaults are omitted so the canonical URL stays clean. */
export function serializeExplorerState(state: ExplorerState): string {
  const params = new URLSearchParams()
  for (const key of ['category', 'status', 'sort', 'view'] as const) {
    if (state[key] !== DEFAULT_EXPLORER_STATE[key]) params.set(key, state[key])
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function applyExplorerState<T extends ExperimentCard>(
  items: T[],
  state: ExplorerState,
): T[] {
  const filtered = items.filter(
    (item) =>
      (state.category === 'all' ||
        item.categories.some((category) => category.slug === state.category)) &&
      (state.status === 'all' || item.status === state.status),
  )
  const sorted = [...filtered].sort(compareNewestFirst)
  return state.sort === 'oldest' ? sorted.reverse() : sorted
}

/**
 * Span pattern for the GRID view: a 12-column rhythm of wide and narrow cells.
 * Every row totals 12, including the last, so the rules always close.
 */
const GRID_PATTERN: readonly (readonly number[])[] = [
  [7, 5],
  [4, 4, 4],
  [5, 7],
  [6, 6],
]

export function gridSpans(count: number): number[] {
  const spans: number[] = []
  let row = 0
  while (spans.length < count) {
    const pattern = GRID_PATTERN[row % GRID_PATTERN.length] as readonly number[]
    const remaining = count - spans.length
    if (remaining >= pattern.length) {
      spans.push(...pattern)
    } else {
      // Last, partial row: share the twelve columns evenly (12, 6+6).
      const share = 12 / remaining
      for (let i = 0; i < remaining; i++) spans.push(share)
    }
    row++
  }
  return spans
}
