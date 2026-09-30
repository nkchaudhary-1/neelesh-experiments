import Link from 'next/link'
import { ArrowUpRight } from '@/components/icons'
import { ExperimentMeta } from '@/components/experiment-meta'
import { ExperimentVisual } from '@/components/experiment-visual'
import { cn } from '@/lib/cn'
import type { ExperimentCard } from '@/lib/content/types'

/** Written out in full so Tailwind can see every class. */
const LG_SPAN: Record<number, string> = {
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  12: 'lg:col-span-12',
}

/**
 * Visual-led cell for GRID views. `span` is the desktop column span (of 12); wider
 * cells get a wider crop and larger title, narrower ones a squarer plate.
 */
export function ExperimentTile({
  experiment,
  span = 6,
  headingLevel = 2,
}: {
  experiment: ExperimentCard
  span?: number
  headingLevel?: 2 | 3
}) {
  const Heading = `h${headingLevel}` as const
  const wide = span >= 7

  return (
    <li className={cn('cell tile interactive p-0 md:col-span-6', LG_SPAN[span] ?? 'lg:col-span-6')}>
      <ExperimentVisual
        cover={experiment.cover}
        id={experiment.id}
        title={experiment.title}
        ratio={wide ? '16 / 10' : '4 / 3'}
        sizes={
          wide
            ? '(min-width: 1760px) 960px, (min-width: 1024px) 58vw, 100vw'
            : '(min-width: 1760px) 640px, (min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw'
        }
        className="tile-visual border-b"
      />
      <div className="flex flex-col gap-3 p-[var(--pad)]">
        <ExperimentMeta experiment={experiment} />
        <Heading className={wide ? 'text-section' : 'text-title'}>
          <Link href={`/experiments/${experiment.slug}`} className="stretched">
            {experiment.title}
          </Link>
        </Heading>
        <p className="line-clamp-3 max-w-[56ch] text-fg-muted">{experiment.description}</p>
        <div className="label mt-auto flex items-end justify-between gap-4 pt-3 text-fg-muted">
          <span>{experiment.categories.map((category) => category.name).join(' / ')}</span>
          <ArrowUpRight className="nudge-ne text-base" />
        </div>
      </div>
    </li>
  )
}
