<!--
  A checkbox item in a Menu or Submenu; its content is the label.

  <MenuCheckbox bind:checked={showGrid} keepOpen>Show grid</MenuCheckbox>

  - `checked`: bindable
  - `value`, `icon`, `shortcut`, `disabled` and `keepOpen`: as on MenuItem
-->
<script>
  import 'iconify-icon'
  import { useMenu, closeFor } from './context.js'

  let { checked = $bindable(false), value = undefined, icon = null, shortcut = null, disabled = false, keepOpen = null, children } = $props()

  const menu = useMenu()
  const part = menu.part
  const id = $props.id()
  let labelEl = $state()

  const props = $derived({
    type: 'checkbox', value: String(value ?? id), checked: !!checked, disabled: !!disabled,
    valueText: labelEl?.textContent.trim() ?? '', closeOnSelect: closeFor(keepOpen),
    onCheckedChange: (on) => { checked = on },
  })
</script>

<div {...part('item')} {...menu.api.getOptionItemProps(props)}>
  <span {...part('indicator')}>
    <span {...part('mark')} {...menu.api.getItemIndicatorProps(props)} data-type="checkbox"><iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon></span>
  </span>
  {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
  <span {...part('label')} bind:this={labelEl}>{@render children?.()}</span>
  {#if shortcut}<kbd {...part('shortcut')}>{shortcut}</kbd>{/if}
</div>
