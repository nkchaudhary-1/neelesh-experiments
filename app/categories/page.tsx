import { CategoryDirectory } from '@/components/category-directory'
import { EmptyState } from '@/components/empty-state'
import { PageHeader, Slash } from '@/components/page-header'
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
        title={
          <>
            <Slash />
            Categories
          </>
        }
        aside={
          <p className="max-w-[38ch] text-fg-muted">
            Categories are a controlled list. Each one shows how much work it holds and what landed
            in it most recently.
          </p>
        }
      />
      {categories.length === 0 ? <EmptyState /> : <CategoryDirectory categories={categories} />}
    </div>
  )
}
