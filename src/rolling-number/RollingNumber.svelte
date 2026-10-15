<!--
  A number whose digits roll to their new value when it changes, e.g. a live
  count on a dashboard. Formatted like FormatNumber; still while the system
  asks for reduced motion.

  <RollingNumber value={appointments.length} />
  <RollingNumber value={revenue} format={{ style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }} />

  - `value`: the number
  - `format`: Intl.NumberFormat's options (grouping by default)
  - `duration`: how long a roll takes, in ms (600)
  - `locale`: the app's (uiLocale) by default

  Assistive tech reads the whole number, not the digits.
-->
<script>
  import { formatNumber } from '../format/format.js'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './rolling-number.css'

  let { value = 0, format = {}, duration = 600, locale = undefined, class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('rolling-number', () => classes)
  const text = $derived(formatNumber(value, { ...format, locale }))
  // Keyed from the right, so the ones stay the ones as the number grows.
  const chars = $derived([...text].map((char, i, all) => ({ char, key: all.length - i })))
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
</script>

<span {...rest} {...part('root')} class={cx(className)} role="img" aria-label={text} style:--duration="{duration}ms">
  {#each chars as { char, key } (key)}
    {#if /\d/.test(char)}
      <!-- A column of 0–9, moved so the digit shows. -->
      <span {...part('digit')} aria-hidden="true">
        <span {...part('strip')} style:--digit={Number(char)}>{#each digits as d}<span>{d}</span>{/each}</span>
        <span {...part('sizer')}>0</span>
      </span>
    {:else}
      <span {...part('char')} aria-hidden="true">{char}</span>
    {/if}
  {/each}
</span>
