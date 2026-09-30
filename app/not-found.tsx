import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Not in the archive',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="frame">
      <div className="rule-grid">
        <div className="cell flex flex-col items-start gap-5 py-20 md:py-28">
          <p className="label text-fg-muted">404</p>
          <h1 className="text-display uppercase">Not in the archive</h1>
          <p className="max-w-[52ch] text-lead text-fg-muted">
            That entry does not exist, or it has not been published yet. It may have moved, or the
            link may be mistyped.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <Link
              href="/experiments"
              className="label inline-flex min-h-11 items-center text-accent underline underline-offset-4"
            >
              Experiment index
            </Link>
            <Link
              href="/"
              className="label inline-flex min-h-11 items-center text-fg-muted underline underline-offset-4 hover:text-fg focus-visible:text-fg"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
