import { ContentError } from '@/lib/content/errors'
import { splitFrontmatter } from '@/lib/content/parse'
import { formatZodIssues, frontmatterSchema } from '@/lib/content/schema'
import type { CategoryDefinition, CategoryRef, Experiment, MediaAsset } from '@/lib/content/types'

export interface EntrySource {
  /** Directory name inside content/experiments. */
  folder: string
  /** Path shown in error messages. */
  path: string
  /** Raw file contents. */
  source: string
}

/** Returns the pixel size of a file inside an entry folder, or undefined when it does not exist. */
export type AssetResolver = (
  folder: string,
  relativePath: string,
) => { width: number; height: number } | undefined

export function mediaUrl(slug: string, relativePath: string): string {
  const encoded = relativePath.split('/').map(encodeURIComponent).join('/')
  return `/media/${encodeURIComponent(slug)}/${encoded}`
}

/** "./cover.png" → "cover.png". Anything that could escape the entry folder is rejected. */
export function normalizeAssetPath(reference: string): string | null {
  const path = reference.replace(/^\.\//, '')
  if (!path || path.startsWith('/') || path.includes('\\') || /(^|\/)\.\.?(\/|$)/.test(path)) {
    return null
  }
  return path
}

export interface ParseContext {
  categories: readonly CategoryDefinition[]
  resolveAsset: AssetResolver
}

function fail(entry: EntrySource, problems: string[]): never {
  throw new ContentError(`${entry.path}\n${problems.map((problem) => `  • ${problem}`).join('\n')}`)
}

export function parseExperiment(entry: EntrySource, context: ParseContext): Experiment {
  const { data, body } = splitFrontmatter(entry.source, entry.path)
  const parsed = frontmatterSchema.safeParse(data)
  if (!parsed.success) fail(entry, formatZodIssues(parsed.error))

  const fm = parsed.data
  const problems: string[] = []

  const categories: CategoryRef[] = []
  for (const name of fm.categories) {
    const match = context.categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    )
    if (!match) {
      const allowed = context.categories.map((category) => category.name).join(', ')
      problems.push(
        `categories: "${name}" is not a known category. Use one of: ${allowed}. To add a new one, extend categoryDefinitions in lib/site-config.ts`,
      )
    } else if (!categories.some((category) => category.slug === match.slug)) {
      categories.push({ name: match.name, slug: match.slug })
    }
  }

  if (fm.updated && fm.updated < fm.date) {
    problems.push(`updated: ${fm.updated} is earlier than date ${fm.date}`)
  }

  const resolveMedia = (field: string, reference: string) => {
    const relativePath = normalizeAssetPath(reference)
    if (!relativePath) {
      problems.push(`${field}: "${reference}" must be a relative path inside the experiment folder`)
      return undefined
    }
    const size = context.resolveAsset(entry.folder, relativePath)
    if (!size) {
      problems.push(`${field}: file "${relativePath}" was not found in ${entry.folder}/`)
      return undefined
    }
    return { src: mediaUrl(fm.slug, relativePath), ...size }
  }

  let cover: MediaAsset | undefined
  if (fm.cover) {
    const resolved = resolveMedia('cover', fm.cover)
    if (!fm.coverAlt) {
      problems.push('coverAlt: describe the cover image. It is required whenever cover is set')
    } else if (resolved) {
      cover = { ...resolved, alt: fm.coverAlt }
    }
  }

  const ogImage = fm.ogImage ? resolveMedia('ogImage', fm.ogImage) : undefined

  if (problems.length > 0) fail(entry, problems)

  return {
    id: fm.id,
    slug: fm.slug,
    title: fm.title,
    date: fm.date,
    updated: fm.updated,
    status: fm.status,
    description: fm.description,
    categories,
    tags: [...new Set(fm.tags)],
    cover,
    featured: fm.featured,
    demoUrl: fm.demoUrl,
    githubUrl: fm.githubUrl,
    stack: fm.stack,
    ogImage: ogImage ? { src: ogImage.src } : undefined,
    draft: fm.draft,
    folder: entry.folder,
    body,
  }
}
