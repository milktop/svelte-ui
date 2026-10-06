<!--
  An app sidebar: a logo, the nav, and a footer. In an AppShell it collapses
  to an icon rail (its button, or ⌘B) and becomes a drawer on phones.

  <Sidebar>
    {#snippet logo()}TutorApp{/snippet}
    <NavSection heading="Menu">
      <NavItem icon="lucide:house" href="/" active>Dashboard</NavItem>
    </NavSection>
  </Sidebar>

  - `logo` snippet; `logoCollapsed` snippet: shown instead in the rail (a mark)
  - `footer` snippet
  - `accordion`: one NavGroup open at a time
  - restyle its items with the `--ui-sidebar-*` tokens, e.g.
    style="--ui-sidebar-active: var(--ui-accent-soft)"
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf, useShell, provideSidebar } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let {
    logo = null, logoCollapsed = null, footer = null, accordion = false,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const shell = useShell()
  const part = partsOf('sidebar', () => classes)
  const rail = $derived(!!shell?.rail)

  // The open accordion group, by id.
  let openGroup = $state(null)
  provideSidebar({
    get accordion() { return accordion },
    get openGroup() { return openGroup },
    set openGroup(id) { openGroup = id },
  })
</script>

<aside {...rest} {...part('root')} class={cx(className)} data-rail={rail || undefined}
  data-mobile={shell?.mobile || undefined} data-open={shell?.drawerOpen || undefined}>
  {#if logo || shell}
    <div {...part('header')}>
      {#if rail}
        {#if logoCollapsed}<div {...part('logo')}>{@render logoCollapsed()}</div>{/if}
      {:else}
        {#if logo}<div {...part('logo')}>{@render logo()}</div>{/if}
        {#if shell}
          <button {...part('toggle')} type="button" onclick={shell.toggle}
            aria-label={shell.mobile ? 'Close menu' : 'Collapse sidebar'} title={shell.mobile ? undefined : 'Collapse sidebar (⌘B)'}>
            <iconify-icon icon={shell.mobile ? 'lucide:x' : 'lucide:panel-left-close'} aria-hidden="true"></iconify-icon>
          </button>
        {/if}
      {/if}
    </div>
  {/if}
  <nav {...part('nav')}>{@render children?.()}</nav>
  {#if footer || rail}
    <div {...part('footer')}>
      {#if footer}{@render footer()}{/if}
      {#if rail}
        <button {...part('toggle')} type="button" onclick={shell.toggle} aria-label="Expand sidebar" title="Expand sidebar (⌘B)">
          <iconify-icon icon="lucide:panel-left-open" aria-hidden="true"></iconify-icon>
        </button>
      {/if}
    </div>
  {/if}
</aside>
