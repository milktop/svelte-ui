<!--
  The browser's own select, styled like our inputs: the phone's own picker,
  long lists without search, and plain form posts.

  <NativeSelect label="Species" items={['Dog', 'Cat', 'Rabbit']} bind:value={species} />

  Inside a Field it takes the field's label, hint and error.

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`;
    a `group` puts them under that heading)
  - `value`: bindable; the item's own value
  - `placeholder`: an empty first option (it can be chosen to clear it)
  - `label`: a label above it (skipped inside a Field); `size`: 'sm', 'md' or 'lg'
  - `name`, `required`, `disabled`: as on a <select>
-->
<script>
  import '../icons.js'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './native-select.css'

  let {
    items = [], value = $bindable(null), placeholder = null, label = null, labelKey = 'label', valueKey = 'value',
    disabledKey = 'disabled', size = 'md', class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('native-select', () => classes)
  const ownId = $props.id()
  const id = $derived(field?.id ?? `${ownId}-select`)

  const isObject = (item) => typeof item === 'object' && item !== null
  const labelOf = (item) => String(isObject(item) ? item[labelKey] : item)
  const valueOf = (item) => (isObject(item) ? item[valueKey] : item)
  const groupOf = (item) => (isObject(item) ? item.group : undefined)
  // Grouped items under their headings, in order of first appearance.
  const groups = $derived([...new Set(items.map(groupOf))])

  // <select> values are strings: map back to the item's own.
  function change(e) {
    const item = items.find((i) => String(valueOf(i)) === e.currentTarget.value)
    value = item === undefined ? null : valueOf(item)
  }
</script>

{#snippet option(item)}
  <option value={String(valueOf(item))} disabled={isObject(item) && !!item[disabledKey]}>{labelOf(item)}</option>
{/snippet}

<div {...part('root')} class={cx(className)} data-size={size}>
  {#if label && !field}<label {...part('label')} for={id}>{label}</label>{/if}
  <div {...part('control')}>
    <select {...rest} {...part('select')} {id} value={value == null ? '' : String(value)} onchange={(e) => { rest.onchange?.(e); change(e) }} {...fieldAttrs(field)}>
      {#if placeholder !== null}<option value="">{placeholder}</option>{/if}
      {#if groups.length > 1 || groups[0]}
        {#each groups as group}
          {#if group}
            <optgroup label={group}>{#each items.filter((i) => groupOf(i) === group) as item}{@render option(item)}{/each}</optgroup>
          {:else}
            {#each items.filter((i) => !groupOf(i)) as item}{@render option(item)}{/each}
          {/if}
        {/each}
      {:else}
        {#each items as item}{@render option(item)}{/each}
      {/if}
    </select>
    <iconify-icon {...part('indicator')} icon="lucide:chevron-down" aria-hidden="true"></iconify-icon>
  </div>
</div>
