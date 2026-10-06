<!--
  A segmented control: a row of options, one picked, with a sliding indicator.

  <Segmented items={['Day', 'Week', 'Month']} bind:value={view} />
  <Segmented items={[{ value: 'grid', label: 'Grid', icon: 'lucide:grid-2x2' }]} iconOnly />

  - `items`: strings, or objects (see `labelKey`, `valueKey`, `disabledKey`; `icon`)
  - `value`: bindable; the item's own value
  - `label`: a label above it (skipped inside a Field)
  - `iconOnly`: just the icons (each keeps its label for assistive tech)
  - `tooltips`: each item's label (or its own `tooltip`) in a tooltip on
    hover and keyboard focus; on by default with `iconOnly`
  - `size`: 'sm', 'md' or 'lg'
  - `name`: for plain form posts
-->
<script>
  import * as radio from '@zag-js/radio-group'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import Tooltip from '../tooltip/Tooltip.svelte'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './segmented.css'

  let {
    label = null, items = [], value = $bindable(null), labelKey = 'label', valueKey = 'value', disabledKey = 'disabled',
    iconOnly = false, tooltips = null, size = 'md', name = null, disabled = false,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  // Zag's radio group stamps data-scope="radio-group"; ours goes last, so
  // RadioGroup's styles don't apply here.
  const part = partsOf('segmented', () => classes)
  const labelOf = (item) => (typeof item === 'object' ? item[labelKey] : String(item))
  const valueOf = (item) => (typeof item === 'object' ? item[valueKey] : item)
  const itemProps = (item) => ({ value: String(valueOf(item)), disabled: typeof item === 'object' && !!item[disabledKey] })

  const id = $props.id()
  const service = useMachine(radio.machine, () => ({
    id, name, disabled, orientation: 'horizontal',
    invalid: !!field?.invalid,
    ids: field ? { label: field.labelId } : undefined,
    value: value == null ? null : String(value),
    // Zag's values are strings; map them back to the items' own.
    onValueChange: (details) => {
      const item = items.find((item) => String(valueOf(item)) === details.value)
      value = item === undefined ? null : valueOf(item)
    },
  }))
  const api = $derived(radio.connect(service, normalizeProps))

  const withTooltips = $derived(tooltips ?? iconOnly)
  // The focusable element is the hidden radio, so keyboard focus opens its
  // tooltip by hand (pointer focus doesn't).
  let tipOpen = $state({})
  const tipFor = (item) => (typeof item === 'object' && item.tooltip) || labelOf(item)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-size={size}>
  {#if label && !field}<span {...api.getLabelProps()} {...part('label')}>{label}</span>{/if}
  <div {...api.getRootProps()} {...part('group')} {...fieldAttrs(field)}>
    <span {...api.getIndicatorProps()} {...part('indicator')}></span>
    {#each items as item (valueOf(item))}
      {@const key = String(valueOf(item))}
      {@const input = api.getItemHiddenInputProps(itemProps(item))}
      <label {...api.getItemProps(itemProps(item))} {...part('item')} data-icon-only={iconOnly || undefined}>
        <span {...api.getItemTextProps(itemProps(item))} {...part('item-text')}>
          {#if item?.icon}<iconify-icon {...part('item-icon')} icon={item.icon} aria-hidden="true"></iconify-icon>{/if}
          {#if iconOnly}<span {...part('sr-only')}>{labelOf(item)}</span>{:else}{labelOf(item)}{/if}
        </span>
        {#if withTooltips}
          <!-- Zag's tooltip props go on a layer over the item, since the item's own are Zag's radio's. -->
          <Tooltip content={tipFor(item)} bind:open={() => !!tipOpen[key], (v) => (tipOpen[key] = v)}>
            {#snippet trigger(props)}<span {...props} {...part('tooltip-target')}></span>{/snippet}
          </Tooltip>
        {/if}
        <input {...input}
          onfocus={(e) => { input.onfocus?.(e); if (withTooltips && e.target.matches(':focus-visible')) tipOpen[key] = true }}
          onblur={(e) => { input.onblur?.(e); tipOpen[key] = false }} />
      </label>
    {/each}
  </div>
</div>
