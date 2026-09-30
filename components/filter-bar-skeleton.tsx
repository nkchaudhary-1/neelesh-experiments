/** Holds the filter bar's space in the static HTML so hydration does not shift the page. */
export function FilterBarSkeleton() {
  return (
    <div aria-hidden className="rule-grid">
      {[
        'md:min-h-[4.25rem]',
        'md:min-h-[4.25rem] lg:col-span-6',
        'md:col-span-6 lg:col-span-3',
        'md:col-span-6 lg:col-span-3',
      ].map((className) => (
        <div key={className} className={`cell min-h-20 md:min-h-[4.25rem] ${className}`}>
          <div className="h-3 w-24 bg-surface-raised" />
        </div>
      ))}
      <div className="cell min-h-[3.25rem]" />
    </div>
  )
}
