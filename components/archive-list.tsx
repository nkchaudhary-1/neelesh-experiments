import { ExperimentRow } from '@/components/experiment-row'
import { pad, monthLabel, plural } from '@/lib/format'
import type { ArchiveYear } from '@/lib/content/types'

const count = (year: ArchiveYear) =>
  year.total ?? year.months.reduce((total, month) => total + month.entries.length, 0)

/**
 * Publication-style archive: a large year, then months with a sticky label beside a
 * compact run of entries. Heading levels are passed in so it fits under h1 or h2.
 */
export function ArchiveList({
  years,
  yearAs: Year = 'h2',
  monthAs: Month = 'h3',
}: {
  years: ArchiveYear[]
  yearAs?: 'h2' | 'h3'
  monthAs?: 'h3' | 'h4'
}) {
  return (
    <>
      {years.map((year) => (
        <section key={year.year} aria-labelledby={`archive-${year.year}`}>
          <div className="rule-grid">
            <div className="cell flex items-baseline justify-between gap-4 py-5 md:py-7">
              <Year id={`archive-${year.year}`} className="font-mono text-headline tabular-nums">
                {year.year}
              </Year>
              <p className="label text-fg-muted">
                {pad(count(year))} {plural(count(year), 'Entry', 'Entries')}
              </p>
            </div>
          </div>
          {year.months.map((month) => (
            <div key={month.month} className="rule-grid">
              <div className="cell py-4 lg:col-span-3 lg:py-5">
                <Month className="label text-fg lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
                  {monthLabel(month.month)} <span className="text-fg-muted">{year.year}</span>
                </Month>
              </div>
              <div className="cell p-0 lg:col-span-9">
                <ul className="[&>li:last-child]:border-b-0">
                  {month.entries.map((entry) => (
                    <ExperimentRow key={entry.slug} experiment={entry} titleAs="p" />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      ))}
    </>
  )
}
