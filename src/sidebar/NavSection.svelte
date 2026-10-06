<!--
  A group of nav items, with an optional heading.

  - `heading`
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { heading = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('nav-section', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)}>
  {#if heading}<div {...part('heading')}>{heading}</div>{/if}
  {@render children?.()}
</div>
