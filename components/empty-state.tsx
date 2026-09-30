export function EmptyState({ action }: { action?: React.ReactNode }) {
  return (
    <div className="rule-grid">
      <div className="cell flex flex-col items-start gap-5 py-16 md:py-24">
        <p className="label text-fg">No experiments found</p>
        <p className="text-section text-fg-muted">Nothing here yet.</p>
        {action}
      </div>
    </div>
  )
}
