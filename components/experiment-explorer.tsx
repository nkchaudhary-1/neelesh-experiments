'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { BracketButton } from '@/components/bracket-button'
import { EmptyState } from '@/components/empty-state'
import { ExperimentResults } from '@/components/experiment-results'
import { FilterBar, type CategoryOption } from '@/components/filter-bar'
import {
  applyExplorerState,
  parseExplorerState,
  serializeExplorerState,
  type ExplorerState,
} from '@/lib/content/explorer'
import type { ExperimentCard } from '@/lib/content/types'

/**
 * The searchable directory. The URL is the only source of truth: filters are read from the
 * query string and changed with history.pushState, so every view is linkable, reloadable
 * and works with the back button. The page itself stays statically generated.
 */
export function ExperimentExplorer({
  experiments,
  categories,
  basePath,
}: {
  experiments: ExperimentCard[]
  categories: CategoryOption[]
  basePath: string
}) {
  const searchParams = useSearchParams()
  const categorySlugs = useMemo(() => categories.map((category) => category.slug), [categories])
  const state = useMemo(
    () => parseExplorerState(searchParams, categorySlugs),
    [searchParams, categorySlugs],
  )
  const results = useMemo(() => applyExplorerState(experiments, state), [experiments, state])

  const update = useCallback(
    (patch: Partial<ExplorerState>) => {
      const next = { ...state, ...patch }
      window.history.pushState(null, '', `${basePath}${serializeExplorerState(next)}`)
    },
    [state, basePath],
  )

  return (
    <>
      <FilterBar
        categories={categories}
        total={experiments.length}
        resultCount={results.length}
        state={state}
        onChange={update}
      />
      {/* Keyed so a change of filter, sort or view replays the short fade. */}
      <div key={serializeExplorerState(state)} className="fade-rise">
        {results.length === 0 ? (
          <EmptyState
            action={
              <BracketButton onClick={() => update({ category: 'all', status: 'all' })}>
                Reset filters
              </BracketButton>
            }
          />
        ) : (
          <ExperimentResults experiments={results} view={state.view} />
        )}
      </div>
    </>
  )
}
