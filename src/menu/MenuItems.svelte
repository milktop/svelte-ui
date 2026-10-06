<!-- Renders a menu's `items` array: actions, links, separators, group
     headings, checkbox and radio entries, and submenus. Internal. -->
<script>
  import 'iconify-icon'
  import Submenu from './Submenu.svelte'
  import { useMenu, labelOf, valueOf, disabledOf, isOption, isSubmenu, closeFor } from './context.js'

  let { items = [] } = $props()

  const menu = useMenu()
  const part = menu.part
  const { labelKey, valueKey, disabledKey } = $derived(menu.keys)
  const keyOf = (item) => String(valueOf(item, valueKey, labelKey))

  // Checked states, starting from the entries' own; radio keys include their
  // `name`, so two groups can share values.
  let checked = $state({})
  const optionKey = (item) => (item.type === 'radio' ? `${item.name ?? ''}/${keyOf(item)}` : keyOf(item))
  const isChecked = (item) => checked[optionKey(item)] ?? !!item.checked

  function check(item, on) {
    if (item.type === 'radio') {
      if (isChecked(item)) return
      for (const other of items) {
        if (isOption(other) && other.type === 'radio' && other.name === item.name) {
          checked[optionKey(other)] = false
          other.checked = false
        }
      }
    }
    checked[optionKey(item)] = on
    item.checked = on
    menu.onchange?.({ type: item.type, name: item.name ?? null, value: valueOf(item, valueKey, labelKey), checked: on })
  }

  const optionProps = (item) => ({
    type: item.type, value: optionKey(item), checked: isChecked(item),
    disabled: disabledOf(item, disabledKey), valueText: labelOf(item, labelKey), closeOnSelect: closeFor(item.keepOpen),
    onCheckedChange: (on) => check(item, on),
  })

  $effect(() => {
    for (const item of items) if (!isOption(item) && !isSubmenu(item) && !item?.separator && !item?.group) menu.remember(keyOf(item), valueOf(item, valueKey, labelKey))
  })
</script>

{#each items as item}
  {#if item?.separator}
    <div {...part('separator')} {...menu.api.getSeparatorProps()}></div>
  {:else if item?.group}
    <div {...part('group-label')}>{item.group}</div>
  {:else if isOption(item)}
    {@const props = optionProps(item)}
    <div {...part('item')} {...menu.api.getOptionItemProps(props)} data-danger={item.danger || undefined}>
      <span {...part('indicator')}>
        <span {...part('mark')} {...menu.api.getItemIndicatorProps(props)} data-type={item.type}>
          {#if item.type === 'checkbox'}<iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon>{/if}
        </span>
      </span>
      {#if item.icon}<iconify-icon {...part('icon')} icon={item.icon} aria-hidden="true"></iconify-icon>{/if}
      <span {...part('label')}>{labelOf(item, labelKey)}</span>
      {#if item.shortcut}<kbd {...part('shortcut')}>{item.shortcut}</kbd>{/if}
    </div>
  {:else if isSubmenu(item)}
    <Submenu items={item.items} label={labelOf(item, labelKey)} icon={item.icon} />
  {:else}
    <svelte:element this={item?.href ? 'a' : 'div'} {...part('item')} href={item?.href}
      {...menu.api.getItemProps({ value: keyOf(item), valueText: labelOf(item, labelKey), disabled: disabledOf(item, disabledKey), closeOnSelect: closeFor(item?.keepOpen) })}
      data-danger={item?.danger || undefined}>
      {#if item?.icon}<iconify-icon {...part('icon')} icon={item.icon} aria-hidden="true"></iconify-icon>{/if}
      <span {...part('label')}>{labelOf(item, labelKey)}</span>
      {#if item?.shortcut}<kbd {...part('shortcut')}>{item.shortcut}</kbd>{/if}
    </svelte:element>
  {/if}
{/each}
