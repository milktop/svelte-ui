<!-- Groups as child components
  MenuGroup wraps its items under a heading (marked up as a group for screen readers). -->
<script>
  import { Menu, MenuGroup, MenuItem, MenuSeparator, Button } from '@milktop/svelte-ui'

  let selected = $state(null)
</script>

<Menu label="Maths with Ada" onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Lesson</Button>{/snippet}
  <MenuGroup label="Lesson">
    <MenuItem value="reschedule" icon="lucide:calendar-clock">Reschedule</MenuItem>
    <MenuItem value="notes" icon="lucide:notebook-pen">Add notes</MenuItem>
  </MenuGroup>
  <MenuSeparator />
  <MenuGroup label="Student">
    <MenuItem value="message" icon="lucide:message-square">Send message</MenuItem>
    <MenuItem value="profile" icon="lucide:user">View profile</MenuItem>
  </MenuGroup>
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
