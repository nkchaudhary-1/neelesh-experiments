import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { JsonLd } from '@/components/json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { siteConfig } from '@/lib/site-config'
import { getSiteUrl } from '@/lib/site-url'
import { DEFAULT_OG_IMAGE, websiteJsonLd } from '@/lib/seo'
import { themeInitScript } from '@/lib/theme/script'
import { THEME_COLORS } from '@/lib/theme/theme'
import '@/styles/globals.css'

const sans = localFont({
  src: './fonts/InterTight-Variable.woff2',
  variable: '--font-sans-face',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

const mono = localFont({
  src: './fonts/GeistMono-Variable.woff2',
  variable: '--font-mono-face',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [DEFAULT_OG_IMAGE] },
}

export const viewport: Viewport = {
  themeColor: THEME_COLORS.dark,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set before first paint by the inline script, so React must not reset it.
    <html
      lang="en"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript(siteConfig.theme.followSystem) }}
        />
      </head>
      <body id="top" className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link label">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  )
}
