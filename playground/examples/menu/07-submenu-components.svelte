<!-- Submenus as child components -->
<script>
  import { Menu, Submenu, MenuItem, MenuSeparator, Button } from '@milktop/svelte-ui'

  let selected = $state(null)
</script>

<Menu onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">File</Button>{/snippet}
  <MenuItem value="new" icon="lucide:file-plus" shortcut="⌘N">New lesson</MenuItem>
  <Submenu label="Share" icon="lucide:share-2">
    <MenuItem value="email" icon="lucide:mail">Email</MenuItem>
    <MenuItem value="link" icon="lucide:link">Copy link</MenuItem>
    <Submenu label="Export" icon="lucide:download">
      <MenuItem value="pdf">PDF</MenuItem>
      <MenuItem value="csv">CSV</MenuItem>
    </Submenu>
  </Submenu>
  <MenuSeparator />
  <MenuItem value="archive" icon="lucide:archive">Archive</MenuItem>
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
