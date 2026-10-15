<!-- Ticks before the label
  Checked checkbox and radio items show a tick after the label by default, so labels line up with the other items. `indicator="start"` puts it before the label instead, with a dot for radios. -->
<script>
  import { Menu, MenuCheckbox, MenuSeparator, MenuRadioGroup, MenuRadio, Button } from '@milktop/svelte-ui'

  let showGrid = $state(true)
  let sort = $state('name')
</script>

<Menu indicator="start">
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">View</Button>{/snippet}
  <MenuCheckbox bind:checked={showGrid} keepOpen>Show grid</MenuCheckbox>
  <MenuSeparator />
  <MenuRadioGroup bind:value={sort} label="Sort by">
    <MenuRadio value="name">Name</MenuRadio>
    <MenuRadio value="date">Date</MenuRadio>
    <MenuRadio value="size">Size</MenuRadio>
  </MenuRadioGroup>
</Menu>
