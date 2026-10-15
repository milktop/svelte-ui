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
  - `items`: the nav as data, in place of (or before) the content:
    `[{ heading, items: [{ label, icon, href, active, badge, items }] }]`
  - `edge`: a thin strip along the right edge that collapses or expands it
    on click: 'rail' (default) shows it only while collapsed, true always,
    false never
  - `label`: the nav's accessible name ('Main')
  - restyle its items with the `--ui-sidebar-*` tokens, e.g.
    style="--ui-sidebar-active: var(--ui-accent-soft)"
-->
<script>
  import '../icons.js'
  import Tooltip from '../tooltip/Tooltip.svelte'
  import NavSection from './NavSection.svelte'
  import NavGroup from './NavGroup.svelte'
  import NavItem from './NavItem.svelte'
  import { cx, partsOf, useShell, provideSidebar } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './sidebar.css'

  let {
    logo = null, logoCollapsed = null, footer = null, accordion = false, items = null, edge = 'rail', label = null,
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
        {#if shell?.mobile}
          <button {...part('toggle')} type="button" onclick={shell.toggle} aria-label={uiLocale.messages.shell.closeMenu}>
            <iconify-icon icon="lucide:x" aria-hidden="true"></iconify-icon>
          </button>
        {:else if shell}
          <Tooltip content="{uiLocale.messages.shell.collapseSidebar} (⌘B)" placement="right">
            {#snippet trigger(props)}
              <button {...props} {...part('toggle')} type="button" onclick={(e) => { props.onclick?.(e); shell.toggle() }} aria-label={uiLocale.messages.shell.collapseSidebar}>
                <iconify-icon icon="lucide:panel-left-close" aria-hidden="true"></iconify-icon>
              </button>
            {/snippet}
          </Tooltip>
        {/if}
      {/if}
    </div>
  {/if}
  <nav {...part('nav')} aria-label={label ?? uiLocale.messages.shell.nav}>
    {#each items ?? [] as section}
      <NavSection heading={section.heading}>
        {#each section.items ?? [] as item}
          {#if item.items}
            <NavGroup label={item.label} icon={item.icon} open={item.items.some((child) => child.active)}>
              {#each item.items as child}<NavItem href={child.href} icon={child.icon} active={child.active} badge={child.badge ?? null} label={child.label} />{/each}
            </NavGroup>
          {:else}
            <NavItem href={item.href} icon={item.icon} active={item.active} badge={item.badge ?? null} label={item.label} />
          {/if}
        {/each}
      </NavSection>
    {/each}
    {@render children?.()}
  </nav>
  {#if footer || rail}
    <div {...part('footer')}>
      {#if footer}{@render footer()}{/if}
      {#if rail}
        <Tooltip content="{uiLocale.messages.shell.expandSidebar} (⌘B)" placement="right">
          {#snippet trigger(props)}
            <button {...props} {...part('toggle')} type="button" onclick={(e) => { props.onclick?.(e); shell.toggle() }} aria-label={uiLocale.messages.shell.expandSidebar}>
              <iconify-icon icon="lucide:panel-left-open" aria-hidden="true"></iconify-icon>
            </button>
          {/snippet}
        </Tooltip>
      {/if}
    </div>
  {/if}
  <!-- Mouse only: keyboard users have the buttons above and ⌘B. It never
       takes focus (mousedown is prevented), so no focus ring is left behind. -->
  {#if shell && !shell.mobile && (edge === 'rail' ? rail : edge)}
    <button {...part('edge')} type="button" tabindex="-1" aria-hidden="true" title={rail ? uiLocale.messages.shell.expandSidebar : uiLocale.messages.shell.collapseSidebar}
      onmousedown={(e) => e.preventDefault()} onclick={shell.toggle}></button>
  {/if}
</aside>
