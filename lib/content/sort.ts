import type { ExperimentCard } from '@/lib/content/types'

/** Newest date first; identical dates fall back to the higher id. */
export function compareNewestFirst(a: ExperimentCard, b: ExperimentCard): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0
}
