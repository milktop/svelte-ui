<!-- Context menu
  ContextMenu opens the same menu at the pointer when you right-click (or long-press) its area. -->
<script>
  import { ContextMenu, Submenu, MenuItem, MenuSeparator } from '@milktop/svelte-ui'

  const actions = [
    { value: 'edit', label: 'Edit', icon: 'lucide:pencil', shortcut: '⌘E' },
    { value: 'duplicate', label: 'Duplicate', icon: 'lucide:copy', shortcut: '⌘D' },
    { value: 'delete', label: 'Delete', icon: 'lucide:trash-2', danger: true },
  ]
  let selected = $state(null)
</script>

<ContextMenu items={actions} label="Lesson" onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}
    <div {...props} class="grid h-32 w-full place-items-center rounded-(--ui-radius) border border-dashed border-(--ui-border) text-sm text-(--ui-muted) select-none data-[state=open]:border-(--ui-accent) data-[state=open]:text-(--ui-text)">
      Right-click here
    </div>
  {/snippet}
  <MenuSeparator />
  <Submenu label="Move to" icon="lucide:folder-input">
    <MenuItem value="maths">Maths</MenuItem>
    <MenuItem value="physics">Physics</MenuItem>
  </Submenu>
</ContextMenu>
<p class="m-0 w-full text-sm text-(--ui-muted)">selected: {JSON.stringify(selected)}</p>
