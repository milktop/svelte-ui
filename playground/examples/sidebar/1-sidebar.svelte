<!-- A sidebar
  Sections of nav items, with the `--ui-sidebar-*` tokens setting the active item's look. (Shown in a box here.) -->
<script>
  import { Sidebar, NavSection, NavItem } from '@milktop/svelte-ui'

  const menu = [
    { name: 'Dashboard', icon: 'lucide:house' },
    { name: 'Students', icon: 'lucide:users' },
    { name: 'Lessons', icon: 'lucide:book-open' },
  ]

  let current = $state('Dashboard')
</script>

<div class="h-80 overflow-hidden rounded-xl border border-(--ui-border)">
  <Sidebar class="h-full" style="--ui-sidebar-item-height: 2.5rem; --ui-sidebar-active: var(--ui-accent-soft)">
    {#snippet logo()}TutorApp{/snippet}
    <NavSection heading="Menu">
      {#each menu as item}
        <NavItem icon={item.icon} href="#/sidebar" active={current === item.name} onclick={(e) => { e.preventDefault(); current = item.name }}>{item.name}</NavItem>
      {/each}
    </NavSection>
    <NavSection heading="Settings">
      <NavItem icon="lucide:user" href="#/sidebar">Profile</NavItem>
    </NavSection>
  </Sidebar>
</div>
