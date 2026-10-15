<!--
  A time relative to now: '2 hours ago', 'in 3 days', 'yesterday', kept up to
  date (in a <time> element, with the full date as its title).

  <FormatRelative value={message.sentAt} />

  - `value`: a Date, an ISO string or a timestamp
  - `numeric`: 'auto' (default, 'yesterday') or 'always' ('1 day ago')
  - `format`: Intl's style: 'long' (default), 'short' or 'narrow'
  - `live`: update every 30 seconds (on by default)
  - `locale`: the app's (uiLocale) by default

  As a function, for strings: formatRelative(date, { numeric, style, locale }).
-->
<script>
  import { formatRelative } from './format.js'
  import { uiLocale } from '../locale.svelte.js'
  import { cx, partsOf } from '../utils.js'

  let { value = null, numeric = 'auto', format = 'long', live = true, locale = undefined, class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('format', () => classes)
  let now = $state(new Date())
  $effect(() => {
    if (!live) return
    const timer = setInterval(() => (now = new Date()), 30000)
    return () => clearInterval(timer)
  })
  const when = $derived(value == null ? null : value instanceof Date ? value : new Date(value))
  const valid = $derived(when && !Number.isNaN(when.getTime()))
</script>

<time {...rest} {...part('relative')} class={cx(className)} datetime={valid ? when.toISOString() : undefined}
  title={valid ? when.toLocaleString(locale ?? uiLocale.locale) : undefined}>{formatRelative(when, { locale, now, numeric, style: format })}</time>
