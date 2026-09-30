export const NAV_ITEMS = [
  { key: 'experiments', label: 'Experiments', href: '/experiments' },
  { key: 'index', label: 'Index', href: '/experiments?view=index' },
  { key: 'about', label: 'About', href: '/about' },
] as const

export type NavKey = (typeof NAV_ITEMS)[number]['key']

/** Which primary nav item owns the current URL. INDEX is the directory in index mode. */
export function resolveCurrentNav(pathname: string, view: string | null): NavKey | null {
  if (pathname === '/experiments' && view === 'index') return 'index'
  if (pathname === '/experiments' || pathname.startsWith('/experiments/')) return 'experiments'
  if (pathname === '/about') return 'about'
  return null
}
