import { CategoryDirectory } from '@/components/category-directory'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { getCollection } from '@/lib/content'
import { pad, plural } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Categories',
  description:
    'Browse the experiment archive by category: AI, interaction, motion, UI, web and more.',
  path: '/categories',
})

export default function CategoriesPage() {
  const { categories } = getCollection()

  return (
    <div className="frame">
      <PageHeader
        eyebrow={`${pad(categories.length)} ${plural(categories.length, 'Category', 'Categories')}`}
        title="Categories"
        intro="The archive grouped by subject. Each category shows how many experiments it holds and the newest one."
      />
      {categories.length === 0 ? <EmptyState /> : <CategoryDirectory categories={categories} />}
    </div>
  )
}
