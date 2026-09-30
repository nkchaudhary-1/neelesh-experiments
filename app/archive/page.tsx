import { ArchiveList } from '@/components/archive-list'
import { EmptyState } from '@/components/empty-state'
import { PageHeader, Slash } from '@/components/page-header'
import { getCollection } from '@/lib/content'
import { groupArchive } from '@/lib/content/collection'
import { pad, plural } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Archive',
  description: 'The full chronological archive of experiments, grouped by year and month.',
  path: '/archive',
})

export default function ArchivePage() {
  const { experiments } = getCollection()
  const years = groupArchive(experiments)

  return (
    <div className="frame">
      <PageHeader
        eyebrow={`${pad(experiments.length)} ${plural(experiments.length, 'Entry', 'Entries')}`}
        title={
          <>
            <Slash />
            Archive
          </>
        }
        aside={
          <p className="max-w-[38ch] text-fg-muted">
            Everything in the order it happened, newest first. Each line links to the full entry.
          </p>
        }
      />
      {years.length === 0 ? <EmptyState /> : <ArchiveList years={years} />}
    </div>
  )
}
