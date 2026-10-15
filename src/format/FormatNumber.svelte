<!--
  Formats a number for people (in a <data> element, which keeps the raw
  value): currency, percent, units, compact.

  <FormatNumber value={1820} format={{ style: 'currency', currency: 'GBP' }} />
  <FormatNumber value={0.125} format={{ style: 'percent' }} />
  <FormatNumber value={12400} format={{ notation: 'compact' }} />

  - `value`: the number
  - `format`: Intl.NumberFormat's options (`style`, `currency`, `unit`,
    `notation`, `maximumFractionDigits`, `signDisplay`…)
  - `locale`: the app's (uiLocale) by default

  Also FormatBytes and FormatRelative; as functions, for strings:
  formatNumber, formatBytes and formatRelative.
-->
<script>
  import { formatNumber } from './format.js'
  import { cx, partsOf } from '../utils.js'

  let { value = null, format = null, locale = undefined, class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('format', () => classes)
</script>

<data {...rest} {...part('number')} class={cx(className)} value={value == null ? '' : String(value)}>{formatNumber(value, { ...format, locale })}</data>
