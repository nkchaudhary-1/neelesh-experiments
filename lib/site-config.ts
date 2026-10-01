import type { CategoryDefinition } from '@/lib/content/types'

/**
 * Site-wide constants. Edit this file to change contact links, copy that appears
 * on several pages, or to introduce a new category.
 */
export const siteConfig = {
  name: 'NEEL / EXPERIMENTS',
  shortName: 'NEEL / EXP',
  description:
    'A public archive of prototypes, interfaces, AI experiments, motion studies and unfinished investigations by Neelesh.',
  tagline: 'A public archive of things I’m building, testing, breaking and learning from.',
  author: 'Neelesh',
  /** Shown as CURRENTLY EXPLORING on the home page. */
  exploring: ['AI', 'Interaction', 'Motion', 'Web'],
  links: {
    github: 'https://github.com/nkchaudhary-1',
    /** Leave empty to hide the email link everywhere. */
    email: '',
  },
  /**
   * false: no entry images anywhere. Covers become type-led plates, in-article images and
   * their captions are left out, and no image file is loaded.
   * true: show the cover and detail images that live in each entry folder.
   */
  showImages: false,
  theme: {
    /**
     * false: first visits always open in dark (the brand default).
     * true: first visits follow prefers-color-scheme; dark stays the final fallback.
     * An explicit choice made with the header control always wins.
     */
    followSystem: false,
  },
} as const

/**
 * Controlled category list. Frontmatter categories must match one of these names
 * (case-insensitive); a typo fails the build instead of silently creating a new category.
 */
export const categoryDefinitions: readonly CategoryDefinition[] = [
  {
    name: 'AI',
    slug: 'ai',
    description: 'Experiments exploring interfaces and workflows around artificial intelligence.',
  },
  {
    name: 'UI',
    slug: 'ui',
    description:
      'Interface studies: layout, density, components and the small decisions that make a screen feel considered.',
  },
  {
    name: 'UX',
    slug: 'ux',
    description:
      'Flows, structures and behaviours. Experiments in how products are understood and used.',
  },
  {
    name: 'Interaction',
    slug: 'interaction',
    description: 'How interfaces respond: controls, feedback and the feel of acting on a system.',
  },
  {
    name: 'Motion',
    slug: 'motion',
    description: 'Transitions, easing and timing as part of how an interface communicates.',
  },
  {
    name: 'Web',
    slug: 'web',
    description: 'Websites and browser-native builds. Things made to live at a URL.',
  },
  {
    name: 'Tools',
    slug: 'tools',
    description: 'Small utilities and workflows built to make my own work faster.',
  },
  {
    name: 'Experimental',
    slug: 'experimental',
    description: 'Open-ended investigations without a clear brief. Some go nowhere on purpose.',
  },
  {
    name: 'Other',
    slug: 'other',
    description: 'Everything that does not sit cleanly in another category.',
  },
]
