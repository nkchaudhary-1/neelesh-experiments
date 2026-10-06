export const STATUSES = ['live', 'building', 'archived'] as const
export type ExperimentStatus = (typeof STATUSES)[number]

export interface CategoryDefinition {
  name: string
  slug: string
  description: string
}

export interface CategoryRef {
  name: string
  slug: string
}

export interface MediaAsset {
  /** Public URL served by the /media route. */
  src: string
  width: number
  height: number
  alt: string
}

/** Client-safe subset of an experiment: everything a row, tile or filter needs. */
export interface ExperimentCard {
  id: string
  slug: string
  title: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  status: ExperimentStatus
  description: string
  categories: CategoryRef[]
  tags: string[]
  cover?: MediaAsset
  draft: boolean
}

export interface Experiment extends ExperimentCard {
  /** ISO date, YYYY-MM-DD. */
  updated?: string
  featured: boolean
  demoUrl?: string
  githubUrl?: string
  stack: string[]
  ogImage?: { src: string }
  /** Directory name inside content/experiments. */
  folder: string
  /** Raw MDX body, frontmatter removed. */
  body: string
}

export interface CategorySummary extends CategoryDefinition {
  count: number
  latest: Experiment
}

export interface CollectionStats {
  total: number
  live: number
  building: number
  archived: number
}

export interface ArchiveMonth {
  /** 1–12 */
  month: number
  entries: Experiment[]
}

export interface ArchiveYear {
  year: number
  months: ArchiveMonth[]
  /** Entries in the year when `months` is a truncated preview; the count shown uses it. */
  total?: number
}

export interface Collection {
  /** Published entries, newest first. */
  experiments: Experiment[]
  categories: CategorySummary[]
  stats: CollectionStats
}
