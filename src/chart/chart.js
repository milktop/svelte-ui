import { scaleLinear } from 'd3-scale'

// Charts are SVG drawn by Svelte, with d3 for the maths (scales and shapes).
// Series take --ui-chart-1…5 in turn, or a `color` of their own ('accent',
// 'success', 'danger', or any CSS colour).
export function seriesColor(color, index) {
  if (!color) return `var(--ui-chart-${(index % 5) + 1})`
  if (['accent', 'success', 'danger'].includes(color)) return `var(--ui-${color})`
  return color
}

// The series to draw: `series`, or one from `y`.
export const seriesOf = (series, y) =>
  (series ?? (y ? [{ key: y, label: y }] : [])).map((s, i) => ({ label: s.key, ...s, color: seriesColor(s.color, i) }))

export const formatter = (format) => (value) =>
  format ? format(value) : typeof value === 'number' ? value.toLocaleString() : String(value ?? '')

// The plot area inside the axes.
export const pad = { top: 8, bottom: 24, right: 8 }

export const yScale = (max, innerH) => scaleLinear().domain([0, max || 1]).nice().range([innerH, 0])

// Room for the longest tick label.
export const leftFor = (ticks, fmt) => Math.max(...ticks.map((tick) => fmt(tick).length), 1) * 7 + 12

// Every nth x label, so they don't collide.
export const labelStep = (count, innerW) => Math.max(1, Math.ceil(count / Math.max(1, Math.floor(innerW / 64))))
