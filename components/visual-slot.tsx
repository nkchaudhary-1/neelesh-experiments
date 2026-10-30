/**
 * The empty visual in a hero banner, for a visual that is not made yet: a framed block crossed by
 * its two diagonals. Decorative only, so assistive technology skips it. Swap it for an image or a
 * motion piece when one exists.
 */
export function VisualSlot({ label = 'Hero visual' }: { label?: string }) {
  return (
    <div aria-hidden className="visual-placeholder visual-placeholder--fill">
      <span className="label">{label}</span>
      <span className="label">Placeholder</span>
    </div>
  )
}
