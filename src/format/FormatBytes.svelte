<!--
  A size in bytes for people: '512 bytes', '624 KB', '2.4 MB' (in a <data>
  element, which keeps the raw value).

  <FormatBytes value={file.size} />

  - `value`: the size in bytes
  - `binary`: KiB, MiB… (powers of 1024) instead of KB, MB
  - `maximumFractionDigits`: 1 by default
  - `locale`: the app's (uiLocale) by default

  As a function, for strings: formatBytes(bytes, { binary, locale }).
-->
<script>
  import { formatBytes } from './format.js'
  import { cx, partsOf } from '../utils.js'

  let { value = null, binary = false, maximumFractionDigits = 1, locale = undefined, class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('format', () => classes)
</script>

<data {...rest} {...part('bytes')} class={cx(className)} value={value == null ? '' : String(value)}>{formatBytes(value, { locale, binary, maximumFractionDigits })}</data>
