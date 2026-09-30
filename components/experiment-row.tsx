import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { ExperimentMeta } from '@/components/experiment-meta'
import { ExperimentVisual } from '@/components/experiment-visual'
import { StatusBadge } from '@/components/status-badge'
import type { ExperimentCard } from '@/lib/content/types'
import { formatDateNumeric } from '@/lib/format'

type TitleTag = 'h2' | 'h3' | 'h4' | 'p'

function categoryNames(experiment: ExperimentCard): string {
  return experiment.categories.map((category) => category.name).join(' / ')
}

/** Column captions for INDEX rows. Purely visual, so hidden from assistive tech. */
export function ExperimentIndexHead() {
  return (
    <div
      aria-hidden
      className="row-index row-index--head label hidden border-b text-fg-muted lg:grid"
    >
      <span className="a-id">ID</span>
      <span className="a-title">Title</span>
      <span className="a-cats">Category</span>
      <span className="a-status">Status</span>
      <span className="a-date">Date</span>
      <span className="a-action" />
    </div>
  )
}

/**
 * Text-led, database-style line. With variant="media" it becomes an image-led row:
 * a thumbnail beside the title and description, full-width on narrow screens.
 */
export function ExperimentRow({
  experiment,
  variant = 'index',
  titleAs: Heading = 'h2',
}: {
  experiment: ExperimentCard
  variant?: 'index' | 'media'
  /** Keeps the heading outline correct where the row is used. */
  titleAs?: TitleTag
}) {
  const href = `/experiments/${experiment.slug}`

  if (variant === 'media') {
    return (
      <li className="interactive border-b">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)_minmax(0,15rem)_5.5rem]">
          <ExperimentVisual
            cover={experiment.cover}
            id={experiment.id}
            title={experiment.title}
            ratio="16 / 9"
            sizes="(min-width: 1024px) 304px, 100vw"
            className="border-b lg:h-full lg:border-r lg:border-b-0 lg:!aspect-auto"
          />
          <div className="flex flex-col gap-3 p-[var(--pad)] lg:justify-center">
            <ExperimentMeta experiment={experiment} className="lg:hidden" />
            <span className="label hidden text-fg lg:block">{experiment.id}</span>
            <Heading className="text-title">
              <Link href={href} className="stretched">
                {experiment.title}
              </Link>
            </Heading>
            <p className="max-w-[58ch] text-fg-muted">{experiment.description}</p>
            <p className="label text-fg-muted lg:hidden">{categoryNames(experiment)}</p>
          </div>
          <div className="label hidden flex-col justify-center gap-2.5 border-l p-[var(--pad)] text-fg-muted lg:flex">
            <StatusBadge status={experiment.status} />
            <time dateTime={experiment.date}>{formatDateNumeric(experiment.date)}</time>
            <span>{categoryNames(experiment)}</span>
          </div>
          <div className="label hidden items-center justify-center gap-2 border-l text-fg-muted lg:flex">
            <ArrowRight className="nudge text-base" />
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className="interactive border-b">
      <div className="row-index">
        <span className="label a-id text-fg">{experiment.id}</span>
        <time className="label a-date text-fg-muted" dateTime={experiment.date}>
          {formatDateNumeric(experiment.date)}
        </time>
        <Heading className="a-title text-title">
          <Link href={href} className="stretched">
            {experiment.title}
          </Link>
          {experiment.draft ? <span className="label ml-3 text-accent">Draft</span> : null}
        </Heading>
        <span className="label a-cats text-fg-muted">{categoryNames(experiment)}</span>
        <span className="a-status">
          <StatusBadge status={experiment.status} />
        </span>
        <span className="label a-action inline-flex items-center gap-2 text-fg-muted">
          <span className="hidden lg:inline">View</span>
          <ArrowRight className="nudge text-base" />
        </span>
      </div>
    </li>
  )
}
