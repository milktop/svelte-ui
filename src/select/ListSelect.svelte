<!-- Select without search: a button that opens the list. Used by Select.svelte, which documents the props. -->
<script>
  import * as select from '@zag-js/select'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { tick } from 'svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './select.css'

  let {
    label = null, items = [], value = $bindable(null), placeholder = 'Select…', tags = false, variant = 'subtle',
    emptyText = 'No matches', empty = null,
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled',
    name = null, size = 'md', multiple = false, hideSelected = false, deselectable = false, closeOnSelect = undefined, clearable = false, placement = 'bottom-start', disabled = false, item: itemSnippet = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('select', () => classes)

  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)

  const selectedKeys = $derived(multiple ? (value ?? []).map(String) : value == null ? [] : [String(value)])
  const isSelected = (item) => selectedKeys.includes(String(valueOf(item)))
  // With hideSelected the picked items aren't rendered, but stay in Zag's
  // collection (for their labels), disabled so the keys skip them.
  const hidden = (item) => hideSelected && multiple && isSelected(item)
  const listed = $derived(items.filter((item) => !hidden(item)))

  const collection = $derived(select.collection({
    items,
    itemToString: labelOf,
    itemToValue: (item) => String(valueOf(item)),
    isItemDisabled: (item) => hidden(item) || (typeof item === 'object' && !!item[disabledKey]),
  }))

  const id = $props.id()
  const service = useMachine(select.machine, () => ({
    id, collection, name, disabled, multiple, deselectable, closeOnSelect: closeOnSelect ?? !multiple,
    invalid: !!field?.invalid,
    // Inside a Field, its label points at our trigger.
    ids: field ? { trigger: field.id, label: field.labelId } : undefined,
    value: multiple ? (value ?? []).map(String) : value == null ? [] : [String(value)],
    positioning: { placement, sameWidth: true },
    // Zag's values are strings; map them back to the items' own.
    onValueChange: (details) => {
      const chosen = details.value.map((key) => items.find((item) => String(valueOf(item)) === key)).filter((item) => item !== undefined).map(valueOf)
      if (multiple) keepPlace(details.value)
      value = multiple ? chosen : chosen[0] ?? null
    },
  }))
  const api = $derived(select.connect(service, normalizeProps))
  const triggerProps = $derived(api.getTriggerProps())

  // Picking several: the highlight stays where it was (on the next item, when
  // the picked one leaves the list), so Enter can pick a run of them.
  function keepPlace(next) {
    const key = next.find((k) => !selectedKeys.includes(k)) ?? selectedKeys.find((k) => !next.includes(k))
    const at = listed.findIndex((item) => String(valueOf(item)) === key)
    if (at < 0) return
    tick().then(() => setTimeout(() => {
      const item = listed[Math.min(at, listed.length - 1)]
      if (item && api.open) api.setHighlightValue(String(valueOf(item)))
    }, 30))
  }

  // Backspace on the closed button removes the last pick.
  function removeLast(e) {
    if (e.key !== 'Backspace' || !multiple || api.open || !selectedKeys.length) return false
    api.clearValue(selectedKeys.at(-1))
    return true
  }
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-size={size} data-variant={variant}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    <button {...part('trigger')} {...triggerProps} {...fieldAttrs(field)} onkeydown={(e) => removeLast(e) || triggerProps.onkeydown?.(e)}>
      {#if multiple && tags && api.hasSelectedItems}
        <!-- Chips, not buttons (a button can't hold buttons): untick an item to remove it. -->
        <span {...part('tags')}>
          {#each api.selectedItems as picked (valueOf(picked))}<span {...part('tag')}><span {...part('tag-text')}>{labelOf(picked)}</span></span>{/each}
        </span>
      {:else}
        <span {...part('value-text')} {...api.getValueTextProps()} data-placeholder={!api.hasSelectedItems || undefined}>
          {api.hasSelectedItems ? api.valueAsString : placeholder ?? 'Select…'}
        </span>
      {/if}
      <span {...part('indicator')} {...api.getIndicatorProps()}><iconify-icon icon="lucide:chevron-down"></iconify-icon></span>
    </button>
    {#if clearable}<button {...part('clear')} {...api.getClearTriggerProps()}><iconify-icon icon="lucide:x"></iconify-icon></button>{/if}
  </div>

  <div {...part('positioner')} {...api.getPositionerProps()}>
    <ul {...part('content')} {...api.getContentProps()}>
      {#each listed as item (valueOf(item))}
        <li {...part('item')} {...api.getItemProps({ item })}>
          <span {...part('item-text')} {...api.getItemTextProps({ item })}>
            {#if itemSnippet}{@render itemSnippet(item)}{:else}{labelOf(item)}{/if}
          </span>
          <span {...part('item-indicator')} {...api.getItemIndicatorProps({ item })}><iconify-icon icon="lucide:check"></iconify-icon></span>
        </li>
      {:else}
        <li {...part('empty')}>{#if empty}{@render empty('')}{:else}{emptyText}{/if}</li>
      {/each}
    </ul>
  </div>

  {#if name}
    <select {...api.getHiddenSelectProps()}>
      {#each items as item (valueOf(item))}<option value={String(valueOf(item))}>{labelOf(item)}</option>{/each}
    </select>
  {/if}
</div>
