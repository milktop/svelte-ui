<!-- Items and child components together
  Child components follow the `items`. A Submenu takes `items` too, and a plain string is both an item's label and its value. -->
<script>
  import { Menu, Submenu, MenuSeparator, Button } from '@milktop/svelte-ui'

  const account = [
    { value: 'profile', label: 'Profile', icon: 'lucide:user' },
    { value: 'settings', label: 'Settings', icon: 'lucide:settings' },
  ]
  let selected = $state(null)
</script>

<Menu items={account} onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Account</Button>{/snippet}
  <MenuSeparator />
  <Submenu label="Theme" icon="lucide:palette" items={['Light', 'Dark', 'System']} />
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
