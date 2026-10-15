<!--
  Rows people put in order by dragging, or with the keyboard. Drag a row by
  its grip; or focus the grip, press Space to pick it up, the arrow keys to
  move it, Space to drop it (Escape puts it back). Screen readers hear each step.

  <SortableList bind:items={topics}>
    {#snippet item(topic)}{topic.title}{/snippet}
  </SortableList>
  <SortableList items={['Warm-up', 'Reading', 'Quiz']} onchange={save} />

  - `items`: bindable; the rows, in order
  - `itemKey`: the property that identifies an item ('id'), or a function;
    strings and numbers are their own key
  - `item` snippet: a row's content, given the item and `{ index, dragging }`;
    by default its label (see `itemLabel`)
  - `itemLabel`: a function giving what screen readers call an item as it
    moves ("Picked up Worksheet 4… moved to position 3 of 5"); by default a
    string item itself, or its `label`, `title` or `name`
  - `handle`: drag by the grip only (default), or false for the whole row
    (keyboard users then use the row itself, focused)
  - `variant`: 'card' (default: rows in a bordered box) or 'plain' (separate,
    spaced rows)
  - `disabled`: no reordering
  - `label`: the list's accessible name
  - `onchange`: called with the reordered items; `onmove` with `{ item, from, to }`
-->
<script>
  import { tick } from 'svelte'
  import '../icons.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './sortable-list.css'

  let {
    items = $bindable([]), itemKey = 'id', item: itemSnippet = null, itemLabel = null, handle = true, variant = 'card',
    disabled = false, label = null, onchange = null, onmove = null, class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('sortable-list', () => classes)
  const id = $props.id()
  const words = $derived(uiLocale.messages.sortableList)

  const keyOf = (item) => (typeof itemKey === 'function' ? itemKey(item) : typeof item === 'object' && item ? item[itemKey] : item)
  function nameOf(item) {
    if (itemLabel) return itemLabel(item)
    if (typeof item !== 'object' || !item) return String(item)
    return String(item.label ?? item.title ?? item.name ?? keyOf(item))
  }
  const place = (index, count) => words.position(index + 1, count)

  let listEl = $state()
  let status = $state('')
  // A pointer drag, and a row picked up with the keyboard (its working order).
  let gesture = $state(null)
  let picked = $state(null)
  let from = null
  let working = $state(null)
  let suppressClick = false

  // The rows as shown: while the keyboard moves one, its working order.
  const rows = $derived(working ?? items ?? [])
  const dragging = $derived(gesture?.started ? gesture.index : picked)

  function announce(text) {
    // Cleared first, so the same words twice are still read.
    status = ''
    queueMicrotask(() => (status = text))
  }

  function commitOrder(next, item, from, to) {
    items = next
    onmove?.({ item, from, to })
    onchange?.(next)
  }

  const rowEls = () => Array.from(listEl?.querySelectorAll(':scope > [data-part=item]') ?? [])

  // Pointer: a small move before the drag starts, so clicks still work.
  function press(e, index) {
    if (disabled || e.button !== 0) return
    gesture = { index, pointer: e.pointerId, startY: e.clientY, dy: 0, started: false, target: null, rects: rowEls().map((el) => el.getBoundingClientRect()) }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
  }

  function move(e) {
    const g = gesture
    if (!g || e.pointerId !== g.pointer) return
    g.dy = e.clientY - g.startY
    if (Math.abs(g.dy) > 4) g.started = true
    if (!g.started) return
    e.preventDefault()
    // Where the dragged row's middle is now, among the others' middles.
    const middle = g.rects[g.index].top + g.rects[g.index].height / 2 + g.dy
    let target = g.index
    g.rects.forEach((rect, i) => {
      const center = rect.top + rect.height / 2
      if (i > g.index && middle > center) target = i
      if (i < g.index && middle < center) target = Math.min(target, i)
    })
    g.target = target
  }

  function release(e) {
    const g = gesture
    if (!g || e.pointerId !== g.pointer) return
    gesture = null
    if (g.started && g.target != null && g.target !== g.index) {
      const list = (items ?? []).slice()
      const [item] = list.splice(g.index, 1)
      list.splice(g.target, 0, item)
      commitOrder(list, item, g.index, g.target)
      announce(words.dropped(nameOf(item), place(g.target, list.length)))
    }
    // A drag isn't a click on the row.
    suppressClick = g.started
  }

  function clicked(e) {
    if (suppressClick) {
      e.stopPropagation()
      e.preventDefault()
    }
    suppressClick = false
  }

  const gapOf = (g) => (g.rects.length > 1 ? Math.max(0, g.rects[1].top - g.rects[0].bottom) : 0)

  // The offset a row is drawn at during a pointer drag: the dragged one
  // follows the pointer, the ones it passed make room.
  function offsetOf(index) {
    const g = gesture
    if (!g?.started) return 0
    if (index === g.index) return g.dy
    const size = g.rects[g.index].height + gapOf(g)
    const target = g.target ?? g.index
    if (index > g.index && index <= target) return -size
    if (index < g.index && index >= target) return size
    return 0
  }

  // Keyboard: Space picks up and drops, arrows move, Escape cancels.
  function keydown(e, index) {
    if (disabled) return
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (picked == null) {
        picked = from = index
        working = (items ?? []).slice()
        announce(words.pickedUp(nameOf(working[index]), place(index, working.length)))
      } else {
        const list = working
        const item = list[picked]
        const to = picked
        working = picked = null
        if (to !== from) commitOrder(list, item, from, to)
        announce(words.dropped(nameOf(item), place(to, list.length)))
      }
      return
    }
    if (picked == null) return
    if (e.key === 'Escape') {
      e.preventDefault()
      const item = working[picked]
      working = picked = null
      announce(words.cancelled(nameOf(item), place(from, (items ?? []).length)))
      return
    }
    const step = { ArrowUp: -1, ArrowDown: 1 }[e.key]
    if (!step) return
    e.preventDefault()
    const to = Math.max(0, Math.min(working.length - 1, picked + step))
    if (to === picked) return
    const list = working.slice()
    const [item] = list.splice(picked, 1)
    list.splice(to, 0, item)
    working = list
    picked = to
    announce(words.movedTo(nameOf(item), place(to, list.length)))
    refocus()
  }

  // The picked-up row moved in the DOM, which drops focus; put it back.
  async function refocus() {
    await tick()
    if (picked == null) return
    const row = rowEls()[picked]
    const target = handle ? row?.querySelector('[data-part=handle]') : row
    if (target && document.activeElement !== target) target.focus()
  }
</script>

<div {...rest} {...part('root')} class={cx(className)} data-variant={variant} data-disabled={disabled || undefined}>
  <ul {...part('list')} bind:this={listEl} aria-label={label}>
    {#each rows as row, index (keyOf(row))}
      {@const mine = index === dragging}
      {@const offset = offsetOf(index)}
      {@const whole = !handle && !disabled}
      <li {...part('item')} data-dragging={mine || undefined} data-shifting={(gesture?.started && !mine) || undefined}
        style:transform={offset ? `translateY(${offset}px)` : undefined}
        role={whole ? 'button' : undefined} tabindex={whole ? 0 : undefined}
        aria-describedby={whole ? `${id}-help` : undefined} aria-pressed={whole ? String(mine && picked != null) : undefined}
        onpointerdown={handle ? undefined : (e) => press(e, index)} onpointermove={move} onpointerup={release} onpointercancel={() => (gesture = null)}
        onclickcapture={clicked} onkeydown={handle ? undefined : (e) => keydown(e, index)}>
        {#if handle && !disabled}
          <button {...part('handle')} type="button" aria-label={words.handle} aria-describedby="{id}-help" aria-pressed={String(mine && picked != null)}
            onpointerdown={(e) => press(e, index)} onkeydown={(e) => keydown(e, index)}>
            <iconify-icon icon="lucide:grip-vertical" aria-hidden="true"></iconify-icon>
          </button>
        {/if}
        <div {...part('content')}>
          {#if itemSnippet}{@render itemSnippet(row, { index, dragging: mine })}{:else}{nameOf(row)}{/if}
        </div>
      </li>
    {/each}
  </ul>
  <p {...part('sr-only')} id="{id}-help">{words.instructions}</p>
  <div {...part('sr-only')} aria-live="assertive" role="status">{status}</div>
</div>
