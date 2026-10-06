<!--
  A select: a button that opens a list of options, with typeahead.

  <Select label="Level" items={['GCSE', 'A Level']} bind:value={level} />
  <Select items={students} labelKey="name" valueKey="id" bind:value={studentId} />

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`)
  - `value`: bindable; the item's own value (not Zag's string)
  - `placeholder`: shown while nothing is selected
  - `name`: also renders a hidden native <select>, so plain form posts work
  - `size`: 'sm' or 'md'
  - `item` snippet: an option's content, given the item
-->
<script>
  import * as select from '@zag-js/select'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './select.css'

  let {
    label = null, items = [], value = $bindable(null), placeholder = 'Select…',
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled',
    name = null, size = 'md', disabled = false, item: itemSnippet = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('select', () => classes)

  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)

  const collection = $derived(select.collection({
    items,
    itemToString: labelOf,
    itemToValue: (item) => String(valueOf(item)),
    isItemDisabled: (item) => typeof item === 'object' && !!item[disabledKey],
  }))

  const id = $props.id()
  const service = useMachine(select.machine, () => ({
    id, collection, name, disabled,
    invalid: !!field?.invalid,
    // Inside a Field, its label points at our trigger.
    ids: field ? { trigger: field.id, label: field.labelId } : undefined,
    value: value == null ? [] : [String(value)],
    positioning: { placement: 'bottom-start', sameWidth: true },
    onValueChange: (details) => { value = details.items[0] != null ? valueOf(details.items[0]) : null },
  }))
  const api = $derived(select.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-size={size}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    <button {...part('trigger')} {...api.getTriggerProps()} {...fieldAttrs(field)}>
      <span {...part('value-text')} {...api.getValueTextProps()} data-placeholder={!api.hasSelectedItems || undefined}>
        {api.hasSelectedItems ? api.valueAsString : placeholder}
      </span>
      <span {...part('indicator')} {...api.getIndicatorProps()}><iconify-icon icon="lucide:chevron-down"></iconify-icon></span>
    </button>
  </div>

  <div {...part('positioner')} {...api.getPositionerProps()}>
    <ul {...part('content')} {...api.getContentProps()}>
      {#each items as item (valueOf(item))}
        <li {...part('item')} {...api.getItemProps({ item })}>
          <span {...part('item-text')} {...api.getItemTextProps({ item })}>
            {#if itemSnippet}{@render itemSnippet(item)}{:else}{labelOf(item)}{/if}
          </span>
          <span {...part('item-indicator')} {...api.getItemIndicatorProps({ item })}><iconify-icon icon="lucide:check"></iconify-icon></span>
        </li>
      {/each}
    </ul>
  </div>

  {#if name}
    <select {...api.getHiddenSelectProps()}>
      {#each items as item (valueOf(item))}<option value={String(valueOf(item))}>{labelOf(item)}</option>{/each}
    </select>
  {/if}
</div>
