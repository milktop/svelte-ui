<!--
  Radio items in a Menu or Submenu, one of which is checked.

  <MenuRadioGroup bind:value={sort} label="Sort by">
    <MenuRadio value="name">Name</MenuRadio>
    <MenuRadio value="date">Date</MenuRadio>
  </MenuRadioGroup>

  - `value`: bindable; the checked MenuRadio's value
  - `label`: an optional heading
-->
<script>
  import { setContext } from 'svelte'
  import { useMenu } from './context.js'

  let { value = $bindable(null), label = null, children } = $props()

  const menu = useMenu()
  const id = $props.id()

  setContext('ui-menu-radio-group', {
    id,
    get value() { return value },
    choose: (v) => { value = v },
  })
</script>

<div {...menu.part('item-group')} {...menu.api.getItemGroupProps({ id })}>
  {#if label}<div {...menu.part('group-label')} {...menu.api.getItemGroupLabelProps({ htmlFor: id })}>{label}</div>{/if}
  {@render children?.()}
</div>
