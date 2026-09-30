export const THEMES = ['dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

/** Dark is the identity of the site and the final fallback everywhere. */
export const DEFAULT_THEME: Theme = 'dark'
export const THEME_STORAGE_KEY = 'neel-theme'

/** Matches --color-bg in each theme; used for the browser chrome colour. */
export const THEME_COLORS: Record<Theme, string> = { dark: '#090909', light: '#f3f2ee' }

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}

/** Storage can be missing, blocked or throw (private windows, disabled site data). */
export function readStoredTheme(storage: StorageLike | undefined): Theme | null {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

export function writeStoredTheme(storage: StorageLike | undefined, theme: Theme): boolean {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme)
    return storage !== undefined
  } catch {
    return false
  }
}

/** An explicit stored choice always wins. Otherwise follow the system only if asked to. */
export function resolveTheme(input: {
  stored: Theme | null
  systemPrefersLight: boolean
  followSystem: boolean
}): Theme {
  if (input.stored) return input.stored
  if (input.followSystem && input.systemPrefersLight) return 'light'
  return DEFAULT_THEME
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark'
}

/** localStorage, or undefined when the browser blocks even looking at it. */
export function getBrowserStorage(): StorageLike | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}
