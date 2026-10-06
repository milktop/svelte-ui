<!--
  A group of checkboxes, bound to the array of checked values.

  <CheckboxGroup label="Subjects" items={['Maths', 'Physics', 'Chemistry']} bind:value={subjects} />

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`)
  - `value`: bindable array of the checked items' own values
  - `label`: a label above it (skipped inside a Field)
  - `orientation`: 'vertical' or 'horizontal'
-->
<script>
  import Checkbox from './Checkbox.svelte'
  import { cx, partsOf, useField } from '../utils.js'
  import '../theme.css'
  import './checkbox.css'

  let {
    items = [], value = $bindable([]), label = null, orientation = 'vertical',
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled', name = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('checkbox-group', () => classes)
  const id = $props.id()
  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)
</script>

<div {...rest} {...part('root')} class={cx(className)} role="group"
  aria-labelledby={field ? field.labelId : label ? `${id}-label` : undefined}>
  {#if label && !field}<span {...part('label')} id="{id}-label">{label}</span>{/if}
  <div {...part('items')} data-orientation={orientation}>
    {#each items as item (valueOf(item))}
      <Checkbox label={labelOf(item)} {name} value={String(valueOf(item))} disabled={typeof item === 'object' && !!item[disabledKey]}
        bind:checked={() => value.includes(valueOf(item)),
          (on) => (value = on ? [...value, valueOf(item)] : value.filter((v) => v !== valueOf(item)))} />
    {/each}
  </div>
</div>
