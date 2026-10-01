import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  archiveMonthHeading,
  buildCollection,
  getAdjacent,
  getMoreInCategory,
  groupArchive,
} from '@/lib/content/collection'
import { ContentError } from '@/lib/content/errors'
import {
  parseExperiment,
  mediaUrl,
  normalizeAssetPath,
  type AssetResolver,
} from '@/lib/content/entry'
import { splitFrontmatter, splitSections, stripFigures } from '@/lib/content/parse'
import { categoryDefinitions } from '@/lib/site-config'

const resolveAsset: AssetResolver = (_folder, path) =>
  /^(cover|detail-\d+|og)\.png$/.test(path)
    ? { width: 1600, height: 1000, hash: 'abc12345' }
    : undefined

const context = { categories: categoryDefinitions, resolveAsset }

function source(overrides: Record<string, string> = {}, body = '# Title\n\nOpening paragraph.\n') {
  const fields: Record<string, string> = {
    id: '"001"',
    title: '"Sample"',
    slug: '"sample"',
    date: '"2026-03-01"',
    status: '"live"',
    categories: '["AI", "Interaction"]',
    description: '"A sample description."',
    ...overrides,
  }
  const yaml = Object.entries(fields)
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  return `---\n${yaml}\n---\n${body}`
}

function parse(overrides: Record<string, string> = {}, folder = '001-sample') {
  return parseExperiment(
    { folder, path: `content/experiments/${folder}/index.mdx`, source: source(overrides) },
    context,
  )
}

describe('frontmatter', () => {
  it('parses a minimal entry and normalises defaults', () => {
    const entry = parse()
    expect(entry).toMatchObject({
      id: '001',
      slug: 'sample',
      status: 'live',
      featured: false,
      draft: false,
      tags: [],
      stack: [],
    })
    expect(entry.categories).toEqual([
      { name: 'AI', slug: 'ai' },
      { name: 'Interaction', slug: 'interaction' },
    ])
  })

  it('matches categories case-insensitively and removes duplicates', () => {
    const entry = parse({ categories: '["ai", "AI", "interaction"]' })
    expect(entry.categories.map((category) => category.slug)).toEqual(['ai', 'interaction'])
  })

  it('treats the blank optional fields from the content format as unset', () => {
    const entry = parse({
      cover: '""',
      coverAlt: '""',
      demoUrl: '""',
      githubUrl: '""',
      updated: '""',
      ogImage: '""',
      tags: '',
      stack: '',
    })
    expect(entry.cover).toBeUndefined()
    expect(entry.demoUrl).toBeUndefined()
    expect(entry.githubUrl).toBeUndefined()
    expect(entry.updated).toBeUndefined()
    expect(entry.ogImage).toBeUndefined()
  })

  it('resolves local media and requires alt text for a cover', () => {
    const entry = parse({ cover: '"./cover.png"', coverAlt: '"A dark interface"' })
    expect(entry.cover).toEqual({
      src: '/media/sample/v-abc12345/cover.png',
      width: 1600,
      height: 1000,
      alt: 'A dark interface',
    })
    expect(() => parse({ cover: '"./cover.png"' })).toThrow(/coverAlt/)
  })

  it.each([
    ['a missing id', { id: '' }, /id/],
    ['an unpadded id', { id: '"1"' }, /zero-padded/],
    ['an unquoted numeric id', { id: '1' }, /quoted string/],
    ['a bad slug', { slug: '"Not A Slug"' }, /slug/],
    ['an unreal date', { date: '"2026-02-31"' }, /real calendar date/],
    ['a wrongly formatted date', { date: '"29/09/2026"' }, /ISO date/],
    ['an unknown status', { status: '"shipped"' }, /one of live, building, archived/],
    ['an unknown category', { categories: '["Sound"]' }, /not a known category/],
    ['too many categories', { categories: '["AI","UI","UX","Web"]' }, /at most three/],
    ['an empty description', { description: '""' }, /description/],
    ['a bad demo url', { demoUrl: '"not a url"' }, /http\(s\) URL/],
    ['a missing cover file', { cover: '"./nope.png"', coverAlt: '"x"' }, /not found/],
    ['updated before date', { updated: '"2026-01-01"' }, /earlier than date/],
    ['an unknown field', { featrued: 'true' }, /unknown field/],
    ['a cover outside the folder', { cover: '"../x.png"', coverAlt: '"x"' }, /relative path/],
  ])('rejects %s with a readable message', (_name, overrides, pattern) => {
    expect(() => parse(overrides)).toThrow(ContentError)
    expect(() => parse(overrides)).toThrow(pattern)
  })

  it('names the file in every error', () => {
    expect(() => parse({ status: '"nope"' })).toThrow('content/experiments/001-sample/index.mdx')
  })

  it('reports a missing frontmatter block', () => {
    expect(() => splitFrontmatter('just text', 'content/x/index.mdx')).toThrow(/frontmatter/)
  })

  it('puts a content hash in image URLs so a replaced file can never be served stale', () => {
    expect(mediaUrl('sample', 'cover.png', 'abc12345')).toBe('/media/sample/v-abc12345/cover.png')
    expect(mediaUrl('sample', 'images/a b.png', 'abc12345')).toBe(
      '/media/sample/v-abc12345/images/a%20b.png',
    )
    expect(mediaUrl('sample', 'demo.mp4')).toBe('/media/sample/demo.mp4')
  })

  it('normalises asset paths', () => {
    expect(normalizeAssetPath('./cover.png')).toBe('cover.png')
    expect(normalizeAssetPath('images/a.png')).toBe('images/a.png')
    expect(normalizeAssetPath('../a.png')).toBeNull()
    expect(normalizeAssetPath('/etc/passwd')).toBeNull()
  })
})

describe('content format document', () => {
  it('parses the example entry in docs/content-format.md exactly as written', () => {
    const doc = readFileSync(join(process.cwd(), 'docs/content-format.md'), 'utf8')
    const example = /## Example completed entry\s+~~~mdx\n([\s\S]*?)\n~~~/.exec(doc)?.[1]
    expect(example).toBeTruthy()

    const entry = parseExperiment(
      { folder: '009-signal-shelf', path: 'docs/content-format.md', source: example as string },
      context,
    )
    expect(entry).toMatchObject({ id: '009', slug: 'signal-shelf', status: 'building' })
    expect(entry.cover?.alt).toMatch(/dark two-column interface/)

    const { lead, sections } = splitSections(entry.body)
    expect(lead.startsWith('Signal Shelf is a small research tool')).toBe(true)
    expect(sections.map((section) => section.title)).toEqual([
      'Overview',
      'The idea',
      'What I was testing',
      'Process',
      'Result',
      'Learnings',
      'Stack',
    ])
  })
})

describe('sections', () => {
  it('splits on level-2 headings and drops the repeated title', () => {
    const { lead, sections } = splitSections(
      '# Title\n\nOpening.\n\n## Overview\n\nContext.\n\n### Detail\n\nMore.\n\n## Result\n\nDone.\n',
    )
    expect(lead).toBe('Opening.')
    expect(sections).toHaveLength(2)
    expect(sections[0]).toMatchObject({ title: 'Overview', slug: 'overview' })
    expect(sections[0]?.body).toContain('### Detail')
  })

  it('never renders empty sections', () => {
    const { sections } = splitSections(
      'Intro\n\n## Notes\n\n## Result\n\nSomething.\n\n## Stack\n\n  \n',
    )
    expect(sections.map((section) => section.title)).toEqual(['Result'])
  })

  it('ignores headings inside fenced code', () => {
    const { sections } = splitSections('## Process\n\n```md\n## Not a section\n```\n\nAfter.\n')
    expect(sections).toHaveLength(1)
    expect(sections[0]?.body).toContain('## Not a section')
  })

  it('keeps an entry with no headings as a lead only', () => {
    const { lead, sections } = splitSections('Just a paragraph.')
    expect(lead).toBe('Just a paragraph.')
    expect(sections).toEqual([])
  })
})

describe('collection', () => {
  const make = (id: string, slug: string, date: string, extra: Record<string, string> = {}) =>
    parse({ id: `"${id}"`, slug: `"${slug}"`, date: `"${date}"`, ...extra }, `${id}-${slug}`)

  const entries = [
    make('001', 'one', '2026-01-12', { categories: '["AI"]', status: '"live"' }),
    make('002', 'two', '2026-03-09', { categories: '["AI", "UI"]', status: '"building"' }),
    make('003', 'three', '2026-03-30', { categories: '["UI"]', status: '"archived"' }),
    make('004', 'four', '2026-03-30', { categories: '["Web"]', status: '"live"', draft: 'true' }),
  ]

  const options = { includeDrafts: false, categories: categoryDefinitions }

  it('sorts newest first, breaking date ties by id, and excludes drafts in production', () => {
    const collection = buildCollection(entries, options)
    expect(collection.experiments.map((entry) => entry.slug)).toEqual(['three', 'two', 'one'])
  })

  it('includes drafts when previewing', () => {
    const collection = buildCollection(entries, { ...options, includeDrafts: true })
    expect(collection.experiments.map((entry) => entry.slug)).toEqual([
      'four',
      'three',
      'two',
      'one',
    ])
  })

  it('derives every count from the data', () => {
    const { stats, categories } = buildCollection(entries, options)
    expect(stats).toEqual({ total: 3, live: 1, building: 1, archived: 1 })
    expect(categories.map((category) => [category.slug, category.count])).toEqual([
      ['ai', 2],
      ['ui', 2],
    ])
    expect(categories[0]?.latest.slug).toBe('two')
  })

  it('does not list categories that only drafts use', () => {
    const { categories } = buildCollection(entries, options)
    expect(categories.some((category) => category.slug === 'web')).toBe(false)
  })

  it('fails clearly on duplicate ids and slugs, drafts included', () => {
    expect(() =>
      buildCollection([entries[0]!, make('001', 'other', '2026-05-01')], options),
    ).toThrow(/Duplicate id "001"/)
    expect(() => buildCollection([entries[0]!, make('009', 'one', '2026-05-01')], options)).toThrow(
      /Duplicate slug "one"/,
    )
    expect(() =>
      buildCollection([entries[3]!, make('004', 'fresh', '2026-05-01')], options),
    ).toThrow(/Duplicate id "004"/)
  })

  it('groups the archive by year then month, newest first', () => {
    const { experiments } = buildCollection(
      [...entries, make('005', 'five', '2025-12-02')],
      options,
    )
    const archive = groupArchive(experiments)
    expect(archive.map((year) => year.year)).toEqual([2026, 2025])
    expect(archive[0]?.months.map((month) => [month.month, month.entries.length])).toEqual([
      [3, 2],
      [1, 1],
    ])
    expect(archiveMonthHeading(2026, 3)).toBe('MAR 2026')
  })

  it('finds previous (older) and next (newer) entries', () => {
    const { experiments } = buildCollection(entries, options)
    const middle = getAdjacent(experiments, 'two')
    expect(middle.previous?.slug).toBe('one')
    expect(middle.next?.slug).toBe('three')
    expect(getAdjacent(experiments, 'three').next).toBeUndefined()
    expect(getAdjacent(experiments, 'one').previous).toBeUndefined()
  })

  it('suggests more work from the first category that has any', () => {
    const { experiments } = buildCollection(entries, options)
    const two = experiments.find((entry) => entry.slug === 'two')!
    const related = getMoreInCategory(experiments, two)
    expect(related?.category.slug).toBe('ai')
    expect(related?.items.map((entry) => entry.slug)).toEqual(['one'])

    const one = experiments.find((entry) => entry.slug === 'one')!
    expect(getMoreInCategory(experiments, one)?.items.map((entry) => entry.slug)).toEqual(['two'])
  })
})

describe('stripFigures', () => {
  it('removes images and their captions but keeps the surrounding text', () => {
    const body =
      'Intro.\n\n![Alt](./a.png)\n\n*Caption: What it shows.*\n\nMiddle.\n\n![Alt two](./b.png)\n\nEnd.\n'
    expect(stripFigures(body)).toBe('Intro.\n\nMiddle.\n\nEnd.\n')
  })

  it('handles a caption on the very next line and leaves other emphasis alone', () => {
    expect(stripFigures('![Alt](./a.png)\n*Caption: Tight.*\nAfter.')).toBe('After.')
    expect(stripFigures('![Alt](./a.png)\n\n*Not a caption.*')).toBe('\n*Not a caption.*')
  })

  it('does not touch image syntax inside code fences or inline images', () => {
    const body = '```md\n![Alt](./a.png)\n```\n\nText ![icon](./i.png) inline.'
    expect(stripFigures(body)).toBe(body)
  })

  it('lets a section that only held images disappear', () => {
    const { sections } = splitSections(
      stripFigures('## Media\n\n![A](./a.png)\n\n*Caption: x.*\n\n## Result\n\nDone.\n'),
    )
    expect(sections.map((section) => section.title)).toEqual(['Result'])
  })
})
