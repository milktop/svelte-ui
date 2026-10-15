// Local dates and times as ISO strings ('2026-10-14', '2026-10-14T16:00'),
// as the date picker's dates are, and the date sums EventCalendar does.
const pad = (n) => String(n).padStart(2, '0')
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const toISODateTime = (d) => `${toISODate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`

// '2026-10-14' or '2026-10-14T16:00' as a local Date.
export function parseLocal(value) {
  const [day, time = '00:00'] = String(value).split('T')
  const [y, m, d] = day.split('-').map(Number)
  const [h, min] = time.split(':').map(Number)
  return new Date(y, m - 1, d, h || 0, min || 0)
}

export const addDays = (d, days) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, d.getHours(), d.getMinutes())
export const addMinutes = (d, minutes) => new Date(d.getTime() + minutes * 60000)
export const minutesOfDay = (d) => d.getHours() * 60 + d.getMinutes()
export const sameDay = (a, b) => toISODate(a) === toISODate(b)
export const minutesBetween = (a, b) => Math.round((b.getTime() - a.getTime()) / 60000)

// The first day of the week holding `d` (Monday by default).
export function startOfWeek(d, weekStartsOn = 1) {
  const back = (d.getDay() - weekStartsOn + 7) % 7
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - back)
}
