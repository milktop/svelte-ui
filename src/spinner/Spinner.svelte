<!--
  A spinner, for short waits.

  <Spinner size="sm" />

  - `label`: announced to assistive tech ('Loading')
  - `size`: 'sm', 'md' (default) or 'lg'
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './spinner.css'

  let { label = null, size = 'md', class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('spinner', () => classes)
</script>

<span {...rest} {...part('root')} class={cx(className)} data-size={size} role="status" aria-label={label ?? uiLocale.messages.spinner.label}></span>
