<!--
  A command menu (⌘K): a dialog with a search box over a list of commands,
  filtered as you type.

  <Command items={commands} onselect={run}>
    {#snippet trigger(props)}<Button {...props} icon="lucide:search">Search</Button>{/snippet}
  </Command>

  ⌘K (Ctrl+K elsewhere) opens and closes it; ↑/↓ move through the results,
  Enter picks one, Escape closes it.

  - `items`: objects with `label`, plus optional `value`, `group` (a heading
    the item is listed under), `icon`, `description`, `shortcut` text,
    `keywords` (extra words to match) and `disabled`. An item with `href`
    goes there when picked
  - `load`: optional async function(query) returning items, for server
    search (debounced by `debounce` ms, `loadingText` meanwhile)
  - `onselect`: called with the item's `value` (or the item, if it has none)
  - `open`: bindable; `trigger` snippet (optional): spread its props onto your button
  - `hotkey`: the key used with ⌘/Ctrl ('k'); null turns the shortcut off
  - `navigate`: function(href) for items with `href`, e.g. Inertia's
    `router.visit`; by default a link is clicked
  - `placeholder`, `emptyText`, `label`; `hints`: false hides the keyboard
    hints along the bottom
-->
<script module>
  // How the shortcut reads on this platform: '⌘K' or 'Ctrl K'.
  export function formatHotkey(key = 'k') {
    const mac = /Mac|iPhone|iPad/.test(globalThis.navigator?.platform ?? '')
    return mac ? `⌘${key.toUpperCase()}` : `Ctrl ${key.toUpperCase()}`
  }
</script>

<script>
  import * as dialog from '@zag-js/dialog'
  import * as listbox from '@zag-js/listbox'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { tick } from 'svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import { Presence, portal } from '../presence.svelte.js'
  import '../theme.css'
  import './command.css'

  let {
    open = $bindable(false), items = [], label = 'Command menu', placeholder = 'Type a command or search…',
    emptyText = 'No results', loadingText = 'Searching…', hotkey = 'k', load = null, debounce = 200, navigate = null,
    hints = true, onselect = null, trigger = null, class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('command', () => classes)
  const id = $props.id()

  let query = $state('')
  let loaded = $state([])
  let loading = $state(false)
  let inputEl = $state()
  let listEl = $state()

  const keyOf = (item) => String(item.value ?? item.href ?? item.label)

  // Every word typed must appear in the label, description, group or keywords.
  const matches = (item, words) => {
    const text = [item.label, item.description, item.group, ...(item.keywords ?? [])].join(' ').toLowerCase()
    return words.every((word) => text.includes(word))
  }

  const found = $derived.by(() => {
    if (load) return loaded
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return words.length ? items.filter((item) => matches(item, words)) : items
  })

  // Results in group order (by first appearance), so the list reads and the
  // arrow keys move the same way.
  const groups = $derived.by(() => {
    const names = [...new Set(found.map((item) => item.group ?? ''))]
    return names.map((name) => ({ name, items: found.filter((item) => (item.group ?? '') === name) }))
  })
  const results = $derived(groups.flatMap((group) => group.items))
  const collection = $derived(listbox.collection({
    items: results, itemToString: (item) => item.label, itemToValue: keyOf, isItemDisabled: (item) => !!item.disabled,
  }))

  let ticket = 0
  let timer
  function search(text) {
    query = text
    if (!load) return
    const mine = ++ticket
    loading = true
    clearTimeout(timer)
    timer = setTimeout(async () => {
      const list = await load(text)
      if (mine !== ticket) return
      loading = false
      loaded = list ?? []
    }, debounce)
  }

  const service = useMachine(dialog.machine, () => ({
    id, open,
    initialFocusEl: () => inputEl,
    onOpenChange: (details) => {
      open = details.open
      if (details.open) reset()
    },
  }))
  const api = $derived(dialog.connect(service, normalizeProps))
  const presence = new Presence(() => api.open)

  // The value stays empty, so picking the same command again still counts.
  const listService = useMachine(listbox.machine, () => ({
    id: `${id}-list`, collection, loopFocus: true, value: [],
    scrollToIndexFn: (details) => scrollToItem(details.getElement()),
    onSelect: (details) => choose(details.value),
  }))
  const list = $derived(listbox.connect(listService, normalizeProps))

  // Each time it opens: an empty search over all the commands, the first highlighted.
  async function reset() {
    search('')
    if (inputEl) inputEl.value = ''
    await tick()
    if (listEl) listEl.scrollTop = 0
    setTimeout(() => list.highlightFirst(), 0)
  }

  // Keeps the highlighted item in view, scrolling only the list, and showing
  // a group's heading along with its first item.
  function scrollToItem(el) {
    if (!el || !listEl) return
    const box = listEl.getBoundingClientRect()
    const offset = (node) => node.getBoundingClientRect().top - box.top + listEl.scrollTop
    const group = el.closest('[data-part=item-group]')
    const first = group && group.querySelector('[data-part=item]') === el
    const top = offset(first ? group : el) - 4
    const bottom = offset(el) + el.offsetHeight + 4
    if (top < listEl.scrollTop) listEl.scrollTop = top
    else if (bottom > listEl.scrollTop + listEl.clientHeight) listEl.scrollTop = bottom - listEl.clientHeight
  }

  function choose(key) {
    const item = results.find((item) => keyOf(item) === key)
    if (!item) return
    open = false
    onselect?.(item.value === undefined ? item : item.value)
    if (item.href) go(item.href)
  }

  function go(href) {
    if (navigate) return navigate(href)
    const link = document.createElement('a')
    link.href = href
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function onkeydown(e) {
    if (!hotkey || !(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== hotkey) return
    e.preventDefault()
    open = !open
  }

  // The first result stays highlighted as the results change, so Enter picks it.
  $effect(() => {
    collection
    if (api.open) setTimeout(() => list.highlightFirst(), 0)
  })
</script>

<svelte:window {onkeydown} />

{@render trigger?.(api.getTriggerProps())}
{#if presence.present}
  <div {@attach portal} style="display: contents">
    <div {...api.getBackdropProps()} {...part('backdrop')} hidden={false}></div>
    <div {...api.getPositionerProps()} {...part('positioner')}>
      <div {...rest} {...api.getContentProps()} {...part('content')} hidden={false} class={cx(className)} onanimationend={presence.done}>
        <h2 {...api.getTitleProps()} {...part('sr-only')}>{label}</h2>
        <div {...part('root')} {...list.getRootProps()}>
          <span {...part('sr-only')} {...list.getLabelProps()}>{label}</span>
          <div {...part('search')}>
            <iconify-icon {...part('search-icon')} icon="lucide:search" aria-hidden="true"></iconify-icon>
            <input {...part('input')} {...list.getInputProps({ autoHighlight: true })} bind:this={inputEl} type="text" {placeholder}
              oninput={(e) => search(e.target.value)} />
            <kbd {...part('key')} data-esc>Esc</kbd>
          </div>
          <div {...part('list')} {...list.getContentProps()} bind:this={listEl}>
            <!-- Earlier results stay while a search runs. -->
            {#if loading && !results.length}
              <div {...part('status')}>{loadingText}</div>
            {:else if !results.length}
              <div {...part('status')}>{emptyText}</div>
            {:else}
              {#each groups as group, i}
                <div {...part('group')} {...list.getItemGroupProps({ id: `g${i}` })}>
                  {#if group.name}<div {...part('group-label')} {...list.getItemGroupLabelProps({ htmlFor: `g${i}` })}>{group.name}</div>{/if}
                  {#each group.items as item (keyOf(item))}
                    <div {...part('item')} {...list.getItemProps({ item, highlightOnHover: true })}>
                      {#if item.icon}<iconify-icon {...part('icon')} icon={item.icon} aria-hidden="true"></iconify-icon>{/if}
                      <span {...part('text')}>
                        <span {...part('label')}>{item.label}</span>
                        {#if item.description}<span {...part('description')}>{item.description}</span>{/if}
                      </span>
                      {#if item.shortcut}<kbd {...part('shortcut')}>{item.shortcut}</kbd>{/if}
                    </div>
                  {/each}
                </div>
              {/each}
            {/if}
          </div>
          {#if hints}
            <div {...part('hints')} aria-hidden="true">
              <span><kbd {...part('key')}>↑</kbd><kbd {...part('key')}>↓</kbd> to navigate</span>
              <span><kbd {...part('key')}>↵</kbd> to select</span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
