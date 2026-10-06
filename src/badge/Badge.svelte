<!--
  A short label, like a status or a count.

  <Badge variant="success" dot>Paid</Badge>

  - `variant`: 'neutral' (default), 'accent', 'success', 'warning', 'danger' or 'outline'
  - `size`: 'sm' or 'md'
  - `icon`: an Iconify name before the text; `dot`: a coloured dot instead
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './badge.css'

  let { variant = 'neutral', size = 'md', icon = null, dot = false, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('badge', () => classes)
</script>

<span {...rest} {...part('root')} class={cx(className)} data-variant={variant} data-size={size}>
  {#if dot}<span {...part('dot')} aria-hidden="true"></span>
  {:else if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
  {@render children?.()}
</span>
