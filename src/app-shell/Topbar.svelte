<!--
  The app's top bar: content on the left, an `end` snippet on the right.

  <Topbar>
    <Breadcrumbs items={trail} />
    {#snippet end()}<Button icon="lucide:moon" aria-label="Theme" />{/snippet}
  </Topbar>

  - `end` snippet: actions on the right
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './app-shell.css'

  let { end = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('topbar', () => classes)
</script>

<header {...rest} {...part('root')} class={cx(className)}>
  <div {...part('start')}>{@render children?.()}</div>
  {#if end}<div {...part('end')}>{@render end()}</div>{/if}
</header>
