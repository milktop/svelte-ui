<!-- The app: the teal sidebar, the top bar and the page, made of svelte-ui.
     Tokens set the app's colours and type; Tailwind classes on the parts
     (`classes`) set its measurements. -->
<script>
  import { AppShell, Sidebar, NavSection, NavItem, Topbar, Page, Tooltip } from '@milktop/svelte-ui'
  import AppIconButton from './AppIconButton.svelte'

  let { clinic = '', nav = [], shortcuts = [], topbarEnd = null, children } = $props()
  let collapsed = $state(false)
</script>

<div class="app">
  <AppShell bind:collapsed persist="app:sidebar">
    <Sidebar label="Navigation" class="border-r-0" classes={{
      header: 'h-[57px] px-6 justify-start bg-white border-b border-gray-200 shadow-xs [[data-rail]_&]:px-0 [[data-rail]_&]:justify-center',
      toggle: 'hidden',
      nav: 'px-0 pt-4 gap-6',
      footer: 'px-4 pt-2 pb-4 border-t border-teal-600/50',
    }}>
      {#snippet logo()}
        <span class="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-700"><iconify-icon icon="lucide:hospital"></iconify-icon>{clinic}</span>
      {/snippet}
      {#snippet logoCollapsed()}<iconify-icon icon="lucide:hospital" class="text-gray-700"></iconify-icon>{/snippet}
      {#each nav as section}
        <NavSection heading={section.heading} classes={{ 'heading-row': 'h-auto mb-1', heading: 'px-8 text-xs font-normal' }}>
          {#each section.items as item}
            <NavItem icon={item.icon} href="#/demo/consultation" active={!!item.active}
              classes={{ link: 'text-[0.8rem] font-light gap-2', icon: 'size-3 text-[12px]' }}>{item.label}</NavItem>
          {/each}
        </NavSection>
      {/each}
      {#snippet footer()}
        <Tooltip content="Ouvrir la navigation (Ctrl+B)" placement="right" disabled={!collapsed}>
          {#snippet trigger(props)}
            <button {...props} type="button" onclick={(e) => { props.onclick?.(e); collapsed = !collapsed }}
              class="flex w-full cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent px-4 py-1.5 text-[0.8rem] font-light text-teal-100 hover:bg-teal-600/70 [[data-rail]_&]:mx-auto [[data-rail]_&]:size-8 [[data-rail]_&]:justify-center [[data-rail]_&]:px-0">
              <iconify-icon icon={collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'}></iconify-icon>
              {#if !collapsed}Réduire{/if}
            </button>
          {/snippet}
        </Tooltip>
      {/snippet}
    </Sidebar>

    <Topbar class="h-[57px] border-b border-gray-200 px-6 shadow-xs lg:pr-10">
      <div class="hidden items-center gap-3 lg:flex">
        {#each shortcuts as shortcut}
          <Tooltip content={shortcut.label} placement="bottom">
            {#snippet trigger(props)}<AppIconButton {...props} icon={shortcut.icon} aria-label={shortcut.label} />{/snippet}
          </Tooltip>
        {/each}
      </div>
      {#snippet end()}{@render topbarEnd?.()}{/snippet}
    </Topbar>

    <!-- The page: white, padded 24px (40px on wide screens). -->
    <Page width="full" class="bg-white p-6 lg:p-10">{@render children?.()}</Page>
  </AppShell>
</div>

<style>
  /* The app's colours and type, for everything inside. */
  .app {
    --ui-font: 'Inter Variable', sans-serif;
    font-family: var(--ui-font);
    --ui-accent: var(--color-teal-500); --ui-accent-text: white;
    --ui-accent-soft: #d5f5f1; --ui-accent-soft-text: var(--color-teal-700);
    --ui-ring: var(--color-teal-500); --ui-ring-soft: color-mix(in srgb, var(--color-teal-500) 25%, transparent);
    --ui-text: var(--color-gray-800); --ui-muted: var(--color-gray-500); --ui-border: var(--color-gray-200);
    --ui-canvas: white; --ui-radius: 4px;
    /* The sidebar: teal, 13rem, light items without rounding. */
    --ui-sidebar-width: 13rem; --ui-sidebar-rail-width: 3rem;
    --ui-sidebar-surface: var(--color-teal-500); --ui-sidebar-heading: var(--color-teal-200); --ui-sidebar-icon: var(--color-teal-100);
    --ui-sidebar-item-text: var(--color-teal-100); --ui-sidebar-hover-text: white;
    --ui-sidebar-hover: color-mix(in srgb, var(--color-teal-600) 70%, transparent);
    --ui-sidebar-active: color-mix(in srgb, var(--color-teal-600) 70%, transparent);
    --ui-sidebar-active-text: white; --ui-sidebar-active-weight: 400;
    --ui-sidebar-item-height: auto; --ui-sidebar-item-padding: 0.3rem 0.5rem 0.3rem 2rem; --ui-sidebar-item-radius: 0;
  }
</style>
