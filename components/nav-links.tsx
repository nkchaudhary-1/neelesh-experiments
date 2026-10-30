import Link from 'next/link'
import { CategoryMenu } from '@/components/category-menu'
import { pad } from '@/lib/format'
import { NAV_ITEMS, type NavCategory, type NavKey } from '@/lib/nav'

const barLink =
  'label relative flex h-full items-center border-r px-4 text-fg-muted hover:bg-surface hover:text-fg focus-visible:bg-surface focus-visible:text-fg aria-[current=page]:text-accent aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-accent lg:px-6'

const menuLink =
  'flex min-h-16 items-baseline gap-4 px-[var(--pad)] py-4 text-section hover:bg-surface focus-visible:bg-surface aria-[current=page]:text-accent'

/**
 * Presentational nav shared by the server-rendered fallback (no current item) and the
 * client SiteNav that knows the URL.
 */
export function NavLinks({
  current,
  variant,
  categories,
  onNavigate,
}: {
  current: NavKey | null
  variant: 'bar' | 'menu'
  categories: NavCategory[]
  onNavigate?: () => void
}) {
  return (
    <ul className={variant === 'bar' ? 'flex h-full' : 'flex flex-col'}>
      {NAV_ITEMS.map((item, index) => (
        <li key={item.key} className={variant === 'bar' ? 'h-full' : 'border-b'}>
          {variant === 'bar' && item.key === 'categories' ? (
            <CategoryMenu
              categories={categories}
              current={current === item.key}
              className={barLink}
            />
          ) : (
            <Link
              href={item.href}
              aria-current={current === item.key ? 'page' : undefined}
              onClick={onNavigate}
              className={variant === 'bar' ? barLink : menuLink}
            >
              {variant === 'menu' ? (
                <span aria-hidden className="label text-fg-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
              ) : null}
              {item.label}
            </Link>
          )}

          {variant === 'menu' && item.key === 'categories' ? (
            <ul className="flex flex-wrap gap-2 px-[var(--pad)] pb-5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    onClick={onNavigate}
                    className="label inline-flex min-h-11 items-center gap-3 rounded-full border px-4 hover:bg-surface focus-visible:bg-surface"
                  >
                    {category.name}
                    <span className="text-fg-muted">{pad(category.count)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
