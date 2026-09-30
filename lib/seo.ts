import type { Metadata } from 'next'
import type { Experiment } from '@/lib/content/types'
import { siteConfig } from '@/lib/site-config'
import { absoluteUrl } from '@/lib/site-url'

export const DEFAULT_OG_IMAGE = '/og/default.png'

function fullTitle(title?: string): string {
  return title ? `${title} — ${siteConfig.name}` : siteConfig.name
}

interface PageMetadataInput {
  /** Omit for the home page. */
  title?: string
  description: string
  /** Path without query string. Becomes the canonical URL. */
  path: string
  image?: string
  article?: { publishedTime: string; modifiedTime?: string; tags?: string[] }
}

/**
 * One place that builds title, description, canonical, Open Graph and Twitter together.
 * Next replaces a parent's openGraph object wholesale, so every page must supply all of it.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  article,
}: PageMetadataInput): Metadata {
  const shared = title ? fullTitle(title) : siteConfig.name
  const imageUrl = image ?? DEFAULT_OG_IMAGE
  const images = [{ url: imageUrl, width: 1200, height: 630 }]

  return {
    title: title ? title : { absolute: siteConfig.name },
    description,
    alternates: { canonical: path },
    openGraph: article
      ? {
          type: 'article',
          url: path,
          siteName: siteConfig.name,
          title: shared,
          description,
          images,
          authors: [siteConfig.author],
          ...article,
        }
      : {
          type: 'website',
          url: path,
          siteName: siteConfig.name,
          title: shared,
          description,
          images,
        },
    twitter: { card: 'summary_large_image', title: shared, description, images: [imageUrl] },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: absoluteUrl('/'),
    description: siteConfig.description,
    inLanguage: 'en',
    author: { '@type': 'Person', name: siteConfig.author },
  }
}

export function experimentJsonLd(experiment: Experiment, imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: experiment.title,
    headline: experiment.title,
    description: experiment.description,
    url: absoluteUrl(`/experiments/${experiment.slug}`),
    identifier: experiment.id,
    datePublished: experiment.date,
    dateModified: experiment.updated ?? experiment.date,
    image: imageUrl,
    genre: experiment.categories.map((category) => category.name),
    keywords: experiment.tags.join(', ') || undefined,
    inLanguage: 'en',
    creator: { '@type': 'Person', name: siteConfig.author },
    isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: absoluteUrl('/') },
    codeRepository: experiment.githubUrl,
    sameAs: [experiment.demoUrl, experiment.githubUrl].filter(Boolean),
  }
}
