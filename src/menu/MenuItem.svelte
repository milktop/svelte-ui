<!--
  One action in a Menu or Submenu; its content is the label.

  <MenuItem value="edit" icon="lucide:pencil" shortcut="⌘E">Edit</MenuItem>

  - `value`: what the menu's `onselect` gets (the label's text if unset)
  - `href`: makes it a link
  - `icon`, `shortcut`, `danger`, `disabled` and `keepOpen`: as on `items` entries
  - `onclick`: runs when it's chosen, by pointer or keyboard
-->
<script>
  import 'iconify-icon'
  import { useMenu, closeFor } from './context.js'
  import { cx } from '../utils.js'

  let {
    value = undefined, href = null, icon = null, shortcut = null, danger = false, disabled = false, keepOpen = null,
    onclick = null, class: className = '', children, ...rest
  } = $props()

  const menu = useMenu()
  const part = menu.part
  let labelEl = $state()
  // Without a value, the label's text stands in.
  let text = $state('')
  $effect(() => { text = labelEl?.textContent.trim() ?? '' })
  const itemValue = $derived(value ?? text)
  const key = $derived(String(itemValue))
  $effect(() => menu.remember(key, itemValue))

  const props = $derived(menu.api.getItemProps({ value: key, valueText: text, disabled: !!disabled, closeOnSelect: closeFor(keepOpen) }))
</script>

<svelte:element this={href ? 'a' : 'div'} {...rest} {...part('item')} {href} {...props} class={cx(className)} data-danger={danger || undefined}
  onclick={(e) => { props.onclick?.(e); onclick?.(e) }}>
  {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
  <span {...part('label')} bind:this={labelEl}>{@render children?.()}</span>
  {#if shortcut}<kbd {...part('shortcut')}>{shortcut}</kbd>{/if}
</svelte:element>
