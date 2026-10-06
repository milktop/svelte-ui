<!-- Checkbox and radio items as child components
  `bind:checked` and `bind:value`. Only the checkboxes have `keepOpen`, so picking a sort order closes the menu. -->
<script>
  import { Menu, MenuCheckbox, MenuRadioGroup, MenuRadio, MenuSeparator, Button } from '@milktop/svelte-ui'

  let showGrid = $state(true)
  let showRulers = $state(false)
  let sort = $state('name')
</script>

<Menu>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">View</Button>{/snippet}
  <MenuCheckbox bind:checked={showGrid} keepOpen>Show grid</MenuCheckbox>
  <MenuCheckbox bind:checked={showRulers} shortcut="⌘R" keepOpen>Show rulers</MenuCheckbox>
  <MenuSeparator />
  <MenuRadioGroup bind:value={sort} label="Sort by">
    <MenuRadio value="name">Name</MenuRadio>
    <MenuRadio value="date">Date</MenuRadio>
    <MenuRadio value="size">Size</MenuRadio>
  </MenuRadioGroup>
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify({ showGrid, showRulers, sort })}</p>
