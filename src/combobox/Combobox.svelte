<!--
  A combobox: type to filter a list, then pick one (or several, as tags).

  <Combobox label="Student" items={students} labelKey="name" valueKey="id" bind:value={studentId} />
  <Combobox label="Subjects" items={subjects} multiple bind:value={picked} />

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`)
  - `value`: bindable; the item's own value, or an array of them when `multiple`
  - `multiple`: pick several; they show as tags (`variant`: 'subtle', 'accent' or 'outline')
  - `load`: an async function(query) returning items, for server search
    (debounced by `debounce` ms; `loadingText` shows meanwhile)
  - `placeholder`, `emptyText` (shown when nothing matches)
  - `placement`: where the list opens ('bottom-start')
  - `item` snippet: an option's content, given the item
  - `name`: for plain form posts
-->
<script>
  import * as combobox from '@zag-js/combobox'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './combobox.css'

  let {
    label = null, items = [], value = $bindable(null), multiple = false, placeholder = 'Search…', emptyText = 'No matches',
    load = null, debounce = 200, loadingText = 'Loading…', placement = 'bottom-start',
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled', variant = 'subtle', name = null, disabled = false,
    item: itemSnippet = null, class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('combobox', () => classes)
  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)
  const keyOf = (item) => String(valueOf(item))
  // Items found by `load` are remembered, so picked ones keep their labels.
  let seen = $state([])
  const pool = $derived(load ? seen : items)
  const byKey = (key) => pool.find((item) => keyOf(item) === key)

  // What's been typed (not the picked item's label), filtering the list:
  // labels starting with it first, then those containing it.
  let query = $state('')
  let loaded = $state([])
  let loading = $state(false)
  let ticket = 0
  let timer

  // With `load`, the server filters: ask it (debounced), keeping only the latest answer.
  $effect(() => {
    if (!load) return
    const q = query
    const mine = ++ticket
    loading = true
    clearTimeout(timer)
    timer = setTimeout(async () => {
      const list = await load(q)
      if (mine !== ticket) return
      loaded = list
      seen = [...seen.filter((item) => !list.some((it) => keyOf(it) === keyOf(item))), ...list]
      loading = false
    }, debounce)
    return () => clearTimeout(timer)
  })

  const shown = $derived.by(() => {
    if (load) return loading ? [] : loaded
    const q = query.toLowerCase()
    if (!q) return items
    const label = (item) => labelOf(item).toLowerCase()
    return [...items.filter((item) => label(item).startsWith(q)), ...items.filter((item) => !label(item).startsWith(q) && label(item).includes(q))]
  })
  const picked = $derived(multiple ? (value ?? []).map((v) => pool.find((item) => valueOf(item) === v)).filter((item) => item !== undefined) : [])

  const collection = $derived(combobox.collection({
    items: shown, itemToString: labelOf, itemToValue: keyOf,
    isItemDisabled: (item) => typeof item === 'object' && !!item[disabledKey],
  }))

  const id = $props.id()
  const service = useMachine(combobox.machine, () => ({
    id, collection, name, disabled, multiple, placeholder, openOnClick: true, inputBehavior: 'autohighlight',
    selectionBehavior: multiple ? 'clear' : 'replace',
    invalid: !!field?.invalid,
    ids: field ? { input: field.id, label: field.labelId } : undefined,
    value: multiple ? (value ?? []).map(String) : value == null ? [] : [String(value)],
    positioning: { placement, sameWidth: true },
    onInputValueChange: (details) => { query = details.reason === 'input-change' ? details.inputValue : '' },
    // Zag's values are strings; map them back to the items' own.
    onValueChange: (details) => {
      const chosen = details.value.map(byKey).filter((item) => item !== undefined).map(valueOf)
      value = multiple ? chosen : chosen[0] ?? null
    },
  }))
  const api = $derived(combobox.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-variant={variant}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    <div {...part('tags')}>
      {#each picked as item (keyOf(item))}
        <span {...part('tag')}>
          <span {...part('tag-text')}>{labelOf(item)}</span>
          <button {...part('tag-remove')} type="button" tabindex="-1" aria-label="Remove {labelOf(item)}"
            onclick={(e) => { e.stopPropagation(); api.clearValue(keyOf(item)) }}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </span>
      {/each}
      <input {...part('input')} {...api.getInputProps()} placeholder={picked.length ? '' : placeholder} {...fieldAttrs(field)} />
    </div>
    <button {...part('clear')} {...api.getClearTriggerProps()}><iconify-icon icon="lucide:x"></iconify-icon></button>
    <button {...part('trigger')} {...api.getTriggerProps()}><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>
  </div>

  <div {...part('positioner')} {...api.getPositionerProps()}>
    <ul {...part('content')} {...api.getContentProps()}>
      {#each shown as item (keyOf(item))}
        <li {...part('item')} {...api.getItemProps({ item })}>
          <span {...part('item-text')} {...api.getItemTextProps({ item })}>
            {#if itemSnippet}{@render itemSnippet(item)}{:else}{labelOf(item)}{/if}
          </span>
          <span {...part('item-indicator')} {...api.getItemIndicatorProps({ item })}><iconify-icon icon="lucide:check"></iconify-icon></span>
        </li>
      {:else}
        <li {...part('empty')}>{loading ? loadingText : emptyText}</li>
      {/each}
    </ul>
  </div>
</div>
