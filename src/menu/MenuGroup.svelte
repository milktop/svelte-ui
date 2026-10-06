<!--
  A group of items in a Menu or Submenu, under a heading.

  <MenuGroup label="Student"><MenuItem value="message">Send message</MenuItem></MenuGroup>

  - `label`: the heading (optional)
-->
<script>
  import { useMenu } from './context.js'

  let { label = null, children } = $props()

  const menu = useMenu()
  const id = $props.id()
</script>

<div {...menu.part('item-group')} {...menu.api.getItemGroupProps({ id })}>
  {#if label}<div {...menu.part('group-label')} {...menu.api.getItemGroupLabelProps({ htmlFor: id })}>{label}</div>{/if}
  {@render children?.()}
</div>
