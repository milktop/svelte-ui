<!-- Actions as child components
  MenuItem takes the same options as `items` entries, and its content is the label. -->
<script>
  import { Menu, MenuItem, MenuSeparator, Button } from '@milktop/svelte-ui'

  let selected = $state(null)
</script>

<Menu onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Actions</Button>{/snippet}
  <MenuItem value="edit" icon="lucide:pencil" shortcut="⌘E">Edit</MenuItem>
  <MenuItem value="duplicate" icon="lucide:copy" shortcut="⌘D">Duplicate</MenuItem>
  <MenuItem value="share" icon="lucide:share-2" disabled>Share</MenuItem>
  <MenuSeparator />
  <MenuItem value="delete" icon="lucide:trash-2" danger>Delete</MenuItem>
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
