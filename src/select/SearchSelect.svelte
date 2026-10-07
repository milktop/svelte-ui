<!-- Select with search: an input that filters the list, loads it, or creates items. Used by Select.svelte, which documents the props. -->
<script>
  import * as combobox from '@zag-js/combobox'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { tick } from 'svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './search-select.css'

  let {
    label = null, items = [], value = $bindable(null), multiple = false, placeholder = 'Search…', emptyText = 'No matches',
    hideSelected = false, closeOnSelect = undefined, load = null, debounce = 200, loadingText = 'Loading…', placement = 'bottom-start',
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled', variant = 'subtle', name = null, disabled = false,
    oncreate = null, clearable = false, tags = true, item: itemSnippet = null, create: createSnippet = null, empty = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  // Zag stamps data-scope="combobox" on its parts; ours match, for search-select.css.
  const part = partsOf('combobox', () => classes)
  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)
  const keyOf = (item) => String(valueOf(item))
  // Items found by `load` or made by `oncreate` are remembered, so picked ones keep their labels.
  let seen = $state([])
  let created = $state([])
  const pool = $derived([...(load ? seen : items), ...created])
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
  const selectedKeys = $derived(multiple ? (value ?? []).map(String) : value == null ? [] : [String(value)])
  const isSelected = (item) => selectedKeys.includes(keyOf(item))
  const picked = $derived(multiple ? selectedKeys.map(byKey).filter((item) => item !== undefined) : [])

  // The list as shown, and the selected items it doesn't show (left out by a
  // search or `hideSelected`). Zag still needs those to know their labels, so
  // they stay in its collection, disabled so the keys skip them, but unrendered.
  const listed = $derived(hideSelected && multiple ? shown.filter((item) => !isSelected(item)) : shown)
  const offList = $derived(selectedKeys.filter((key) => !listed.some((item) => keyOf(item) === key)).map(byKey).filter((item) => item !== undefined))

  // The "Create …" option: for typed text that matches no item.
  const CREATE = '\u0000create'
  const typed = $derived(query.trim())
  const creating = $derived(oncreate && typed && !loading && !pool.some((item) => labelOf(item).toLowerCase() === typed.toLowerCase())
    ? { [CREATE]: true, label: typed } : null)
  const keyOfItem = (item) => (item?.[CREATE] ? CREATE : keyOf(item))

  const collection = $derived(combobox.collection({
    items: [...listed, ...(creating ? [creating] : []), ...offList],
    itemToString: (item) => (item?.[CREATE] ? item.label : labelOf(item)), itemToValue: keyOfItem,
    isItemDisabled: (item) => offList.includes(item) || (typeof item === 'object' && !item[CREATE] && !!item[disabledKey]),
  }))

  async function createFrom(text) {
    query = ''
    const made = await oncreate(text)
    if (made != null) {
      created = [...created, made]
      value = multiple ? [...(value ?? []), valueOf(made)] : valueOf(made)
      api.setInputValue(multiple ? '' : labelOf(made))
    } else api.setInputValue(multiple ? '' : selectedKeys.length ? labelOf(byKey(selectedKeys[0]) ?? '') : '')
  }

  const id = $props.id()
  const service = useMachine(combobox.machine, () => ({
    id, collection, name, disabled, multiple, placeholder, openOnClick: true, inputBehavior: 'autohighlight',
    closeOnSelect: closeOnSelect ?? !multiple,
    selectionBehavior: multiple ? 'clear' : 'replace',
    invalid: !!field?.invalid,
    ids: field ? { input: field.id, label: field.labelId } : undefined,
    value: multiple ? (value ?? []).map(String) : value == null ? [] : [String(value)],
    positioning: { placement, sameWidth: true },
    // Typing filters; a pick resets the filter (the server's results stay, so
    // the picked item keeps its place).
    onInputValueChange: (details) => {
      // Emptying the input clears a single pick; partial edits revert on blur.
      if (details.reason === 'input-change' && !details.inputValue && !multiple && selectedKeys.length) queueMicrotask(() => api.clearValue())
      if (details.reason === 'input-change') query = details.inputValue
      else if (!load || details.reason === 'clear-trigger') query = ''
    },
    // Zag's values are strings; map them back to the items' own.
    onValueChange: (details) => {
      if (details.value.includes(CREATE)) return createFrom(typed)
      const chosen = details.value.map(byKey).filter((item) => item !== undefined).map(valueOf)
      if (multiple) keepPlace(details.value)
      value = multiple ? chosen : chosen[0] ?? null
    },
  }))
  const api = $derived(combobox.connect(service, normalizeProps))
  const inputProps = $derived(api.getInputProps())

  // Picking several: the highlight stays where it was (on the next item, when
  // the picked one leaves the list), so Enter can pick a run of them. Not
  // after a search, which the pick clears. Zag only acts on Enter once the
  // keys have moved the highlight, so it moves there the way they would.
  function keepPlace(next) {
    const key = next.find((k) => !selectedKeys.includes(k)) ?? selectedKeys.find((k) => !next.includes(k))
    const at = listed.findIndex((item) => keyOf(item) === key)
    if (at < 0 || query) return
    tick().then(() => setTimeout(() => {
      const n = Math.min(at, listed.length - 1)
      if (n < 0 || !api.open) return
      if (n > 0) api.setHighlightValue(keyOf(listed[n - 1]))
      inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: n > 0 ? 'ArrowDown' : 'Home', bubbles: true }))
    }, 30))
  }

  // Backspace in an empty input removes the last pick.
  function removeLast(e) {
    if (e.key !== 'Backspace' || !multiple || e.currentTarget.value || !selectedKeys.length) return false
    api.clearValue(selectedKeys.at(-1))
    return true
  }

  // A click on the box (around the tags, not on a button) types into the input.
  let inputEl = $state()
  function focusInput(e) {
    if (e.target.closest('button, input')) return
    e.preventDefault()
    inputEl?.focus()
  }

  // Zag reverts stray text only while the list is open; when focus leaves
  // the whole combobox, put the selected item's label back (or nothing). An
  // emptied input has already cleared the pick (see onInputValueChange).
  function revert(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return
    const text = multiple ? '' : selectedKeys.length ? labelOf(byKey(selectedKeys[0]) ?? '') : ''
    const root = e.currentTarget
    // After Zag has handled the blur (closing the list, if a search left it open).
    setTimeout(() => {
      if (root.contains(document.activeElement)) return
      if (api.inputValue !== text) api.setInputValue(text)
      query = ''
    }, 0)
  }
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-variant={variant} onfocusout={revert}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()} onmousedown={focusInput}>
    <div {...part('tags')}>
      {#each picked as item (keyOf(item))}
        <span {...part('tag')}>
          <span {...part('tag-text')}>{labelOf(item)}</span>
          <button {...part('tag-remove')} type="button" tabindex="-1" aria-label="Remove {labelOf(item)}"
            onclick={(e) => { e.stopPropagation(); api.clearValue(keyOf(item)) }}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </span>
      {/each}
      <input bind:this={inputEl} {...part('input')} {...inputProps} placeholder={picked.length ? '' : placeholder} {...fieldAttrs(field)}
        onkeydown={(e) => removeLast(e) || inputProps.onkeydown?.(e)} />
    </div>
    {#if clearable}<button {...part('clear')} {...api.getClearTriggerProps()}><iconify-icon icon="lucide:x"></iconify-icon></button>{/if}
    <button {...part('trigger')} {...api.getTriggerProps()}><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>
  </div>

  <div {...part('positioner')} {...api.getPositionerProps()}>
    <ul {...part('content')} {...api.getContentProps()}>
      {#each listed as item (keyOf(item))}
        <li {...part('item')} {...api.getItemProps({ item })}>
          <span {...part('item-text')} {...api.getItemTextProps({ item })}>
            {#if itemSnippet}{@render itemSnippet(item)}{:else}{labelOf(item)}{/if}
          </span>
          <span {...part('item-indicator')} {...api.getItemIndicatorProps({ item })}><iconify-icon icon="lucide:check"></iconify-icon></span>
        </li>
      {:else}
        {#if !creating}
          <li {...part('empty')}>{#if loading}{loadingText}{:else if empty}{@render empty(typed)}{:else}{emptyText}{/if}</li>
        {/if}
      {/each}
      {#if creating}
        <li {...api.getItemProps({ item: creating })} {...part('create')}>
          {#if createSnippet}{@render createSnippet(creating.label)}
          {:else}<iconify-icon icon="lucide:plus" aria-hidden="true"></iconify-icon><span>Create “{creating.label}”</span>{/if}
        </li>
      {/if}
    </ul>
  </div>
</div>
