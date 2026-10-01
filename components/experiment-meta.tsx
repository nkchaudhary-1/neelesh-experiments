import Link from 'next/link'
import { ExternalLink } from '@/components/external-link'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/cn'
import { demoLabel } from '@/lib/links'
import type { Experiment, ExperimentCard } from '@/lib/content/types'
import { formatDate } from '@/lib/format'

type MetaSource = ExperimentCard &
  Partial<Pick<Experiment, 'updated' | 'stack' | 'demoUrl' | 'githubUrl'>>

/** ID · date · status on one line, for tiles and rows. */
function MetaLine({ experiment, className }: { experiment: MetaSource; className?: string }) {
  return (
    <p className={cn('label flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-muted', className)}>
      <span className="text-fg">{experiment.id}</span>
      <time dateTime={experiment.date}>{formatDate(experiment.date)}</time>
      <StatusBadge status={experiment.status} />
      {experiment.draft ? <span className="text-accent">Draft</span> : null}
    </p>
  )
}

function MetaList({ experiment }: { experiment: MetaSource }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'ID', value: <span className="text-fg">{experiment.id}</span> },
    {
      label: 'Date',
      value: <time dateTime={experiment.date}>{formatDate(experiment.date)}</time>,
    },
  ]

  if (experiment.updated && experiment.updated !== experiment.date) {
    rows.push({
      label: 'Updated',
      value: <time dateTime={experiment.updated}>{formatDate(experiment.updated)}</time>,
    })
  }

  rows.push(
    { label: 'Status', value: <StatusBadge status={experiment.status} /> },
    {
      label: 'Category',
      value: (
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {experiment.categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex min-h-11 min-w-11 items-center underline decoration-border-strong underline-offset-4 hover:decoration-fg focus-visible:decoration-fg md:min-h-0 md:min-w-0"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
  )

  if (experiment.tags.length > 0) {
    rows.push({ label: 'Tags', value: experiment.tags.join(' / ') })
  }
  if (experiment.stack && experiment.stack.length > 0) {
    rows.push({ label: 'Stack', value: experiment.stack.join(' / ') })
  }
  if (experiment.demoUrl) {
    rows.push({
      label: 'Demo',
      value: (
        <ExternalLink
          href={experiment.demoUrl}
          className="min-h-11 text-accent underline underline-offset-4 md:min-h-0"
        >
          {demoLabel(experiment.demoUrl)}
        </ExternalLink>
      ),
    })
  }
  if (experiment.githubUrl) {
    rows.push({
      label: 'Source',
      value: (
        <ExternalLink
          href={experiment.githubUrl}
          className="min-h-11 text-accent underline underline-offset-4 md:min-h-0"
        >
          GitHub
        </ExternalLink>
      ),
    })
  }

  return (
    <dl className="label grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-3.5">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-fg-muted">{row.label}</dt>
          <dd className="min-w-0 break-words">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ExperimentMeta({
  experiment,
  variant = 'line',
  className,
}: {
  experiment: MetaSource
  variant?: 'line' | 'list'
  className?: string
}) {
  return variant === 'line' ? (
    <MetaLine experiment={experiment} className={className} />
  ) : (
    <MetaList experiment={experiment} />
  )
}
