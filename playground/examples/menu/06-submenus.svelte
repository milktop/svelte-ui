<!-- Submenus
  An entry with its own `items` opens a submenu, on hover or the right arrow key. Submenus nest, and their selections reach the outer menu's `onselect`. -->
<script>
  import { Menu, Button } from '@milktop/svelte-ui'

  const file = [
    { value: 'new', label: 'New lesson', icon: 'lucide:file-plus', shortcut: '⌘N' },
    { label: 'Share', icon: 'lucide:share-2', items: [
      { value: 'email', label: 'Email', icon: 'lucide:mail' },
      { value: 'link', label: 'Copy link', icon: 'lucide:link' },
      { label: 'Export', icon: 'lucide:download', items: [{ value: 'pdf', label: 'PDF' }, { value: 'csv', label: 'CSV' }] },
    ] },
    { separator: true },
    { value: 'archive', label: 'Archive', icon: 'lucide:archive' },
  ]
  let selected = $state(null)
</script>

<Menu items={file} onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">File</Button>{/snippet}
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
