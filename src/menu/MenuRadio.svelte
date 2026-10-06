<!--
  One radio item in a MenuRadioGroup; its content is the label.

  - `value`: what the group's value becomes
  - `icon`, `shortcut`, `disabled` and `keepOpen`: as on MenuItem
-->
<script>
  import { getContext } from 'svelte'
  import 'iconify-icon'
  import { useMenu, closeFor } from './context.js'

  let { value, icon = null, shortcut = null, disabled = false, keepOpen = null, children } = $props()

  const menu = useMenu()
  const group = getContext('ui-menu-radio-group')
  const part = menu.part
  let labelEl = $state()

  // Keyed by group, so two groups can share values.
  const props = $derived({
    type: 'radio', value: `${group.id}/${value}`, checked: group.value != null && String(group.value) === String(value),
    disabled: !!disabled, valueText: labelEl?.textContent.trim() ?? '', closeOnSelect: closeFor(keepOpen),
    onCheckedChange: () => group.choose(value),
  })
</script>

<div {...part('item')} {...menu.api.getOptionItemProps(props)}>
  <span {...part('indicator')}><span {...part('mark')} {...menu.api.getItemIndicatorProps(props)} data-type="radio"></span></span>
  {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
  <span {...part('label')} bind:this={labelEl}>{@render children?.()}</span>
  {#if shortcut}<kbd {...part('shortcut')}>{shortcut}</kbd>{/if}
</div>
