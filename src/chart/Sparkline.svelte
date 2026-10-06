<!--
  A tiny chart without axes, for a trend beside a number or in a table cell.

  <Sparkline data={[3, 5, 4, 8, 6, 9]} />
  <Sparkline data={months} y="revenue" variant="area" color="success" />

  - `data`: numbers (or objects, with `y` naming the value)
  - `variant`: 'line' (default), 'area' or 'bar'
  - `color`, `height` (px, 32; it fills its width)
  - `label`: what it shows, for assistive tech
-->
<script>
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { area, line, curveMonotoneX } from 'd3-shape'
  import { seriesColor } from './chart.js'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './chart.css'

  let { data = [], y = null, variant = 'line', color = null, height = 32, label = null, class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('sparkline', () => classes)
  const id = $props.id()

  // Drawn in a 100-wide box stretched to fit; strokes keep their width.
  const values = $derived((data ?? []).map((d) => +(y ? d[y] : d) || 0))
  const max = $derived(Math.max(...values, 0))
  const min = $derived(variant === 'bar' ? 0 : Math.min(...values, max))
  const ys = $derived(scaleLinear().domain([min, max === min ? min + 1 : max]).range([height - 2, 2]))
  const xs = $derived(scaleLinear().domain([0, Math.max(1, values.length - 1)]).range([1, 99]))
  const colour = $derived(seriesColor(color, 0))
  const path = $derived(line().x((_, i) => xs(i)).y((v) => ys(v)).curve(curveMonotoneX))
  const fill = $derived(area().x((_, i) => xs(i)).y0(height).y1((v) => ys(v)).curve(curveMonotoneX))
  const band = $derived(scaleBand().domain(values.map((_, i) => i)).range([0, 100]).padding(0.25))
</script>

<div {...rest} {...part('root')} class={cx(className)} role="img" aria-label={label ?? `Trend: ${values.join(', ')}`} style:height="{height}px">
  <svg {...part('svg')} viewBox="0 0 100 {height}" preserveAspectRatio="none" aria-hidden="true">
    {#if variant === 'bar'}
      {#each values as value, i}<rect x={band(i)} y={ys(value)} width={band.bandwidth()} height={Math.max(0, height - ys(value))} fill={colour} rx="0.5" />{/each}
    {:else}
      {#if variant === 'area'}
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color={colour} stop-opacity="0.3" />
            <stop offset="100%" stop-color={colour} stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d={fill(values)} fill="url(#{id})" />
      {/if}
      <path {...part('line')} d={path(values)} fill="none" stroke={colour} />
    {/if}
  </svg>
</div>
