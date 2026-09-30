import type { Emphasis, Paragraph, PhrasingContent, Root, RootContent, Text } from 'mdast'

const CAPTION_PREFIX = /^caption:\s*/i

function isBlank(node: PhrasingContent): boolean {
  return node.type === 'text' && node.value.trim() === ''
}

/** *Caption: …* → the emphasised children with the prefix removed, or null. */
function captionChildren(node: PhrasingContent): PhrasingContent[] | null {
  if (node.type !== 'emphasis') return null
  const first = (node as Emphasis).children[0]
  if (first?.type !== 'text' || !CAPTION_PREFIX.test(first.value)) return null
  const stripped: Text = { ...first, value: first.value.replace(CAPTION_PREFIX, '') }
  return [stripped, ...(node as Emphasis).children.slice(1)]
}

function figureParts(
  node: RootContent,
): { paragraph: Paragraph; caption: PhrasingContent[] | null } | null {
  if (node.type !== 'paragraph') return null
  const parts = node.children.filter((child) => !isBlank(child))
  if (parts[0]?.type !== 'image') return null
  if (parts.length === 1) return { paragraph: node, caption: null }
  const caption = parts.length === 2 && parts[1] ? captionChildren(parts[1]) : null
  return caption ? { paragraph: node, caption } : null
}

/**
 * The content format puts media in a paragraph of its own, optionally followed by
 * `*Caption: …*`. This turns that pair into <figure><img><figcaption>, which is valid
 * HTML (a figure cannot live inside a <p>) and lets the caption sit with its image.
 */
export function remarkFigures() {
  return (tree: Root) => {
    const nodes = tree.children
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      const figure = node ? figureParts(node) : null
      if (!node || !figure) continue

      const image = figure.paragraph.children.find(
        (child) => child.type === 'image',
      ) as PhrasingContent
      let caption = figure.caption

      // Caption written as its own paragraph directly below the image.
      if (!caption) {
        const next = nodes[index + 1]
        const following = next?.type === 'paragraph' ? next.children.filter((c) => !isBlank(c)) : []
        const nextCaption =
          following.length === 1 && following[0] ? captionChildren(following[0]) : null
        if (nextCaption) {
          caption = nextCaption
          nodes.splice(index + 1, 1)
        }
      }

      const children: PhrasingContent[] = [image]
      if (caption) {
        children.push({
          type: 'paragraph',
          children: caption,
          data: { hName: 'figcaption' },
        } as unknown as PhrasingContent)
      }
      node.data = { ...node.data, hName: 'figure' }
      ;(node as Paragraph).children = children
    }
  }
}
