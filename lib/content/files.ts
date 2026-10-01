import 'server-only'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { imageSize } from 'image-size'
import { ContentError } from '@/lib/content/errors'
import type { AssetResolver, EntrySource } from '@/lib/content/entry'

const CONTENT_DIR = join(process.cwd(), 'content')
const EXPERIMENTS_DIR = join(CONTENT_DIR, 'experiments')

const INDEX_FILES = ['index.mdx', 'index.md']

/** One source per experiment folder. Folders starting with "." or "_" are ignored. */
export function readEntrySources(): EntrySource[] {
  if (!existsSync(EXPERIMENTS_DIR)) return []

  return readdirSync(EXPERIMENTS_DIR, { withFileTypes: true })
    .filter((item) => item.isDirectory() && !/^[._]/.test(item.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => {
      const indexFile = INDEX_FILES.find((name) =>
        existsSync(join(EXPERIMENTS_DIR, item.name, name)),
      )
      const path = `content/experiments/${item.name}/${indexFile ?? INDEX_FILES[0]}`
      if (!indexFile) {
        throw new ContentError(`${path}\n  • every experiment folder needs an index.mdx`)
      }
      return {
        folder: item.name,
        path,
        source: readFileSync(join(EXPERIMENTS_DIR, item.name, indexFile), 'utf8'),
      }
    })
}

/** Absolute path of a file inside an entry folder, or null if it would escape the folder. */
export function entryFilePath(folder: string, relativePath: string): string | null {
  const base = join(EXPERIMENTS_DIR, folder)
  const target = join(base, relativePath)
  return target.startsWith(base + sep) ? target : null
}

export const resolveAssetFromDisk: AssetResolver = (folder, relativePath) => {
  const target = entryFilePath(folder, relativePath)
  if (!target || !existsSync(target) || !statSync(target).isFile()) return undefined
  try {
    const bytes = readFileSync(target)
    const { width, height } = imageSize(bytes)
    if (width && height) {
      return { width, height, hash: createHash('sha1').update(bytes).digest('hex').slice(0, 8) }
    }
  } catch {
    // fall through to the error below
  }
  throw new ContentError(
    `content/experiments/${folder}/${relativePath}\n  • could not read the dimensions of this image. Use PNG, JPG, WebP, AVIF, GIF or SVG`,
  )
}

/** Every file in an entry folder except the index, as forward-slash relative paths. */
export function listEntryFiles(folder: string): string[] {
  const base = join(EXPERIMENTS_DIR, folder)
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((item) =>
      item.isDirectory() ? walk(join(dir, item.name)) : [join(dir, item.name)],
    )
  return walk(base)
    .map((file) => relative(base, file).split(sep).join('/'))
    .filter((file) => !INDEX_FILES.includes(file) && !file.startsWith('.'))
}

export function readSiteFile(name: string): string | undefined {
  const path = join(CONTENT_DIR, 'site', name)
  return existsSync(path) ? readFileSync(path, 'utf8') : undefined
}
