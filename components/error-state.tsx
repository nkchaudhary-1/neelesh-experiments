'use client'

import Link from 'next/link'
import { BracketButton } from '@/components/bracket-button'

/** Concise, recoverable: say what happened, offer a retry and a way out. */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="frame">
      <div className="rule-grid">
        <div className="cell flex flex-col items-start gap-5 py-20 md:py-28">
          <p className="label text-fg">Something went wrong</p>
          <h1 className="text-headline">This page could not load.</h1>
          <p className="max-w-[52ch] text-lead text-fg-muted">
            It is likely a temporary problem. Try again, or head back to the archive.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <BracketButton onClick={onRetry}>Try again</BracketButton>
            <Link
              href="/experiments"
              className="label inline-flex min-h-11 items-center text-fg-muted underline underline-offset-4 hover:text-fg focus-visible:text-fg"
            >
              Experiment index
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
