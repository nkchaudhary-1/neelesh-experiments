import { cn } from '@/lib/cn'

function Bar({ className }: { className: string }) {
  return <div className={cn('animate-pulse bg-surface-raised', className)} />
}

/** Themed placeholder with the same rules and rhythm as the real content. */
export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="frame">
      <span className="sr-only">{label}…</span>
      <div aria-hidden className="rule-grid">
        <div className="cell py-10">
          <Bar className="h-3 w-40" />
          <Bar className="mt-8 h-16 w-3/4 md:h-24" />
        </div>
        {[0, 1, 2].map((item) => (
          <div key={item} className="cell md:col-span-4">
            <Bar className="aspect-[4/3] w-full" />
            <Bar className="mt-5 h-3 w-24" />
            <Bar className="mt-4 h-6 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
