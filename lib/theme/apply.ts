import { THEME_COLORS, type Theme } from '@/lib/theme/theme'

/** Sets the theme on <html>. Browser-only. */
export function applyTheme(theme: Theme, options: { animate?: boolean } = {}): void {
  const root = document.documentElement

  if (options.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-switching')
    window.setTimeout(() => root.classList.remove('theme-switching'), 320)
  }

  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

export function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}
