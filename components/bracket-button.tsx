import { cn } from '@/lib/cn'

/** [ RESET FILTERS ]: a square, mono button. The brackets are a visual cue only. */
export function BracketButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'label inline-flex min-h-11 items-center gap-2 border border-border-strong px-4 text-fg hover:bg-fg hover:text-bg focus-visible:bg-fg focus-visible:text-bg',
        className,
      )}
      {...props}
    >
      <span aria-hidden>[</span>
      {children}
      <span aria-hidden>]</span>
    </button>
  )
}
