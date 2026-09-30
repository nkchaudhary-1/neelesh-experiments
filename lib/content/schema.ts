import { z } from 'zod'
import { SLUG_PATTERN } from '@/lib/slug'
import { STATUSES } from '@/lib/content/types'

function isRealDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number) as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const isoDate = z
  .string({ error: 'must be a quoted date such as "2026-09-29"' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: (issue) => `must be an ISO date (YYYY-MM-DD), got "${String(issue.input)}"`,
  })
  .refine(isRealDate, {
    error: (issue) => `"${String(issue.input)}" is not a real calendar date`,
  })

const text = (label: string) =>
  z
    .string({ error: `${label} is required and must be text` })
    .trim()
    .min(1, `${label} must not be empty`)

const httpUrl = z.string({ error: 'must be a URL' }).refine((value) => {
  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}, 'must be a full http(s) URL')

const stringList = z.array(z.string().trim().min(1, 'must not contain empty items'))

/**
 * The content format leaves optional fields in place as "" (or an empty YAML value).
 * Treat those as not set rather than as invalid.
 */
const blankAsUnset = (value: unknown) =>
  value === null || (typeof value === 'string' && value.trim() === '') ? undefined : value

const blankable = <T extends z.ZodType>(schema: T) => z.preprocess(blankAsUnset, schema)

export const frontmatterSchema = z
  .object({
    id: z
      .string({ error: 'is required and must be a quoted string such as "001"' })
      .regex(/^\d{3,}$/, 'must be a zero-padded string of at least three digits, such as "001"'),
    title: text('title'),
    slug: z
      .string({ error: 'is required' })
      .regex(SLUG_PATTERN, 'must be lowercase letters and numbers separated by single hyphens'),
    date: isoDate,
    status: z
      .string({ error: `is required: one of ${STATUSES.join(', ')}` })
      .transform((value) => value.trim().toLowerCase())
      .pipe(z.enum(STATUSES, { error: `must be one of ${STATUSES.join(', ')}` })),
    categories: stringList
      .min(1, 'needs at least one category')
      .max(3, 'use at most three categories'),
    tags: blankable(stringList.default([])),
    description: text('description'),
    cover: blankable(z.string().trim().optional()),
    coverAlt: blankable(z.string().trim().optional()),
    featured: blankable(z.boolean({ error: 'must be true or false' }).default(false)),
    demoUrl: blankable(httpUrl.optional()),
    githubUrl: blankable(httpUrl.optional()),
    stack: blankable(stringList.default([])),
    updated: blankable(isoDate.optional()),
    draft: blankable(z.boolean({ error: 'must be true or false' }).default(false)),
    ogImage: blankable(z.string().trim().optional()),
  })
  .strict()

export function formatZodIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return `unknown field${issue.keys.length > 1 ? 's' : ''}: ${issue.keys.join(', ')}. Check the spelling against the schema in README.md`
    }
    const path = issue.path.length > 0 ? issue.path.join('.') : 'frontmatter'
    return `${path}: ${issue.message}`
  })
}
