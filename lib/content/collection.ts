import { ContentError } from '@/lib/content/errors'
import { compareNewestFirst } from '@/lib/content/sort'
import { monthLabel } from '@/lib/format'
import type {
  ArchiveYear,
  CategoryDefinition,
  CategoryRef,
  Collection,
  Experiment,
  ExperimentCard,
} from '@/lib/content/types'

function assertUnique(experiments: Experiment[], field: 'id' | 'slug'): void {
  const seen = new Map<string, string>()
  for (const experiment of experiments) {
    const existing = seen.get(experiment[field])
    if (existing) {
      throw new ContentError(
        `Duplicate ${field} "${experiment[field]}"\n  • content/experiments/${existing}\n  • content/experiments/${experiment.folder}\n  Every experiment needs a unique ${field}.`,
      )
    }
    seen.set(experiment[field], experiment.folder)
  }
}

export interface BuildOptions {
  includeDrafts: boolean
  categories: readonly CategoryDefinition[]
}

/**
 * Turns parsed entries into everything the site renders: sorted published work,
 * category summaries and status counts. Nothing downstream hard-codes a number.
 */
export function buildCollection(entries: Experiment[], options: BuildOptions): Collection {
  assertUnique(entries, 'id')
  assertUnique(entries, 'slug')

  const experiments = entries
    .filter((entry) => options.includeDrafts || !entry.draft)
    .sort(compareNewestFirst)

  const categories = options.categories.flatMap((definition) => {
    const members = experiments.filter((experiment) =>
      experiment.categories.some((category) => category.slug === definition.slug),
    )
    const latest = members[0]
    return latest ? [{ ...definition, count: members.length, latest }] : []
  })

  return {
    experiments,
    categories,
    stats: {
      total: experiments.length,
      live: experiments.filter((experiment) => experiment.status === 'live').length,
      building: experiments.filter((experiment) => experiment.status === 'building').length,
      archived: experiments.filter((experiment) => experiment.status === 'archived').length,
    },
  }
}

export function toCard(experiment: Experiment): ExperimentCard {
  return {
    id: experiment.id,
    slug: experiment.slug,
    title: experiment.title,
    date: experiment.date,
    status: experiment.status,
    description: experiment.description,
    categories: experiment.categories,
    tags: experiment.tags,
    cover: experiment.cover,
    draft: experiment.draft,
  }
}

/** Groups newest-first entries by year, then month, preserving order. */
export function groupArchive(experiments: Experiment[]): ArchiveYear[] {
  const years: ArchiveYear[] = []
  for (const experiment of experiments) {
    const [year, month] = experiment.date.split('-').map(Number) as [number, number]
    let group = years.find((candidate) => candidate.year === year)
    if (!group) {
      group = { year, months: [] }
      years.push(group)
    }
    let bucket = group.months.find((candidate) => candidate.month === month)
    if (!bucket) {
      bucket = { month, entries: [] }
      group.months.push(bucket)
    }
    bucket.entries.push(experiment)
  }
  return years
}

export function archiveMonthHeading(year: number, month: number): string {
  return `${monthLabel(month)} ${year}`
}

/** previous = the next older entry, next = the next newer one. */
export function getAdjacent(
  experiments: Experiment[],
  slug: string,
): { previous?: Experiment; next?: Experiment } {
  const index = experiments.findIndex((experiment) => experiment.slug === slug)
  if (index === -1) return {}
  return { previous: experiments[index + 1], next: experiments[index - 1] }
}

/** Other work from the first of this experiment's categories that has any. */
export function getMoreInCategory(
  experiments: Experiment[],
  current: Experiment,
  limit = 3,
): { category: CategoryRef; items: Experiment[] } | undefined {
  for (const category of current.categories) {
    const items = experiments
      .filter(
        (experiment) =>
          experiment.slug !== current.slug &&
          experiment.categories.some((candidate) => candidate.slug === category.slug),
      )
      .slice(0, limit)
    if (items.length > 0) return { category, items }
  }
  return undefined
}
