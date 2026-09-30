const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

/** 29 SEP 2026. Pure string maths so server and client can never disagree on a time zone. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return `${pad(day ?? 1)} ${MONTHS[(month ?? 1) - 1]} ${year}`
}

/** 2026.09.29, used in dense index rows. */
export function formatDateNumeric(iso: string): string {
  return iso.replaceAll('-', '.')
}

export function monthLabel(month: number): string {
  return MONTHS[month - 1] ?? ''
}

export function plural(count: number, singular: string, pluralForm = `${singular}S`): string {
  return count === 1 ? singular : pluralForm
}
