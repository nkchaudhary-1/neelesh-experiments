'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown } from '@/components/icons'
import { pad } from '@/lib/format'
import type { NavCategory } from '@/lib/nav'

const itemClass =
  'label flex min-h-11 items-center justify-between gap-6 px-4 text-fg-muted hover:bg-surface hover:text-fg focus-visible:bg-surface focus-visible:text-fg'

/**
 * The Categories item in the top bar. The link goes to the full categories page, so touch and
 * no-JS visitors still get every category. A mouse hovering, or keyboard focus landing on it,
 * also opens the list. Escape closes it, and it stays open while the pointer moves onto it.
 */
export function CategoryMenu({
  categories,
  current,
  className,
}: {
  categories: NavCategory[]
  current: boolean
  className: string
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Listen on the document: a menu opened by hover has no focus inside it to receive the key.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div
      className="relative h-full"
      // Touch taps navigate straight to /categories; only a mouse opens the list on hover.
      onPointerEnter={(event) => event.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setOpen(false)}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) setOpen(true)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <Link
        href="/categories"
        aria-current={current ? 'page' : undefined}
        onClick={close}
        className={className}
      >
        Categories
        <ChevronDown className="ml-2 text-fg-muted" />
      </Link>

      {open ? (
        <div className="absolute top-full left-0 z-50 w-64 border border-t-0 bg-bg">
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`} onClick={close} className={itemClass}>
                  {category.name}
                  <span>{pad(category.count)}</span>
                </Link>
              </li>
            ))}
            <li className="border-t">
              <Link href="/categories" onClick={close} className={`${itemClass} text-accent`}>
                All categories
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  )
}
