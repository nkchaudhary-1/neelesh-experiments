import { ArrowUpRight } from '@/components/icons'
import { cn } from '@/lib/cn'

/** External destination: visible ↗ marker, safe rel, and a note for screen readers. */
export function ExternalLink({
  href,
  children,
  className,
  inline = false,
}: {
  href: string
  children: React.ReactNode
  className?: string
  /** Flow with surrounding text (and wrap across lines) instead of sitting in its own box. */
  inline?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('group/ext', inline ? 'inline' : 'inline-flex items-center gap-1.5', className)}
    >
      {children}
      <ArrowUpRight
        className={cn(
          'transition-transform duration-150 group-hover/ext:translate-x-0.5 group-hover/ext:-translate-y-0.5 group-focus-visible/ext:translate-x-0.5 group-focus-visible/ext:-translate-y-0.5',
          inline && 'ml-1 inline-block align-[-0.12em]',
        )}
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
