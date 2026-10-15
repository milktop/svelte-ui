// Number, size and relative-time formatting, on Intl, with the formatters
// kept (making one is the slow part), so they're cheap to call in lists.
// Each takes a `locale`: the app's (uiLocale) when left out.
import { uiLocale } from '../locale.svelte.js'

const cache = new Map()
function cached(kind, locale, options, make) {
  const key = `${kind}|${locale ?? ''}|${JSON.stringify(options)}`
  if (!cache.has(key)) cache.set(key, make())
  return cache.get(key)
}

/**
 * A number for people: grouped digits, currency, percent, units, compact.
 *
 *   formatNumber(1820.5)                                         // '1,820.5'
 *   formatNumber(1820, { style: 'currency', currency: 'GBP' })   // '£1,820.00'
 *   formatNumber(0.125, { style: 'percent' })                    // '13%'
 *   formatNumber(48.5, { style: 'unit', unit: 'hour' })          // '48.5 hr'
 *   formatNumber(12400, { notation: 'compact' })                 // '12K'
 */
export function formatNumber(value, { locale, ...options } = {}) {
  if (value == null || (typeof value === 'number' && Number.isNaN(value))) return ''
  const tag = locale ?? uiLocale.locale
  return cached('number', tag, options, () => new Intl.NumberFormat(tag, options)).format(value)
}

/**
 * A size in bytes: '512 B', '624 KB', '2.4 MB' (decimal units, as file
 * managers show them; `binary` for KiB, MiB…).
 */
export function formatBytes(bytes, { locale, binary = false, maximumFractionDigits = 1 } = {}) {
  if (bytes == null || Number.isNaN(bytes)) return ''
  const base = binary ? 1024 : 1000
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte']
  let unit = 0
  let value = Math.abs(bytes)
  while (value >= base && unit < units.length - 1) { value /= base; unit++ }
  const text = formatNumber(Math.sign(bytes) * value, { locale, style: 'unit', unit: units[unit], unitDisplay: unit === 0 ? 'long' : 'short',
    maximumFractionDigits: unit === 0 ? 0 : maximumFractionDigits })
  // Intl writes 'kB'; binary sizes swap in KiB, MiB…
  return binary && unit > 0 ? text.replace(/[kKMGTP]B/, (m) => `${m[0].toUpperCase()}iB`) : text.replace(/\bkB\b/, 'KB')
}

const steps = [['second', 60], ['minute', 60], ['hour', 24], ['day', 7], ['week', 4.34524], ['month', 12], ['year', Infinity]]

/**
 * A time relative to now: '2 hours ago', 'in 3 days', 'yesterday'.
 *
 *   formatRelative('2026-10-11T09:00')
 *   formatRelative(date, { numeric: 'always' })   // '1 day ago', not 'yesterday'
 *
 * - `now`: what it's relative to (now); `numeric`: 'auto' (default) or 'always';
 *   `style`: 'long' (default), 'short' or 'narrow'
 */
export function formatRelative(date, { locale, now = new Date(), numeric = 'auto', style = 'long' } = {}) {
  if (date == null) return ''
  const when = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(when.getTime())) return ''
  let value = (when.getTime() - now.getTime()) / 1000
  let unit = 'second'
  for (const [name, size] of steps) {
    unit = name
    if (Math.abs(value) < size) break
    value /= size
  }
  const tag = locale ?? uiLocale.locale
  return cached('relative', tag, { numeric, style }, () => new Intl.RelativeTimeFormat(tag, { numeric, style })).format(Math.round(value), unit)
}
