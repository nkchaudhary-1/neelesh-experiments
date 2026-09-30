import Link from 'next/link'
import { cn } from '@/lib/cn'
import { NAV_ITEMS, type NavKey } from '@/lib/nav'

/**
 * Presentational nav shared by the server-rendered fallback (no current item) and the
 * client SiteNav that knows the URL.
 */
export function NavLinks({
  current,
  variant,
  onNavigate,
}: {
  current: NavKey | null
  variant: 'bar' | 'menu'
  onNavigate?: () => void
}) {
  return (
    <ul className={variant === 'bar' ? 'flex h-full' : 'flex flex-col'}>
      {NAV_ITEMS.map((item, index) => (
        <li key={item.key} className={variant === 'bar' ? 'h-full' : undefined}>
          <Link
            href={item.href}
            aria-current={current === item.key ? 'page' : undefined}
            onClick={onNavigate}
            className={cn(
              variant === 'bar'
                ? 'label relative flex h-full items-center border-r px-4 text-fg-muted hover:bg-surface hover:text-fg focus-visible:bg-surface focus-visible:text-fg aria-[current=page]:text-accent aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-accent lg:px-6'
                : 'flex min-h-16 items-baseline gap-4 border-b px-[var(--pad)] py-4 text-section uppercase hover:bg-surface focus-visible:bg-surface aria-[current=page]:text-accent',
            )}
          >
            {variant === 'menu' ? (
              <span aria-hidden className="label text-fg-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
            ) : null}
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
