'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { NavLinks } from '@/components/nav-links'
import { resolveCurrentNav } from '@/lib/nav'

function CurrentNav({ variant, onNavigate }: { variant: 'bar' | 'menu'; onNavigate?: () => void }) {
  const pathname = usePathname()
  const view = useSearchParams().get('view')
  return (
    <NavLinks
      current={resolveCurrentNav(pathname, view)}
      variant={variant}
      onNavigate={onNavigate}
    />
  )
}

/**
 * Nav that marks the current page. Reading the query string needs a Suspense boundary on a
 * static route, so the prerendered HTML carries the same links without aria-current and the
 * browser fills it in on hydration.
 */
export function SiteNav({
  variant,
  onNavigate,
}: {
  variant: 'bar' | 'menu'
  onNavigate?: () => void
}) {
  return (
    <Suspense fallback={<NavLinks current={null} variant={variant} onNavigate={onNavigate} />}>
      <CurrentNav variant={variant} onNavigate={onNavigate} />
    </Suspense>
  )
}
