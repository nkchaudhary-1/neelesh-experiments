import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { resolveCurrentNav } from '@/lib/nav'
import { themeInitScript } from '@/lib/theme/script'
import {
  readStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  writeStoredTheme,
  type StorageLike,
  type Theme,
} from '@/lib/theme/theme'

function memoryStorage(
  initial: Record<string, string> = {},
): StorageLike & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value
    },
  }
}

const throwing: StorageLike = {
  getItem() {
    throw new Error('blocked')
  },
  setItem() {
    throw new Error('blocked')
  },
}

describe('theme persistence', () => {
  it('stores and restores an explicit choice', () => {
    const storage = memoryStorage()
    expect(readStoredTheme(storage)).toBeNull()
    expect(writeStoredTheme(storage, 'light')).toBe(true)
    expect(storage.data[THEME_STORAGE_KEY]).toBe('light')
    expect(readStoredTheme(storage)).toBe('light')
  })

  it('ignores corrupt stored values', () => {
    expect(readStoredTheme(memoryStorage({ [THEME_STORAGE_KEY]: 'sepia' }))).toBeNull()
  })

  it('survives blocked or missing storage', () => {
    expect(readStoredTheme(throwing)).toBeNull()
    expect(writeStoredTheme(throwing, 'dark')).toBe(false)
    expect(readStoredTheme(undefined)).toBeNull()
    expect(writeStoredTheme(undefined, 'dark')).toBe(false)
  })
})

describe('theme resolution', () => {
  const cases: { stored: Theme | null; light: boolean; follow: boolean; expected: Theme }[] = [
    { stored: null, light: false, follow: false, expected: 'dark' },
    { stored: null, light: true, follow: false, expected: 'dark' },
    { stored: null, light: true, follow: true, expected: 'light' },
    { stored: null, light: false, follow: true, expected: 'dark' },
    { stored: 'dark', light: true, follow: true, expected: 'dark' },
    { stored: 'light', light: false, follow: false, expected: 'light' },
  ]

  it.each(cases)('stored=$stored systemLight=$light follow=$follow → $expected', (c) => {
    expect(
      resolveTheme({ stored: c.stored, systemPrefersLight: c.light, followSystem: c.follow }),
    ).toBe(c.expected)
  })
})

describe('pre-paint script', () => {
  /** Runs the real inline script against a fake document, storage and matchMedia. */
  function run(options: {
    follow: boolean
    stored?: string
    systemLight?: boolean
    storageThrows?: boolean
  }) {
    const attributes: Record<string, string> = {}
    const meta = { content: '', setAttribute: (_: string, v: string) => (meta.content = v) }
    const root = {
      style: {} as Record<string, string>,
      setAttribute: (name: string, value: string) => (attributes[name] = value),
    }
    const storage = options.storageThrows
      ? throwing
      : memoryStorage(options.stored ? { [THEME_STORAGE_KEY]: options.stored } : {})
    new Function('localStorage', 'window', 'document', themeInitScript(options.follow))(
      storage,
      { matchMedia: () => ({ matches: options.systemLight ?? false }) },
      { documentElement: root, querySelector: () => meta },
    )
    return {
      theme: attributes['data-theme'],
      colorScheme: root.style.colorScheme,
      meta: meta.content,
    }
  }

  it('defaults to dark on a first visit', () => {
    expect(run({ follow: false })).toEqual({ theme: 'dark', colorScheme: 'dark', meta: '#090909' })
  })

  it('applies a stored light choice before paint', () => {
    expect(run({ follow: false, stored: 'light' })).toEqual({
      theme: 'light',
      colorScheme: 'light',
      meta: '#f3f2ee',
    })
  })

  it('lets an explicit choice beat the system preference', () => {
    expect(run({ follow: true, stored: 'dark', systemLight: true }).theme).toBe('dark')
  })

  it('follows the system only when configured', () => {
    expect(run({ follow: true, systemLight: true }).theme).toBe('light')
    expect(run({ follow: false, systemLight: true }).theme).toBe('dark')
  })

  it('falls back to dark when storage is blocked', () => {
    expect(run({ follow: false, storageThrows: true }).theme).toBe('dark')
  })

  it('agrees with resolveTheme for every combination', () => {
    for (const stored of [undefined, 'dark', 'light']) {
      for (const systemLight of [false, true]) {
        for (const follow of [false, true]) {
          expect(run({ follow, stored, systemLight }).theme).toBe(
            resolveTheme({
              stored: (stored as Theme | undefined) ?? null,
              systemPrefersLight: systemLight,
              followSystem: follow,
            }),
          )
        }
      }
    }
  })

  it('does not depend on anything outside itself', () => {
    const script = themeInitScript(false)
    expect(script).not.toMatch(/\bimport\b|\brequire\b/)
    expect(readFileSync('lib/theme/theme.ts', 'utf8')).toContain(THEME_STORAGE_KEY.slice(0, 4))
  })
})

describe('current nav', () => {
  it.each([
    ['/experiments', null, 'experiments'],
    ['/experiments', 'index', 'index'],
    ['/experiments', 'grid', 'experiments'],
    ['/experiments/ai-brain', null, 'experiments'],
    ['/about', null, 'about'],
    ['/', null, null],
    ['/categories/ai', null, null],
  ])('%s view=%s → %s', (pathname, view, expected) => {
    expect(resolveCurrentNav(pathname, view)).toBe(expected)
  })
})
