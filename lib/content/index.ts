import 'server-only'
import { cache } from 'react'
import { buildCollection } from '@/lib/content/collection'
import { parseExperiment } from '@/lib/content/entry'
import { readEntrySources, readSiteFile, resolveAssetFromDisk } from '@/lib/content/files'
import type { Collection, Experiment } from '@/lib/content/types'
import { categoryDefinitions, siteConfig } from '@/lib/site-config'

/** Covers are still validated when parsing; they are only dropped from what the pages see. */
const withoutCover = (entry: Experiment): Experiment => ({ ...entry, cover: undefined })

function load(): Collection {
  const entries = readEntrySources().map((source) =>
    parseExperiment(source, {
      categories: categoryDefinitions,
      resolveAsset: resolveAssetFromDisk,
    }),
  )
  return buildCollection(siteConfig.showImages ? entries : entries.map(withoutCover), {
    // Drafts are previewable locally and never reach a production build.
    includeDrafts: process.env.NODE_ENV !== 'production',
    categories: categoryDefinitions,
  })
}

let memo: Collection | undefined
const loadOnce = () => (memo ??= load())

/**
 * Production builds read the content folder once per process. In development every
 * request re-reads it, so saving an MDX file shows up on refresh.
 */
export const getCollection: () => Collection =
  process.env.NODE_ENV === 'production' ? loadOnce : cache(load)

export function getExperiment(slug: string): Experiment | undefined {
  return getCollection().experiments.find((experiment) => experiment.slug === slug)
}

/** Body of content/site/about.mdx with any frontmatter removed. */
export function getAboutSource(): string {
  const source = readSiteFile('about.mdx')
  if (source === undefined) return ''
  return source.replace(/^﻿?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '').trim()
}
