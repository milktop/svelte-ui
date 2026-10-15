<!--
  A headline number with its label, e.g. on a dashboard.

  <Stat label="Lessons this month" value={52} change={12.5} changeLabel="vs September" />

  - `value` and an optional `unit`: text is shown as given; a number is
    formatted (grouped digits, the app's locale), with `format` (Intl's
    options: `{ style: 'currency', currency: 'GBP' }`)
  - `animate`: a number's digits roll to a new value when it changes (RollingNumber)
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
  import '../icons.js'
  import RollingNumber from '../rolling-number/RollingNumber.svelte'
  import { formatNumber } from '../format/format.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './stat.css'

  let {
    label = '', value = null, format = {}, animate = false, unit = null, change = null, changeUnit = '%', changeLabel = null, invert = false,
    help = null, icon = null, variant = 'plain', size = 'md', class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('stat', () => classes)
  const direction = $derived(change == null || change === 0 ? 'flat' : change > 0 ? 'up' : 'down')
  const good = $derived(direction === 'flat' ? null : (direction === 'up') !== !!invert)
  const changeText = $derived(`${change > 0 ? '+' : ''}${change == null ? '' : formatNumber(change, { maximumFractionDigits: 2 })}${changeUnit}`)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-variant={variant} data-size={size}>
  <div {...part('header')}>
    <div {...part('label')}>{label}</div>
    {#if icon}<span {...part('icon')} aria-hidden="true"><iconify-icon {icon}></iconify-icon></span>{/if}
  </div>
  <div {...part('value')}>
    <span>{#if typeof value === 'number'}{#if animate}<RollingNumber {value} {format} />{:else}{formatNumber(value, format)}{/if}{:else}{value ?? ''}{/if}</span>
    {#if unit}<span {...part('unit')}>{unit}</span>{/if}
  </div>
  {#if change != null || changeLabel}
    <div {...part('footer')}>
      {#if change != null}
        <span {...part('change')} data-good={good === true || undefined} data-bad={good === false || undefined}
          aria-label="{uiLocale.messages.stat[direction === 'up' || direction === 'down' ? direction : 'same']} {changeText}">
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
