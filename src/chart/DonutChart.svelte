<!--
  Parts of a whole as a ring (or a pie), with the total (or your content) in
  the middle, a legend, and the value on hover.

  <DonutChart data={[{ label: 'Consults', value: 42 }, { label: 'Surgery', value: 9 }]} />
  <DonutChart data={byKind} label="Appointments by kind" format={(v) => `${v}`} />

  - `data`: `{ label, value, color }` (colours from the theme's
    --ui-chart-1…5 by default, or 'accent', 'success', 'danger', any CSS colour)
  - `size` (160 px), `thickness` (a share of the radius, 0.32; 1 for a pie)
  - `center` snippet: what the middle shows (the total by default); `center={null}` for nothing
  - `legend`: beside it ('right', default), 'bottom' or false
  - `format(value)`, for the total, legend and tooltip
  - `label`: what it shows, for assistive tech (a hidden table of the data)
-->
<script>
  import { arc, pie } from 'd3-shape'
  import { seriesColor, formatter } from './chart.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './chart.css'

  let {
    data = [], size = 160, thickness = 0.32, center = undefined, legend = 'right', format = null, label = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('donut', () => classes)
  let hover = $state(null)
  const fmt = $derived(formatter(format))
  const total = $derived(data.reduce((sum, slice) => sum + Math.max(0, slice.value), 0))
  const radius = $derived(size / 2)
  const inner = $derived(thickness >= 1 ? 0 : radius * (1 - thickness))
  const slices = $derived(pie().value((d) => Math.max(0, d.value)).sort(null).padAngle(data.length > 1 && inner > 0 ? 0.012 : 0)(data))
  const shape = $derived(arc().innerRadius(inner).outerRadius(radius).cornerRadius(inner > 0 ? 2 : 0))
  const grown = $derived(arc().innerRadius(inner).outerRadius(radius + 4).cornerRadius(inner > 0 ? 2 : 0))
  const shown = $derived(hover != null ? data[hover] : null)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-legend={legend || undefined}>
  <div {...part('frame')} style:width="{size}px" style:height="{size}px">
    <svg {...part('svg')} width={size} height={size} viewBox="{-radius - 4} {-radius - 4} {size + 8} {size + 8}" aria-hidden="true">
      {#each slices as s, i (data[i].label)}
        <path {...part('slice')} d={(hover === i ? grown : shape)(s) ?? ''} fill={seriesColor(data[i].color, i)}
          data-dim={(hover != null && hover !== i) || undefined}
          onpointerenter={() => (hover = i)} onpointerleave={() => (hover = null)} />
      {/each}
    </svg>
    <!-- The middle: the hovered slice, or the total (or your content). -->
    {#if inner > 0 && center !== null}
      <div {...part('center')}>
        {#if shown}<strong>{fmt(shown.value)}</strong><span>{shown.label}</span>
        {:else if center}{@render center()}
        {:else}<strong>{fmt(total)}</strong><span>{uiLocale.messages.chart.total}</span>{/if}
      </div>
    {/if}
  </div>
  {#if legend}
    <ul {...part('legend')}>
      {#each data as slice, i (slice.label)}
        <li {...part('legend-item')} data-dim={(hover != null && hover !== i) || undefined}
          onpointerenter={() => (hover = i)} onpointerleave={() => (hover = null)}>
          <span {...part('swatch')} style:background={seriesColor(slice.color, i)}></span>
          <span {...part('legend-label')}>{slice.label}</span>
          <span {...part('legend-value')}>{fmt(slice.value)}{#if total > 0}<small> {Math.round((slice.value / total) * 100)}%</small>{/if}</span>
        </li>
      {/each}
    </ul>
  {/if}
  <table {...part('sr-only')}>
    <caption>{label ?? uiLocale.messages.chart.label}</caption>
    <tbody>{#each data as slice}<tr><td>{slice.label}</td><td>{fmt(slice.value)}</td></tr>{/each}</tbody>
  </table>
</div>
