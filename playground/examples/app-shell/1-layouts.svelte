<!-- Flat and inset
  The same shell both ways: flat (white sidebar and top bar, bordered) and `inset` (the page a rounded panel on a frame, a grey sidebar with white items). Shown in boxes here; normally it fills the window. -->
<script>
  import { AppShell, Sidebar, NavSection, NavItem, Topbar, Breadcrumbs, Page, Button } from '@milktop/svelte-ui'
</script>

{#each [false, true] as inset}
  <div class="h-72 w-full overflow-hidden rounded-xl border border-(--ui-border) sm:w-[calc(50%-0.375rem)]">
    <AppShell {inset} shortcut={false} breakpoint={0} class="h-full min-h-0 [--ui-sidebar-width:9rem]">
      <Sidebar class="h-full">
        {#snippet logo()}TutorApp{/snippet}
        <NavSection>
          <NavItem icon="lucide:house" href="#/app-shell" active>Dashboard</NavItem>
          <NavItem icon="lucide:users" href="#/app-shell">Students</NavItem>
        </NavSection>
      </Sidebar>
      <Topbar>
        <Breadcrumbs items={[{ label: 'Home', href: '#/app-shell' }, { label: 'Dashboard' }]} />
        {#snippet end()}<Button size="sm" round icon="lucide:bell" count={2} aria-label="Notifications" />{/snippet}
      </Topbar>
      <Page heading={inset ? 'Inset' : 'Flat'} class="text-sm">The page.</Page>
    </AppShell>
  </div>
{/each}
