<!-- A sidebar
  Sections of nav items with badges, and `accordion` groups (opening one closes the other), with the `--ui-sidebar-*` tokens setting the active item's look. (Shown in a box here.) -->
<script>
  import { Sidebar, NavSection, NavGroup, NavItem } from '@milktop/svelte-ui'

  const menu = [
    { name: 'Dashboard', icon: 'lucide:house' },
    { name: 'Students', icon: 'lucide:users', badge: 12 },
    { name: 'Lessons', icon: 'lucide:book-open', badge: 'New' },
  ]

  let current = $state('Dashboard')
</script>

<div class="h-96 overflow-hidden rounded-xl border border-(--ui-border)">
  <Sidebar accordion class="h-full" style="--ui-sidebar-item-height: 2.5rem; --ui-sidebar-active: var(--ui-accent-soft)">
    {#snippet logo()}TutorApp{/snippet}
    <NavSection heading="Menu">
      {#each menu as item}
        <NavItem icon={item.icon} badge={item.badge ?? null} href="#/sidebar" active={current === item.name} onclick={(e) => { e.preventDefault(); current = item.name }}>{item.name}</NavItem>
      {/each}
    </NavSection>
    <NavSection heading="Settings">
      <NavGroup label="Account" icon="lucide:user" open>
        <NavItem href="#/sidebar">Profile</NavItem>
        <NavItem href="#/sidebar">Billing</NavItem>
      </NavGroup>
      <NavGroup label="School" icon="lucide:school">
        <NavItem href="#/sidebar">Terms</NavItem>
        <NavItem href="#/sidebar">Rooms</NavItem>
      </NavGroup>
    </NavSection>
  </Sidebar>
</div>
