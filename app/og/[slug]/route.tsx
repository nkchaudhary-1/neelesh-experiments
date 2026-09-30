import { getCollection, getExperiment } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { renderOgCard } from '@/lib/og/card'
import { siteConfig } from '@/lib/site-config'

/** Generated share image for every published experiment. */
// Handlers answer unknown paths with their own 404, so new files work in `next dev` without a restart.
export const dynamicParams = true

export function generateStaticParams() {
  return getCollection().experiments.map((experiment) => ({ slug: experiment.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experiment = getExperiment(slug)
  if (!experiment) return new Response('Not found', { status: 404 })

  return renderOgCard({
    eyebrow: siteConfig.name,
    badge: experiment.id,
    title: experiment.title,
    status: experiment.status,
    footerLeft: `${experiment.status} · ${formatDate(experiment.date)}`,
    footerRight: experiment.categories.map((category) => category.name).join(' / '),
  })
}
