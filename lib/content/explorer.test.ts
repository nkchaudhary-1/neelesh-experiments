import { describe, expect, it } from 'vitest'
import {
  applyExplorerState,
  DEFAULT_EXPLORER_STATE,
  gridSpans,
  parseExplorerState,
  serializeExplorerState,
} from '@/lib/content/explorer'
import type { ExperimentCard } from '@/lib/content/types'

const slugs = ['ai', 'ui', 'motion']

const card = (
  id: string,
  date: string,
  status: ExperimentCard['status'],
  categories: string[],
): ExperimentCard => ({
  id,
  slug: `e-${id}`,
  title: `Experiment ${id}`,
  date,
  status,
  description: 'x',
  categories: categories.map((slug) => ({ slug, name: slug.toUpperCase() })),
  tags: [],
  draft: false,
})

const cards = [
  card('001', '2026-01-10', 'live', ['ai']),
  card('002', '2026-02-10', 'building', ['ai', 'ui']),
  card('003', '2026-03-10', 'archived', ['ui']),
  card('004', '2026-04-10', 'live', ['motion']),
]

describe('explorer URL state', () => {
  it('reads valid params', () => {
    const state = parseExplorerState(
      new URLSearchParams('category=ui&status=live&sort=oldest&view=index'),
      slugs,
    )
    expect(state).toEqual({ category: 'ui', status: 'live', sort: 'oldest', view: 'index' })
  })

  it('falls back to defaults for unknown values', () => {
    const state = parseExplorerState(
      new URLSearchParams('category=nope&status=shipped&sort=random&view=table'),
      slugs,
    )
    expect(state).toEqual(DEFAULT_EXPLORER_STATE)
  })

  it('is case-insensitive about known values', () => {
    expect(parseExplorerState(new URLSearchParams('status=LIVE&view=Index'), slugs)).toMatchObject({
      status: 'live',
      view: 'index',
    })
  })

  it('omits defaults when serialising so the canonical URL stays clean', () => {
    expect(serializeExplorerState(DEFAULT_EXPLORER_STATE)).toBe('')
    expect(serializeExplorerState({ ...DEFAULT_EXPLORER_STATE, view: 'index' })).toBe('?view=index')
    expect(
      serializeExplorerState({ category: 'ai', status: 'live', sort: 'oldest', view: 'index' }),
    ).toBe('?category=ai&status=live&sort=oldest&view=index')
  })

  it('round-trips through the URL', () => {
    const state = { category: 'motion', status: 'building', sort: 'oldest', view: 'index' } as const
    const params = new URLSearchParams(serializeExplorerState(state))
    expect(parseExplorerState(params, slugs)).toEqual(state)
  })
})

describe('filtering and sorting', () => {
  const run = (patch: Partial<typeof DEFAULT_EXPLORER_STATE>) =>
    applyExplorerState(cards, { ...DEFAULT_EXPLORER_STATE, ...patch }).map((item) => item.id)

  it('defaults to everything, newest first', () => {
    expect(run({})).toEqual(['004', '003', '002', '001'])
  })

  it('sorts oldest first', () => {
    expect(run({ sort: 'oldest' })).toEqual(['001', '002', '003', '004'])
  })

  it('filters by category, including entries with several categories', () => {
    expect(run({ category: 'ai' })).toEqual(['002', '001'])
    expect(run({ category: 'ui' })).toEqual(['003', '002'])
  })

  it('filters by status and combines filters', () => {
    expect(run({ status: 'live' })).toEqual(['004', '001'])
    expect(run({ category: 'ai', status: 'live' })).toEqual(['001'])
    expect(run({ category: 'motion', status: 'archived' })).toEqual([])
  })

  it('does not mutate its input', () => {
    const before = cards.map((item) => item.id)
    run({ sort: 'oldest' })
    expect(cards.map((item) => item.id)).toEqual(before)
  })
})

describe('gridSpans', () => {
  it('always fills complete 12-column rows', () => {
    for (let count = 0; count <= 25; count++) {
      const spans = gridSpans(count)
      expect(spans).toHaveLength(count)
      // Sum each row by walking until it reaches 12.
      let row = 0
      for (const span of spans) {
        row += span
        if (row === 12) row = 0
        expect(row).toBeLessThan(12)
      }
      expect(row).toBe(0)
    }
  })

  it('varies the rhythm', () => {
    expect(gridSpans(9)).toEqual([7, 5, 4, 4, 4, 5, 7, 6, 6])
  })

  it('stretches a lone last tile to the full width', () => {
    expect(gridSpans(1)).toEqual([12])
    expect(gridSpans(3)).toEqual([7, 5, 12])
    expect(gridSpans(2)).toEqual([7, 5])
    expect(gridSpans(5)).toEqual([7, 5, 4, 4, 4])
    expect(gridSpans(6)).toEqual([7, 5, 4, 4, 4, 12])
  })
})
