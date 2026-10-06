<!-- Groups, aligned to the end -->
<script>
  import { Menu, Button } from '@milktop/svelte-ui'

  const more = [
    { group: 'Lesson' },
    { value: 'reschedule', label: 'Reschedule', icon: 'lucide:calendar-clock' },
    { value: 'notes', label: 'Add notes', icon: 'lucide:notebook-pen' },
    { separator: true },
    { group: 'Student' },
    { value: 'message', label: 'Send message', icon: 'lucide:message-square' },
    { value: 'profile', label: 'View profile', icon: 'lucide:user' },
  ]
  let selected = $state(null)
</script>

<span class="flex items-center gap-2">Maths with Ada, Thursday 16:00
  <Menu items={more} placement="bottom-end" onselect={(value) => (selected = value)}>
    {#snippet trigger(props)}<Button {...props} variant="ghost" icon="lucide:ellipsis" aria-label="More" />{/snippet}
  </Menu>
</span>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
