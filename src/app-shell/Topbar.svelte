<!--
  The app's top bar: content on the left, an `end` snippet on the right. In
  an AppShell on a phone it starts with a button opening the sidebar drawer.

  <Topbar>
    <Breadcrumbs items={trail} />
    {#snippet end()}<Button icon="lucide:moon" aria-label="Theme" />{/snippet}
  </Topbar>

  - `end` snippet: actions on the right
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf, useShell } from '../utils.js'
  import '../theme.css'
  import './app-shell.css'

  let { end = null, class: className = '', classes = {}, children, ...rest } = $props()

  const shell = useShell()
  const part = partsOf('topbar', () => classes)
</script>

<header {...rest} {...part('root')} class={cx(className)}>
  {#if shell?.mobile}
    <button {...part('menu')} type="button" aria-label="Open menu" aria-expanded={shell.drawerOpen} onclick={shell.toggle}>
      <iconify-icon icon="lucide:menu" aria-hidden="true"></iconify-icon>
    </button>
  {/if}
  <div {...part('start')}>{@render children?.()}</div>
  {#if end}<div {...part('end')}>{@render end()}</div>{/if}
</header>
