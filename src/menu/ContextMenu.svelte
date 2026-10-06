<!--
  A Menu opened by right-clicking (or long-pressing on touch) an area, at the pointer.

  <ContextMenu items={actions} onselect={run}>
    {#snippet trigger(props)}<div {...props}>…the area…</div>{/snippet}
  </ContextMenu>

  Takes the same props, `items` and child components (submenus too) as Menu.
-->
<script>
  import Menu from './Menu.svelte'

  let { ...rest } = $props()
</script>

<Menu {...rest} context />
