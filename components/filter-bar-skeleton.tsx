/** Holds the filter bar's space in the static HTML so hydration does not shift the page. */
export function FilterBarSkeleton() {
  return (
    <div aria-hidden className="rule-grid">
      <div className="cell min-h-[4.25rem] md:min-h-[3.875rem]">
        <div className="h-3 w-24 bg-surface-raised" />
      </div>
    </div>
  )
}
