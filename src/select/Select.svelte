<!--
  A select: pick from a list. A button that opens it, or, with `searchable`,
  `load` or `oncreate`, an input you type into to filter it.

  <Select label="Level" items={['GCSE', 'A Level']} bind:value={level} />
  <Select label="Student" items={students} labelKey="name" valueKey="id" searchable bind:value={studentId} />
  <Select label="City" load={searchCities} labelKey="name" valueKey="id" bind:value={cityId} />
  <Select label="Topics" items={topics} multiple oncreate={addTopic} bind:value={picked} />

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`)
  - `value`: bindable; the item's own value, or an array of them with `multiple`
  - `multiple`: pick several; picked items show ticked in the list
  - `tags`: with `multiple`, show the picks as tags in the box (always, when
    searchable); `variant` sets their look: 'subtle', 'accent' or 'outline'
  - `hideSelected`: with `multiple`, picked items leave the list
  - `searchable`: type to filter the list (labels starting with the text first)
  - `load`: async function(query) returning items, for server search; implies
    searchable (debounced by `debounce` ms, `loadingText` meanwhile)
  - `oncreate`: function(query) called when someone picks "Create …" for text
    that matches no item; implies searchable. Return the new item (or a
    promise of it) to select it, or handle it yourself
  - `deselectable`: clicking the picked item again clears it (without search)
  - `closeOnSelect`: close the list after a pick (on by default, except with `multiple`)
  - `clearable`: a button to clear it
  - `placeholder`, `emptyText` (when nothing matches)
  - `name`: for plain form posts
  - `size`: 'sm' or 'md'; `placement`: where the list opens ('bottom-start')
  - `item` snippet: an option's content, given the item
  - `create` snippet: the create option's content, given the query
  - `empty` snippet: shown when nothing matches, given the query
-->
<script>
  import ListSelect from './ListSelect.svelte'
  import SearchSelect from './SearchSelect.svelte'

  let {
    label = null, items = [], value = $bindable(null), placeholder = undefined,
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled',
    multiple = false, tags = false, variant = 'subtle', hideSelected = false,
    searchable = false, load = null, debounce = 200, loadingText = 'Loading…', oncreate = null,
    deselectable = false, closeOnSelect = undefined, clearable = false, emptyText = 'No matches',
    name = null, size = 'md', placement = 'bottom-start', disabled = false,
    item = null, create = null, empty = null, class: className = '', classes = {}, ...rest
  } = $props()

  const shared = $derived({
    label, items, placeholder, labelKey, valueKey, disabledKey, multiple, tags, variant, hideSelected,
    closeOnSelect, clearable, emptyText, name, size, placement, disabled, item, empty,
    class: className, classes, ...rest,
  })
</script>

{#if searchable || load || oncreate}
  <SearchSelect bind:value {...shared} {load} {debounce} {loadingText} {oncreate} {create} />
{:else}
  <ListSelect bind:value {...shared} {deselectable} />
{/if}
