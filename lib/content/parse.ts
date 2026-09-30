import { parse as parseYaml } from 'yaml'
import { ContentError } from '@/lib/content/errors'
import { slugify } from '@/lib/slug'

const FRONTMATTER = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/

export function splitFrontmatter(source: string, where: string): { data: unknown; body: string } {
  const match = FRONTMATTER.exec(source)
  if (!match) {
    throw new ContentError(
      `${where}\n  • the file must start with a frontmatter block delimited by ---`,
    )
  }
  let data: unknown
  try {
    data = parseYaml(match[1] ?? '')
  } catch (error) {
    const reason = error instanceof Error ? error.message.split('\n')[0] : String(error)
    throw new ContentError(`${where}\n  • frontmatter is not valid YAML: ${reason}`)
  }
  return { data: data ?? {}, body: match[2] ?? '' }
}

export interface Section {
  title: string
  slug: string
  body: string
}

export interface SplitBody {
  /** The opening paragraph(s) before the first ## heading, without the repeated # title. */
  lead: string
  sections: Section[]
}

const FENCE = /^ {0,3}(`{3,}|~{3,})/
const H2 = /^##[ \t]+(.+?)[ \t]*#*[ \t]*$/

/**
 * Splits an MDX body on level-2 headings so each section can be laid out in the
 * editorial grid. Headings inside fenced code blocks are left alone, and sections
 * with no content are dropped so nothing renders an empty label.
 */
export function splitSections(body: string): SplitBody {
  const lead: string[] = []
  const sections: { title: string; lines: string[] }[] = []
  let fence: string | null = null

  for (const line of body.split(/\r?\n/)) {
    const fenceMatch = FENCE.exec(line)
    if (fenceMatch) {
      const marker = fenceMatch[1] as string
      if (fence === null) fence = marker
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null
    }

    const heading = fence === null ? H2.exec(line) : null
    if (heading) {
      sections.push({ title: (heading[1] as string).trim(), lines: [] })
    } else if (sections.length > 0) {
      sections[sections.length - 1]?.lines.push(line)
    } else {
      lead.push(line)
    }
  }

  return {
    // The format opens with "# Title". The page already renders the title as its one h1.
    lead: lead
      .join('\n')
      .replace(/^\s*#[ \t]+[^\n]*(?:\n|$)/, '')
      .trim(),
    sections: sections
      .map(({ title, lines }) => ({ title, slug: slugify(title), body: lines.join('\n').trim() }))
      .filter((section) => section.body.length > 0),
  }
}
