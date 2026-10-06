<!-- Label and sections
  `label` sits above the items. For sections, add `{ group: "Label" }` items (and `{ separator: true }` lines) between them. -->
<script>
  import { Menu, Button } from '@milktop/svelte-ui'

  const account = [
    { value: 'profile', label: 'Profile', icon: 'lucide:user' },
    { value: 'settings', label: 'Settings', icon: 'lucide:settings' },
    { separator: true },
    { value: 'logout', label: 'Log out', icon: 'lucide:log-out' },
  ]
  const lesson = [
    { value: 'reschedule', label: 'Reschedule', icon: 'lucide:calendar-clock' },
    { value: 'notes', label: 'Add notes', icon: 'lucide:notebook-pen' },
    { separator: true },
    { group: 'Student' },
    { value: 'message', label: 'Send message', icon: 'lucide:message-square' },
    { value: 'profile', label: 'View profile', icon: 'lucide:user' },
  ]
  let selected = $state(null)
</script>

<Menu items={account} label="My account" onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Account</Button>{/snippet}
</Menu>
<Menu items={lesson} label="Maths with Ada" onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Lesson</Button>{/snippet}
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
