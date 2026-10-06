<!--
  Vertical bars, one per row (or a group per row for several series), drawn
  to its width, with a tooltip on hover.

  <BarChart data={weeks} x="week" y="lessons" />
  <BarChart data={months} x="month" series={subjects} stacked />

  - `data`, `x`, `y`, `series`, `height`, `format`, `grid`, `label`: as for AreaChart
  - `stacked`: series sit on top of one another instead of side by side
-->
<script>
  import { scaleBand } from 'd3-scale'
  import ChartFrame from './ChartFrame.svelte'
  import { seriesOf, formatter, pad, yScale, leftFor, labelStep } from './chart.js'
  import { partsOf } from '../utils.js'

  let {
    data = [], x = 'label', y = null, series = null, height = 240, format = null, label = 'Chart', grid = true,
    stacked = false, classes = {}, ...rest
  } = $props()

  const part = partsOf('chart', () => classes)
  let hover = $state(null)
  let width = $state(0)

  const rows = $derived(data ?? [])
  const list = $derived(seriesOf(series, y))
  const fmt = $derived(formatter(format))
  const innerH = $derived(Math.max(0, height - pad.top - pad.bottom))
  const sum = (row) => list.reduce((total, s) => total + (+row[s.key] || 0), 0)
  const max = $derived(Math.max(0, ...rows.map((row) => (stacked ? sum(row) : Math.max(0, ...list.map((s) => +row[s.key] || 0))))))
  const ys = $derived(yScale(max, innerH))
  const ticks = $derived(ys.ticks(4))
  const left = $derived(leftFor(ticks, fmt))
  const innerW = $derived(Math.max(0, width - left - pad.right))
  const xs = $derived(scaleBand().domain(rows.map((_, i) => i)).range([0, innerW]).padding(0.3))
  const inner = $derived(scaleBand().domain(list.map((s) => s.key)).range([0, xs.bandwidth()]).padding(0.12))
  const step = $derived(labelStep(rows.length, innerW))

  // Each bar's box: side by side, or stacked.
  const bars = $derived(rows.map((row, i) => {
    let base = 0
    return list.map((s) => {
      const value = +row[s.key] || 0
      const low = stacked ? base : 0
      if (stacked) base += value
      return {
        x: stacked ? xs(i) : xs(i) + inner(s.key), y: ys(low + value), color: s.color,
        w: stacked ? xs.bandwidth() : inner.bandwidth(), h: Math.max(0, ys(low) - ys(low + value)),
      }
    })
  }))

  function move(e) {
    if (!rows.length) return
    const at = e.clientX - e.currentTarget.getBoundingClientRect().left - left
    hover = Math.max(0, Math.min(rows.length - 1, Math.floor(at / (innerW / rows.length))))
  }

  const flip = $derived(hover != null && xs(hover) > innerW * 0.6)
</script>

<ChartFrame {...rest} {rows} {x} {list} {fmt} {height} {label} {classes} bind:hover bind:width onmove={move}
  tipLeft={hover == null ? 0 : left + xs(hover) + (flip ? 0 : xs.bandwidth())} {flip}>
  <svg {...part('svg')} {width} {height} aria-hidden="true">
    <g transform="translate({left},{pad.top})">
      {#each ticks as tick}
        {#if grid}<line {...part('grid')} x1="0" x2={innerW} y1={ys(tick)} y2={ys(tick)} />{/if}
        <text {...part('tick')} x="-8" y={ys(tick)} dy="0.32em" text-anchor="end">{fmt(tick)}</text>
      {/each}
      {#if hover != null}
        <rect {...part('band')} x={xs(hover) - (xs.step() * xs.paddingInner()) / 2} y="0" width={xs.step()} height={innerH} />
      {/if}
      {#each rows as row, i}
        {#if i % step === 0}
          <text {...part('tick')} x={xs(i) + xs.bandwidth() / 2} y={innerH + 18} text-anchor="middle">{row[x] ?? ''}</text>
        {/if}
        {#each bars[i] as bar}
          <rect {...part('bar')} x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx={stacked ? 0 : 3} fill={bar.color}
            data-dim={(hover != null && hover !== i) || undefined} />
        {/each}
      {/each}
    </g>
  </svg>
</ChartFrame>
