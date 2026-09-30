/**
 * Desktop column spans for `count` equal cells laid out `perRow` to a row. The last row
 * shares the twelve columns evenly so the grid rules always close (perRow 4 → 3, 3×4, 2×6, 12).
 */
export function rowSpans(count: number, perRow: number): number[] {
  const spans: number[] = []
  for (let placed = 0; placed < count;) {
    const inRow = Math.min(perRow, count - placed)
    for (let i = 0; i < inRow; i++) spans.push(12 / inRow)
    placed += inRow
  }
  return spans
}

/** Written out in full so Tailwind can see every class. */
export const LG_COL_SPAN: Record<number, string> = {
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  12: 'lg:col-span-12',
}
