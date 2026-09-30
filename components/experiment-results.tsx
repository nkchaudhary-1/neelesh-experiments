import { ExperimentIndexHead, ExperimentRow } from '@/components/experiment-row'
import { ExperimentTile } from '@/components/experiment-tile'
import { gridSpans, type ViewMode } from '@/lib/content/explorer'
import type { ExperimentCard } from '@/lib/content/types'

/** The list itself, with no state of its own. Rendered on the server for the static HTML. */
export function ExperimentResults({
  experiments,
  view,
}: {
  experiments: ExperimentCard[]
  view: ViewMode
}) {
  if (view === 'index') {
    return (
      <>
        <ExperimentIndexHead />
        <ul>
          {experiments.map((experiment) => (
            <ExperimentRow key={experiment.slug} experiment={experiment} />
          ))}
        </ul>
      </>
    )
  }

  const spans = gridSpans(experiments.length)
  return (
    <ul className="rule-grid tiles">
      {experiments.map((experiment, index) => (
        <ExperimentTile key={experiment.slug} experiment={experiment} span={spans[index]} />
      ))}
    </ul>
  )
}
