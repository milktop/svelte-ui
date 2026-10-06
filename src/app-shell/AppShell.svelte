<!--
  An app layout: the sidebar down the left, the top bar and page beside it.
  Put a Sidebar, a Topbar and a Page inside; each takes its place.

  <AppShell inset>
    <Sidebar>…</Sidebar>
    <Topbar>…</Topbar>
    <Page>…</Page>
  </AppShell>

  - `inset`: the page as a rounded panel on a frame, with a grey sidebar
    whose hovered and current items go white (the `--ui-sidebar-inset-*` tokens)
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './app-shell.css'

  let { inset = false, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('app-shell', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-inset={inset || undefined}>
  {@render children?.()}
</div>
