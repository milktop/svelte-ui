<!--
  A data table: rows of objects, laid out by `columns`.

  <Table {columns} rows={students} selectable bind:selected={picked} bind:sort />

  const columns = [
    { key: 'name', label: 'Name', sortable: true, cell: studentCell },
    { key: 'year', label: 'Year', align: 'end', sortable: true },
    { key: 'fee', label: 'Fee', format: (v) => `£${v}` },
  ]

  - `rows`: plain objects, one per row
  - `columns`: what each column shows. `key`: the row property shown (and
    sorted by); `label`: the heading; `sortable`; `align`: 'start', 'center'
    or 'end'; `width`: any CSS width; `format(value, row)`: turns the value
    into text; `value(row)`: computes it instead of `row[key]`; `cell`: a
    snippet that renders the cell, given `{ row, column, value }`
  - `rowKey`: the property that identifies a row ('id')
  - `sort`: bindable `{ key, dir }`; sortable columns sort when their heading
    is clicked: ascending, descending, then off. With `manualSort` rows
    aren't sorted here: sort them yourself (`sortRows(list, columns, sort)`
    before paging, or on a server; see `onsortchange`)
  - `selectable`: a checkbox per row and a select-all; `selected` is the
    bindable list of the selected rows' keys. Shift-click a row's checkbox to
    tick (or clear) the rows between it and the last one clicked
  - `loading`: skeleton rows while there are none yet, else dims the rows
  - `emptyText`, or an `empty` snippet, for no rows
  - `maxHeight`: scrolls the rows under a sticky header
  - `label`: a caption for assistive tech
  - `size`: 'sm', 'md' (default) or 'lg' (roomier rows)
  - `flush`: no border or rounding, to sit edge to edge in a card
  - `onrowclick`: called with the row when a row is clicked (outside its controls)

  Or write the <table> yourself as its content, for the look alone (no
  sorting, selection or loading states); `data-align` on cells works too.
-->
<script module>
  // Numbers by value, everything else as text with numbers in order
  // ("Year 2" before "Year 10"); empty values last.
  function compare(a, b) {
    if (a == b) return 0
    if (a == null || a === '') return 1
    if (b == null || b === '') return -1
    if (typeof a === 'number' && typeof b === 'number') return a - b
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
  }

  export const cellValue = (row, column) => (column.value ? column.value(row) : row[column.key])

  // A copy of `list` in `sort`'s order. With paging, sort the whole list with
  // this (and set `manualSort`), then hand the table one page.
  export function sortRows(list, columns, sort) {
    const column = sort && columns.find((c) => c.key === sort.key)
    if (!column) return list ?? []
    const dir = sort.dir === 'desc' ? -1 : 1
    return [...(list ?? [])].sort((a, b) => compare(cellValue(a, column), cellValue(b, column)) * dir)
  }
</script>

<script>
  import 'iconify-icon'
  import Checkbox from '../checkbox/Checkbox.svelte'
  import Skeleton from '../skeleton/Skeleton.svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './table.css'

  let {
    columns = [], rows = [], rowKey = 'id', selectable = false, selected = $bindable([]), sort = $bindable(null),
    manualSort = false, loading = false, loadingRows = 5, emptyText = 'Nothing here yet', maxHeight = null, label = null,
    size = 'md', flush = false, onrowclick = null, onsortchange = null, empty = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('table', () => classes)
  const keyOf = (row) => row[rowKey]
  const display = (row, column) => {
    const value = cellValue(row, column)
    return column.format ? column.format(value, row) : (value ?? '')
  }
  const sortedRows = $derived(manualSort ? (rows ?? []) : sortRows(rows, columns, sort))

  const sortDir = (column) => (sort && sort.key === column.key ? sort.dir : null)
  function toggleSort(column) {
    const current = sortDir(column)
    sort = current == null ? { key: column.key, dir: 'asc' } : current === 'asc' ? { key: column.key, dir: 'desc' } : null
    onsortchange?.(sort)
  }
  const ariaSort = (column) => (column.sortable ? ({ asc: 'ascending', desc: 'descending' }[sortDir(column)] ?? 'none') : undefined)

  const isSelected = (row) => (selected ?? []).includes(keyOf(row))
  const allState = $derived.by(() => {
    const count = (rows ?? []).filter(isSelected).length
    return count === 0 ? false : count === rows.length ? true : 'indeterminate'
  })

  // Change events don't carry the Shift key, so it's noted on the way in;
  // Shift+mousedown would also select the text between.
  let shift = false
  let anchorKey = null
  function noteShift(e) {
    shift = e.shiftKey
    if (e.shiftKey && e.type === 'mousedown' && e.target.closest('[data-part=select-cell]')) e.preventDefault()
  }

  function toggleRow(row, on) {
    const list = sortedRows
    const index = list.indexOf(row)
    const anchor = list.findIndex((r) => keyOf(r) === anchorKey)
    anchorKey = keyOf(row)
    // With Shift, every row from the last one clicked to this one.
    const range = shift && anchor >= 0 && anchor !== index ? list.slice(Math.min(anchor, index), Math.max(anchor, index) + 1) : [row]
    const keys = range.map(keyOf)
    const others = (selected ?? []).filter((key) => !keys.includes(key))
    selected = on ? [...others, ...keys] : others
  }

  function toggleAll(on) {
    const keys = (rows ?? []).map(keyOf)
    const others = (selected ?? []).filter((key) => !keys.includes(key))
    selected = on ? [...others, ...keys] : others
  }

  function rowClicked(e, row) {
    if (e.target.closest('a, button, input, label, select, textarea, [data-scope]:not([data-scope=table])')) return
    onrowclick?.(row)
  }

  const columnCount = $derived(columns.length + (selectable ? 1 : 0))
</script>

<div {...rest} {...part('root')} class={cx(className)} data-size={size} data-flush={flush || undefined}
  data-loading={(loading && rows.length > 0) || undefined}>
  <div {...part('scroll')} data-sticky={maxHeight ? '' : undefined} style:max-height={maxHeight}>
    {#if !columns?.length}
      {@render children?.()}
    {:else}
      <table {...part('table')} aria-busy={String(!!loading)}>
        {#if label}<caption {...part('caption')}>{label}</caption>{/if}
        <thead>
          <tr>
            {#if selectable}
              <th {...part('select-cell')} scope="col">
                <Checkbox label="Select all rows" labelHidden disabled={!rows.length}
                  bind:checked={() => allState, (on) => toggleAll(on === true)} />
              </th>
            {/if}
            {#each columns as column}
              <th scope="col" data-align={column.align ?? 'start'} aria-sort={ariaSort(column)} style:width={column.width}>
                {#if column.sortable}
                  <button {...part('sort')} type="button" data-dir={sortDir(column) ?? undefined} onclick={() => toggleSort(column)}>
                    <span>{column.label}</span>
                    <span {...part('sort-icon')}><iconify-icon
                      icon={sortDir(column) === 'asc' ? 'lucide:chevron-up' : sortDir(column) === 'desc' ? 'lucide:chevron-down' : 'lucide:chevrons-up-down'}></iconify-icon></span>
                  </button>
                {:else}{column.label}{/if}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody onpointerdowncapture={noteShift} onmousedowncapture={noteShift} onkeydowncapture={noteShift}>
          {#if loading && !rows.length}
            {#each { length: loadingRows }}
              <tr>
                {#if selectable}<td {...part('select-cell')}></td>{/if}
                {#each columns as _}<td><Skeleton height="0.75rem" width="60%" /></td>{/each}
              </tr>
            {/each}
          {:else if !rows.length}
            <tr><td {...part('empty')} colspan={columnCount}>{#if empty}{@render empty()}{:else}{emptyText}{/if}</td></tr>
          {:else}
            {#each sortedRows as row (keyOf(row))}
              <tr {...part('row')} data-selected={isSelected(row) || undefined} aria-selected={selectable ? String(isSelected(row)) : undefined}
                onclick={(e) => rowClicked(e, row)}>
                {#if selectable}
                  <td {...part('select-cell')}>
                    <Checkbox label="Select {display(row, columns[0])}" labelHidden
                      bind:checked={() => isSelected(row), (on) => toggleRow(row, on === true)} />
                  </td>
                {/if}
                {#each columns as column}
                  <td data-align={column.align ?? 'start'}>
                    {#if column.cell}{@render column.cell({ row, column, value: cellValue(row, column) })}{:else}{display(row, column)}{/if}
                  </td>
                {/each}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    {/if}
  </div>
</div>
