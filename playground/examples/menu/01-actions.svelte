<!-- Actions
  Icons, shortcuts, a disabled item, a separator and a danger item. -->
<script>
  import { Menu, Button } from '@milktop/svelte-ui'

  const actions = [
    { value: 'edit', label: 'Edit', icon: 'lucide:pencil', shortcut: '⌘E' },
    { value: 'duplicate', label: 'Duplicate', icon: 'lucide:copy', shortcut: '⌘D' },
    { value: 'share', label: 'Share', icon: 'lucide:share-2', disabled: true },
    { separator: true },
    { value: 'delete', label: 'Delete', icon: 'lucide:trash-2', danger: true },
  ]
  let selected = $state(null)
</script>

<Menu items={actions} onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Actions</Button>{/snippet}
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
