import { ArchiveList } from '@/components/archive-list'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
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
        title="Archive"
        intro="Everything in the order it happened, grouped by month. Each line links to the full entry."
      />
      {years.length === 0 ? <EmptyState /> : <ArchiveList years={years} />}
    </div>
  )
}
