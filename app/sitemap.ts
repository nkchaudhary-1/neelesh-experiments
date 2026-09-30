import type { MetadataRoute } from 'next'
import { getCollection } from '@/lib/content'
import { absoluteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const { experiments, categories } = getCollection()
  const latest = experiments[0]?.updated ?? experiments[0]?.date

  return [
    { url: absoluteUrl('/'), lastModified: latest, changeFrequency: 'weekly', priority: 1 },
    {
      url: absoluteUrl('/experiments'),
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/categories'),
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/archive'),
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    { url: absoluteUrl('/about'), changeFrequency: 'yearly', priority: 0.4 },
    ...categories.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: category.latest.updated ?? category.latest.date,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...experiments.map((experiment) => ({
      url: absoluteUrl(`/experiments/${experiment.slug}`),
      lastModified: experiment.updated ?? experiment.date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
