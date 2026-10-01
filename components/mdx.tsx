import { evaluate } from '@mdx-js/mdx'
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from '@/components/external-link'
import { ContentError } from '@/lib/content/errors'
import { mediaUrl, normalizeAssetPath } from '@/lib/content/entry'
import { entryFilePath, resolveAssetFromDisk } from '@/lib/content/files'
import { remarkFigures } from '@/lib/content/remark-figures'
import { existsSync } from 'node:fs'

interface EntryScope {
  slug: string
  folder: string
}

const VIDEO = /\.(mp4|webm|mov)$/i
const SIZES = '(min-width: 1760px) 1100px, (min-width: 1024px) 66vw, 100vw'

function MdxLink({ href = '', children }: React.ComponentProps<'a'>) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <ExternalLink href={href} inline>
        {children}
      </ExternalLink>
    )
  }
  if (href.startsWith('/') && !href.startsWith('//')) return <Link href={href}>{children}</Link>
  return <a href={href}>{children}</a>
}

function createMedia(scope: EntryScope | undefined) {
  return function MdxMedia({ src, alt = '' }: React.ComponentProps<'img'>) {
    const reference = typeof src === 'string' ? src : ''
    const relativePath = normalizeAssetPath(reference)
    if (!scope || !relativePath || /^[a-z][a-z0-9+.-]*:/i.test(reference)) {
      throw new ContentError(
        `Image "${reference}"${scope ? ` in ${scope.folder}` : ''} must be a relative path to a file in the experiment folder, for example ./detail-01.png`,
      )
    }

    if (VIDEO.test(relativePath)) {
      const target = entryFilePath(scope.folder, relativePath)
      if (!target || !existsSync(target)) {
        throw new ContentError(`Video "${reference}" was not found in ${scope.folder}/`)
      }
      // Captions are picked up automatically from a .vtt file with the same base name.
      const captions = relativePath.replace(VIDEO, '.vtt')
      const captionTarget = entryFilePath(scope.folder, captions)
      return (
        <video controls preload="metadata" playsInline aria-label={alt || undefined}>
          <source src={mediaUrl(scope.slug, relativePath)} />
          {captionTarget && existsSync(captionTarget) ? (
            <track
              kind="captions"
              srcLang="en"
              label="English"
              src={mediaUrl(scope.slug, captions)}
              default
            />
          ) : null}
        </video>
      )
    }

    const size = resolveAssetFromDisk(scope.folder, relativePath)
    if (!size) {
      throw new ContentError(`Image "${reference}" was not found in ${scope.folder}/`)
    }
    return (
      <Image
        src={mediaUrl(scope.slug, relativePath, size.hash)}
        alt={alt}
        width={size.width}
        height={size.height}
        sizes={SIZES}
      />
    )
  }
}

function buildComponents(scope: EntryScope | undefined): MDXComponents {
  return {
    a: MdxLink,
    img: createMedia(scope),
    // One h1 per page: a stray # in the body is demoted instead of duplicating the title.
    h1: (props) => <h3 {...props} />,
    // Scrollable code needs to be reachable from the keyboard.
    pre: (props) => <pre tabIndex={0} {...props} />,
  }
}

/** Server-side MDX renderer. `scope` lets relative image paths resolve inside the entry folder. */
export async function Mdx({ source, scope }: { source: string; scope?: EntryScope }) {
  const { default: Content } = await evaluate(source, {
    ...(runtime as unknown as Parameters<typeof evaluate>[1]),
    remarkPlugins: [remarkGfm, remarkFigures],
  })
  return <Content components={buildComponents(scope)} />
}
