<!--
  An app sidebar: a logo, the nav, and a footer.

  <Sidebar>
    {#snippet logo()}TutorApp{/snippet}
    <NavSection heading="Menu">
      <NavItem icon="lucide:house" href="/" active>Dashboard</NavItem>
    </NavSection>
  </Sidebar>

  - `logo`, `footer` snippets
  - restyle its items with the `--ui-sidebar-*` tokens, e.g.
    style="--ui-sidebar-active: var(--ui-accent-soft)"
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { logo = null, footer = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('sidebar', () => classes)
</script>

<aside {...rest} {...part('root')} class={cx(className)}>
  {#if logo}<div {...part('header')}>{@render logo()}</div>{/if}
  <nav {...part('nav')}>{@render children?.()}</nav>
  {#if footer}<div {...part('footer')}>{@render footer()}</div>{/if}
</aside>
