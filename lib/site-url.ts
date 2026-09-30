const FALLBACK_URL = 'http://localhost:3000'

/** Canonical origin without a trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  return (configured || FALLBACK_URL).replace(/\/+$/, '')
}

export function absoluteUrl(path = '/'): string {
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`
}
