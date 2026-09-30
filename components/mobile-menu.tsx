'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from '@/components/external-link'
import { SiteNav } from '@/components/site-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/lib/site-config'

/**
 * Full-screen menu built on a native modal <dialog>: the browser traps focus inside it,
 * makes the rest of the page inert, closes on Escape and restores focus to MENU.
 */
export function MobileMenu({ year }: { year: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // The menu is a small-screen pattern; never leave it open across the breakpoint.
    const query = window.matchMedia('(min-width: 48rem)')
    const closeOnDesktop = () => {
      if (query.matches) dialogRef.current?.close()
    }
    query.addEventListener('change', closeOnDesktop)
    return () => query.removeEventListener('change', closeOnDesktop)
  }, [])

  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => {
          dialogRef.current?.showModal()
          setOpen(true)
        }}
        className="label inline-flex min-h-11 min-w-11 items-center justify-center border-l px-4 text-fg hover:bg-surface focus-visible:bg-surface md:hidden"
      >
        Menu
      </button>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-bg p-0 text-fg backdrop:bg-transparent open:flex open:flex-col"
      >
        <div className="flex h-12 shrink-0 items-stretch justify-between border-b">
          <Link
            href="/"
            onClick={close}
            className="label flex items-center px-[var(--pad)] font-medium text-fg"
          >
            {siteConfig.shortName}
          </Link>
          <button
            type="button"
            onClick={close}
            className="label inline-flex min-h-11 min-w-11 items-center justify-center border-l px-4 text-fg hover:bg-surface focus-visible:bg-surface"
          >
            Close
          </button>
        </div>

        <nav aria-label="Primary" className="overflow-y-auto">
          <SiteNav variant="menu" onNavigate={close} />
        </nav>

        <div className="mt-auto flex items-stretch border-t">
          <ThemeToggle className="border-r" />
          <ExternalLink
            href={siteConfig.links.github}
            className="label min-h-11 px-4 text-fg hover:bg-surface focus-visible:bg-surface"
          >
            GitHub
          </ExternalLink>
          <span className="label ml-auto flex items-center px-[var(--pad)] text-fg-muted">
            {year}
          </span>
        </div>
      </dialog>
    </>
  )
}
