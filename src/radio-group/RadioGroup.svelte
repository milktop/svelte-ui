<!--
  A group of radio buttons: pick one.

  <RadioGroup label="Lesson length" items={['30 min', '45 min', '60 min']} bind:value={length} />

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`; `description`)
  - `value`: bindable; the item's own value
  - `label`: a label above it (skipped inside a Field)
  - `orientation`: 'vertical' or 'horizontal'
  - `variant`: 'list' (default), or 'cards': each option a bordered card
    (with its `description`, and an `icon` from the item), chosen one outlined
  - `name`: for plain form posts
-->
<script>
  import * as radio from '@zag-js/radio-group'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import '../icons.js'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './radio-group.css'

  let {
    label = null, items = [], value = $bindable(null), orientation = 'vertical', variant = 'list', name = null, disabled = false,
    labelKey = 'label', valueKey = 'value', disabledKey = 'disabled',
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('radio-group', () => classes)
  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)
  const itemProps = (item) => ({ value: String(valueOf(item)), disabled: typeof item === 'object' && !!item[disabledKey] })

  const id = $props.id()
  const service = useMachine(radio.machine, () => ({
    id, name, disabled, orientation,
    invalid: !!field?.invalid,
    ids: field ? { label: field.labelId } : undefined,
    value: value == null ? null : String(value),
    onValueChange: (details) => {
      const item = items.find((item) => String(valueOf(item)) === details.value)
      value = item === undefined ? null : valueOf(item)
    },
  }))
  const api = $derived(radio.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} class={cx(className)} data-variant={variant}>
  {#if label && !field}<span {...part('label')} {...api.getLabelProps()}>{label}</span>{/if}
  <div {...part('group')} {...api.getRootProps()} {...fieldAttrs(field)}>
    {#each items as item (valueOf(item))}
      <label {...part('item')} {...api.getItemProps(itemProps(item))}>
        <span {...part('control')} {...api.getItemControlProps(itemProps(item))}></span>
        {#if item?.icon}<iconify-icon {...part('icon')} icon={item.icon} aria-hidden="true"></iconify-icon>{/if}
        <span {...part('text')}>
          <span {...part('item-text')} {...api.getItemTextProps(itemProps(item))}>{labelOf(item)}</span>
          {#if item?.description}<span {...part('description')}>{item.description}</span>{/if}
        </span>
        <input {...api.getItemHiddenInputProps(itemProps(item))} />
      </label>
    {/each}
  </div>
</div>
