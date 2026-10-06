<!-- What area and bar charts share: the measured frame, the hover tooltip,
     the legend and a table of the data for assistive tech. Internal. -->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './chart.css'

  let {
    rows, x, list, fmt, height, label, hover = $bindable(null), width = $bindable(0), tipLeft = 0, flip = false,
    onmove, classes = {}, class: className = '', children, ...rest
  } = $props()

  const part = partsOf('chart', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)}>
  <div {...part('frame')} style:height="{height}px" bind:clientWidth={width}
    onpointermove={onmove} onpointerleave={() => (hover = null)} role="presentation">
    {#if width}{@render children()}{/if}
    {#if hover != null && rows[hover]}
      <div {...part('tooltip')} data-flip={flip || undefined} style:left="{tipLeft}px">
        <div {...part('tooltip-label')}>{rows[hover][x] ?? ''}</div>
        {#each list as s}
          <div {...part('tooltip-row')}>
            <span {...part('swatch')} style:background={s.color}></span>
            <span {...part('tooltip-name')}>{s.label}</span>
            <span {...part('tooltip-value')}>{fmt(rows[hover][s.key])}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  {#if list.length > 1}
    <div {...part('legend')}>
      {#each list as s}<span {...part('legend-item')}><span {...part('swatch')} style:background={s.color}></span>{s.label}</span>{/each}
    </div>
  {/if}
  <table {...part('sr-only')}>
    <caption>{label}</caption>
    <tbody>
      <tr><th>{x}</th>{#each list as s}<th>{s.label}</th>{/each}</tr>
      {#each rows as row}<tr><td>{row[x] ?? ''}</td>{#each list as s}<td>{fmt(row[s.key])}</td>{/each}</tr>{/each}
    </tbody>
  </table>
</div>
