import Link from 'next/link'
import { ArrowRight } from '@/components/icons'

/** Mono section heading such as "/ LATEST EXPERIMENTS", with an optional trailing link. */
export function SectionLabel({
  children,
  id,
  action,
}: {
  children: React.ReactNode
  id?: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="rule-grid">
      <div className="cell flex items-center justify-between gap-4 py-3 md:py-3.5">
        <h2 id={id} className="label text-fg">
          <span aria-hidden className="text-fg-muted">
            /{' '}
          </span>
          {children}
        </h2>
        {action ? (
          <Link
            href={action.href}
            className="label group inline-flex min-h-11 items-center gap-2 text-fg-muted hover:text-fg focus-visible:text-fg md:min-h-0"
          >
            {action.label}
            <ArrowRight className="transition-transform duration-150 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]" />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
