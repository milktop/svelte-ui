<!--
  A filled line chart, drawn to its width, with a tooltip on hover.

  <AreaChart data={months} x="month" y="revenue" format={(v) => `£${v}`} />
  <AreaChart data={months} x="month" series={[{ key: 'maths', label: 'Maths' }, { key: 'english', label: 'English' }]} />

  - `data`: rows of objects; `x` names the label property ('label')
  - `y`: the value property, or `series` for several, each `{ key, label, color }`
    (colours from the theme's --ui-chart-1…5 by default)
  - `curve`: 'smooth' (default) or 'linear'; `stacked`: series sit on top of one another
  - `height` (240 px), `format(value)` for ticks and tooltips, `grid` (lines; true)
  - `label`: what it shows, for assistive tech (a hidden table of the data)
-->
<script>
  import { scalePoint } from 'd3-scale'
  import { area, line, curveMonotoneX, curveLinear } from 'd3-shape'
  import ChartFrame from './ChartFrame.svelte'
  import { seriesOf, formatter, pad, yScale, leftFor, labelStep } from './chart.js'
  import { partsOf } from '../utils.js'

  let {
    data = [], x = 'label', y = null, series = null, height = 240, format = null, label = 'Chart', grid = true,
    curve = 'smooth', stacked = false, classes = {}, ...rest
  } = $props()

  const part = partsOf('chart', () => classes)
  const id = $props.id()
  let hover = $state(null)
  let width = $state(0)

  const rows = $derived(data ?? [])
  const list = $derived(seriesOf(series, y))
  const fmt = $derived(formatter(format))
  const innerH = $derived(Math.max(0, height - pad.top - pad.bottom))

  // Each series' [low, high] per row: from 0, or stacked on the ones before.
  const bands = $derived.by(() => {
    const base = rows.map(() => 0)
    return list.map((s) => rows.map((row, i) => {
      const value = +row[s.key] || 0
      const low = stacked ? base[i] : 0
      if (stacked) base[i] = low + value
      return [low, low + value]
    }))
  })

  const ys = $derived(yScale(Math.max(0, ...bands.flatMap((b) => b.map((v) => v[1]))), innerH))
  const ticks = $derived(ys.ticks(4))
  const left = $derived(leftFor(ticks, fmt))
  const innerW = $derived(Math.max(0, width - left - pad.right))
  const xs = $derived(scalePoint().domain(rows.map((_, i) => i)).range([0, innerW]))
  const shape = $derived(curve === 'linear' ? curveLinear : curveMonotoneX)
  const fill = $derived(area().x((_, i) => xs(i)).y0((d) => ys(d[0])).y1((d) => ys(d[1])).curve(shape))
  const stroke = $derived(line().x((_, i) => xs(i)).y((d) => ys(d[1])).curve(shape))
  const step = $derived(labelStep(rows.length, innerW))

  function move(e) {
    if (!rows.length) return
    const at = e.clientX - e.currentTarget.getBoundingClientRect().left - left
    const gap = rows.length > 1 ? innerW / (rows.length - 1) : 0
    hover = Math.max(0, Math.min(rows.length - 1, gap ? Math.round(at / gap) : 0))
  }
</script>

<ChartFrame {...rest} {rows} {x} {list} {fmt} {height} {label} {classes} bind:hover bind:width onmove={move}
  tipLeft={hover == null ? 0 : left + xs(hover)} flip={hover != null && xs(hover) > innerW * 0.6}>
  <svg {...part('svg')} {width} {height} aria-hidden="true">
    <defs>
      {#each list as s, i}
        <linearGradient id="{id}-{i}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color={s.color} stop-opacity="0.28" />
          <stop offset="100%" stop-color={s.color} stop-opacity="0.02" />
        </linearGradient>
      {/each}
    </defs>
    <g transform="translate({left},{pad.top})">
      {#each ticks as tick}
        {#if grid}<line {...part('grid')} x1="0" x2={innerW} y1={ys(tick)} y2={ys(tick)} />{/if}
        <text {...part('tick')} x="-8" y={ys(tick)} dy="0.32em" text-anchor="end">{fmt(tick)}</text>
      {/each}
      {#each rows as row, i}
        {#if i % step === 0}
          <text {...part('tick')} x={xs(i)} y={innerH + 18} text-anchor={i === 0 ? 'start' : i === rows.length - 1 ? 'end' : 'middle'}>{row[x] ?? ''}</text>
        {/if}
      {/each}
      {#each list as s, i}
        <path {...part('area')} d={fill(bands[i])} fill="url(#{id}-{i})" />
        <path {...part('line')} d={stroke(bands[i])} stroke={s.color} />
      {/each}
      {#if hover != null}
        <line {...part('cursor')} x1={xs(hover)} x2={xs(hover)} y1="0" y2={innerH} />
        {#each list as s, i}<circle {...part('dot')} cx={xs(hover)} cy={ys(bands[i][hover][1])} r="4" fill={s.color} />{/each}
      {/if}
    </g>
  </svg>
</ChartFrame>
