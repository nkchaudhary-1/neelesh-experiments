import { Suspense } from 'react'
import { ExperimentExplorer } from '@/components/experiment-explorer'
import { ExperimentResults } from '@/components/experiment-results'
import { FilterBarSkeleton } from '@/components/filter-bar-skeleton'
import { PageHeader } from '@/components/page-header'
import { getCollection } from '@/lib/content'
import { toCard } from '@/lib/content/collection'
import { pad, plural } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'All experiments',
  description:
    'Every experiment in the archive, filterable by category and status, as a visual grid or a dense index.',
  path: '/experiments',
})

export default function ExperimentsPage() {
  const { experiments, categories, stats } = getCollection()
  const cards = experiments.map(toCard)
  const options = categories.map(({ slug, name, count }) => ({ slug, name, count }))

  return (
    <div className="frame">
      <PageHeader
        eyebrow={`${pad(stats.total)} ${plural(stats.total, 'Experiment')}`}
        title="All experiments"
        intro="Everything in the archive, newest first. Filter by category or status, and switch between a grid and a list."
      />
      {/* The static HTML ships the default list; the explorer takes over on hydration. */}
      <Suspense
        fallback={
          <>
            <FilterBarSkeleton />
            <ExperimentResults experiments={cards} view="grid" />
          </>
        }
      >
        <ExperimentExplorer experiments={cards} categories={options} basePath="/experiments" />
      </Suspense>
    </div>
  )
}
