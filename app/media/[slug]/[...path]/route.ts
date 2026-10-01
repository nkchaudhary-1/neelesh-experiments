import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { getCollection, getExperiment } from '@/lib/content'
import { HASH_PREFIX } from '@/lib/content/entry'
import { entryFilePath, listEntryFiles, resolveAssetFromDisk } from '@/lib/content/files'

/**
 * Serves the files that live next to each experiment's index.mdx, so authors keep media
 * in the entry folder and never copy anything into public/. Every file is generated at
 * build time from the published entries.
 */
// Handlers answer unknown paths with their own 404, so new files work in `next dev` without a restart.
export const dynamicParams = true

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt; charset=utf-8',
}

const contentTypeFor = (file: string) => CONTENT_TYPES[extname(file).toLowerCase()]

const IMAGE = /\.(png|jpe?g|webp|avif|gif|svg)$/i

/** Images are addressed by content hash (see mediaUrl); video and captions by plain path. */
export function generateStaticParams() {
  return getCollection().experiments.flatMap((experiment) =>
    listEntryFiles(experiment.folder)
      .filter((file) => contentTypeFor(file))
      .map((file) => {
        const hash = IMAGE.test(file)
          ? resolveAssetFromDisk(experiment.folder, file)?.hash
          : undefined
        return {
          slug: experiment.slug,
          path: [...(hash ? [`${HASH_PREFIX}${hash}`] : []), ...file.split('/')],
        }
      }),
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path } = await params
  const experiment = getExperiment(slug)
  // A leading v-<hash> segment only busts caches; the file is the rest of the path.
  const relativePath = (
    path[0]?.startsWith(HASH_PREFIX) && path.length > 1 ? path.slice(1) : path
  ).join('/')
  const contentType = contentTypeFor(relativePath)
  const target = experiment && contentType ? entryFilePath(experiment.folder, relativePath) : null

  if (!target) return new Response('Not found', { status: 404 })

  try {
    const file = await readFile(target)
    return new Response(new Uint8Array(file), {
      headers: { 'Content-Type': contentType as string },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
