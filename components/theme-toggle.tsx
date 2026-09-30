'use client'

import { useLayoutEffect, useSyncExternalStore } from 'react'
import { ThemeGlyph } from '@/components/icons'
import { cn } from '@/lib/cn'
import { siteConfig } from '@/lib/site-config'
import { applyTheme, currentTheme } from '@/lib/theme/apply'
import {
  getBrowserStorage,
  oppositeTheme,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
  type Theme,
} from '@/lib/theme/theme'

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

const getServerSnapshot = (): Theme => 'dark'

/**
 * Compact ◐ DARK / ○ LIGHT control. The visible word is switched by CSS on <html data-theme>,
 * so it is right on the very first paint; React state only drives the accessible name.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, getServerSnapshot)

  // React's dev-only Strict Mode remount resets <html> attributes; re-apply the resolved
  // theme before paint. A no-op in production.
  useLayoutEffect(() => {
    const resolved = resolveTheme({
      stored: readStoredTheme(getBrowserStorage()),
      systemPrefersLight: window.matchMedia('(prefers-color-scheme: light)').matches,
      followSystem: siteConfig.theme.followSystem,
    })
    if (resolved !== currentTheme()) applyTheme(resolved)
  }, [])

  const next = oppositeTheme(theme)

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next, { animate: true })
        writeStoredTheme(getBrowserStorage(), next)
      }}
      aria-label={`${theme === 'dark' ? 'Dark' : 'Light'} theme. Switch to ${next} mode`}
      className={cn(
        'label inline-flex min-h-11 items-center justify-center gap-2 px-4 text-fg hover:bg-surface focus-visible:bg-surface',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 [[data-theme=light]_&]:hidden">
        <ThemeGlyph theme="dark" />
        Dark
      </span>
      <span className="hidden items-center gap-2 [[data-theme=light]_&]:inline-flex">
        <ThemeGlyph theme="light" />
        Light
      </span>
    </button>
  )
}
