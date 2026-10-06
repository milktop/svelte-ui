<!--
  A group of checkboxes, bound to the array of checked values.

  <CheckboxGroup label="Subjects" items={['Maths', 'Physics', 'Chemistry']} bind:value={subjects} selectAll="All subjects" />

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`)
  - `value`: bindable array of the checked items' own values, in item order
  - `selectAll`: label for a parent checkbox that selects all or none, and is
    indeterminate when only some are (disabled items keep their state)
  - `label`: a label above it (skipped inside a Field)
  - `orientation`: 'vertical' or 'horizontal'
  - `name`: each checkbox posts its value with plain forms

  Shift-clicking a checkbox ticks (or clears) every item between it and the
  last one clicked, as in mail and file lists.
-->
<script>
  import Checkbox from './Checkbox.svelte'
  import { cx, partsOf, useField } from '../utils.js'
  import '../theme.css'
  import './checkbox.css'

  let {
    items = [], value = $bindable([]), label = null, selectAll = null, orientation = 'vertical',
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled', name = null, disabled = false,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('checkbox-group', () => classes)
  const id = $props.id()
  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)
  const isSelected = (item) => (value ?? []).includes(valueOf(item))
  const isLocked = (item) => disabled || (typeof item === 'object' && !!item[disabledKey])
  const select = (list) => (value = list.map(valueOf))

  // Checkbox changes don't carry the Shift key, so it's noted on the way in
  // (Shift+mousedown would also select the labels' text between).
  let shift = false
  let anchor = null
  function noteShift(e) {
    shift = e.shiftKey
    if (e.shiftKey && e.type === 'mousedown') e.preventDefault()
  }

  function toggle(item, checked) {
    const index = items.indexOf(item)
    const from = anchor
    anchor = index
    if (shift && from != null && from !== index && items[from]) {
      const [lo, hi] = [Math.min(from, index), Math.max(from, index)]
      return select(items.filter((it, n) => (n >= lo && n <= hi && !isLocked(it) ? checked : isSelected(it))))
    }
    select(items.filter((it) => (it === item ? checked : isSelected(it))))
  }

  const toggleAll = (checked) => select(items.filter((it) => (isLocked(it) ? isSelected(it) : checked)))

  // The select-all box: checked when every enabled item is, indeterminate when only some are.
  const allState = $derived.by(() => {
    const open = items.filter((it) => !isLocked(it))
    const on = open.filter(isSelected).length
    return on === 0 ? false : on === open.length ? true : 'indeterminate'
  })
</script>

<div {...rest} {...part('root')} class={cx(className)} role="group"
  aria-labelledby={field ? field.labelId : label ? `${id}-label` : undefined} aria-describedby={field?.describedBy}>
  {#if label && !field}<span {...part('label')} id="{id}-label">{label}</span>{/if}
  {#if selectAll}
    <Checkbox label={selectAll} {disabled} bind:checked={() => allState, (checked) => toggleAll(checked === true)} />
  {/if}
  <div {...part('items')} data-orientation={orientation} data-indented={selectAll ? '' : undefined}
    onpointerdowncapture={noteShift} onmousedowncapture={noteShift} onkeydowncapture={noteShift}>
    {#each items as item (valueOf(item))}
      <Checkbox label={labelOf(item)} {name} value={String(valueOf(item))} disabled={isLocked(item)}
        bind:checked={() => isSelected(item), (checked) => toggle(item, checked === true)} />
    {/each}
  </div>
</div>
