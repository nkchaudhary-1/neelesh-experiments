const LABELS = ['Visual 01', 'Visual 02', 'Visual 03']

/**
 * Empty slots for visuals that are not made yet: a framed block with a diagonal cross, the usual
 * sign of a placeholder. Decorative only, so assistive technology skips them. Swap each block
 * for an image or a motion piece when it exists.
 */
export function VisualPlaceholders({ count = 3 }: { count?: 2 | 3 }) {
  const span = count === 2 ? 'md:col-span-6' : 'md:col-span-4'

  return (
    <div aria-hidden className="rule-grid">
      {LABELS.slice(0, count).map((label) => (
        <div key={label} className={`cell p-0 ${span}`}>
          <div className="visual-placeholder">
            <span className="label">{label}</span>
            <span className="label">Placeholder</span>
          </div>
        </div>
      ))}
    </div>
  )
}
