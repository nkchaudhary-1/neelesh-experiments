'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { NavLinks } from '@/components/nav-links'
import { resolveCurrentNav, type NavCategory } from '@/lib/nav'

interface NavProps {
  variant: 'bar' | 'menu'
  categories: NavCategory[]
  onNavigate?: () => void
}

function CurrentNav({ variant, categories, onNavigate }: NavProps) {
  const pathname = usePathname()
  const view = useSearchParams().get('view')
  return (
    <NavLinks
      current={resolveCurrentNav(pathname, view)}
      variant={variant}
      categories={categories}
      onNavigate={onNavigate}
    />
  )
}

/**
 * Nav that marks the current page. Reading the query string needs a Suspense boundary on a
 * static route, so the prerendered HTML carries the same links without aria-current and the
 * browser fills it in on hydration.
 */
export function SiteNav({ variant, categories, onNavigate }: NavProps) {
  return (
    <Suspense
      fallback={
        <NavLinks
          current={null}
          variant={variant}
          categories={categories}
          onNavigate={onNavigate}
        />
      }
    >
      <CurrentNav variant={variant} categories={categories} onNavigate={onNavigate} />
    </Suspense>
  )
}
