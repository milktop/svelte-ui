<!--
  A headline number with its label, e.g. on a dashboard.

  <Stat label="Lessons this month" value={52} change={12.5} changeLabel="vs September" />

  - `value` (shown as given, so format it first) and an optional `unit`
  - `change`: a number, shown as "+12.5%" with an arrow, green when up and red
    when down; `invert` swaps the colours (for things like cancellations);
    `changeUnit` replaces the '%'
  - `changeLabel`, `help`: muted text after the change, and under it all
  - `icon`: an Iconify name in a tinted square, beside the label
  - `variant`: 'plain' (default) or 'card'
  - `size`: 'sm', 'md' (default) or 'lg'
  - the content goes under it all (a sparkline)

  Group stats in Stats for a responsive grid.
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './stat.css'

  let {
    label = '', value = null, unit = null, change = null, changeUnit = '%', changeLabel = null, invert = false,
    help = null, icon = null, variant = 'plain', size = 'md', class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('stat', () => classes)
  const direction = $derived(change > 0 ? 'up' : change < 0 ? 'down' : 'flat')
  const good = $derived(direction === 'flat' ? null : (direction === 'up') !== !!invert)
  const changeText = $derived(`${change > 0 ? '+' : ''}${change}${changeUnit}`)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-variant={variant} data-size={size}>
  <div {...part('header')}>
    <div {...part('label')}>{label}</div>
    {#if icon}<span {...part('icon')} aria-hidden="true"><iconify-icon {icon}></iconify-icon></span>{/if}
  </div>
  <div {...part('value')}>
    <span>{value ?? ''}</span>
    {#if unit}<span {...part('unit')}>{unit}</span>{/if}
  </div>
  {#if change != null || changeLabel}
    <div {...part('footer')}>
      {#if change != null}
        <span {...part('change')} data-good={good === true || undefined} data-bad={good === false || undefined}
          aria-label="{direction === 'up' ? 'Up' : direction === 'down' ? 'Down' : 'No change'} {changeText}">
          {#if direction !== 'flat'}<iconify-icon icon={direction === 'down' ? 'lucide:trending-down' : 'lucide:trending-up'}></iconify-icon>{/if}
          {changeText}
        </span>
      {/if}
      {#if changeLabel}<span {...part('change-label')}>{changeLabel}</span>{/if}
    </div>
  {/if}
  {#if help}<div {...part('help')}>{help}</div>{/if}
  {@render children?.()}
</div>
