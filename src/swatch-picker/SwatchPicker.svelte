<!--
  A colour from a few swatches, e.g. a tutor's colour on the calendar. Arrow
  keys move between them, like radio buttons (which they are).

  <SwatchPicker label="Colour" bind:value={color} />
  <SwatchPicker items={[{ value: 'brand', color: '#e11d48', label: 'Brand' }]} bind:value={color} />
  <SwatchPicker variant="popover" bind:value={color} />

  - `items`: colour names from `swatches`, or `{ value, color, label }`
    (by default every colour in `swatches`); the value is the name, or yours
  - `value`: bindable; the chosen value
  - `label`: a label above it (skipped inside a Field, which labels it)
  - `size`: 'sm', 'md' (default) or 'lg'
  - `variant`: 'inline' (default: the swatches in the page) or 'popover': a
    field showing the chosen colour and its name, opening the swatches
    (closed once one's chosen)
  - `placeholder`: what the popover's field shows while none is chosen
  - `name`: the hidden radios post with plain forms
-->
<script>
  import * as radio from '@zag-js/radio-group'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import '../icons.js'
  import Popover from '../popover/Popover.svelte'
  import { swatches } from './swatches.js'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './swatch-picker.css'

  let {
    items = Object.keys(swatches), value = $bindable(null), label = null, size = 'md', variant = 'inline', placeholder = null,
    name = null, disabled = false, class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('swatch-picker', () => classes)
  const id = $props.id()
  let open = $state(false)

  const capital = (name) => name.charAt(0).toUpperCase() + name.slice(1)
  const list = $derived((items ?? []).map((item) => typeof item === 'string'
    ? { value: item, color: swatches[item] ?? item, label: uiLocale.messages.swatchPicker.colors[item] ?? capital(item) }
    : item))
  const chosen = $derived(list.find((swatch) => swatch.value === value))
  const popover = $derived(variant === 'popover')
  const labelledBy = $derived(field ? field.labelId : label ? `${id}-label` : undefined)

  const service = useMachine(radio.machine, () => ({
    id, name, disabled, orientation: 'horizontal',
    invalid: !!field?.invalid,
    ids: field ? { label: field.labelId } : undefined,
    value: value == null ? null : String(value),
    onValueChange: (details) => {
      value = details.value
      open = false
    },
  }))
  const api = $derived(radio.connect(service, normalizeProps))
</script>

<!-- Zag's radio group runs it, under its own scope: our parts go last. -->
{#snippet grid()}
  <div {...(popover ? {} : rest)} {...api.getRootProps()} {...part('root')} class={popover ? undefined : cx(className)}
    data-size={size} data-variant={variant} {...fieldAttrs(field)} aria-labelledby={popover ? labelledBy : api.getRootProps()['aria-labelledby']}>
    {#if label && !field && !popover}<span {...api.getLabelProps()} {...part('label')}>{label}</span>{/if}
    <div {...part('items')}>
      {#each list as swatch (swatch.value)}
        <label {...api.getItemProps({ value: swatch.value })} {...part('item')} title={swatch.label ?? swatch.value} style:--swatch={swatch.color}>
          <span {...api.getItemControlProps({ value: swatch.value })} {...part('swatch')}><iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon></span>
          <span {...api.getItemTextProps({ value: swatch.value })} {...part('item-text')}>{swatch.label ?? swatch.value}</span>
          <input {...api.getItemHiddenInputProps({ value: swatch.value })} />
        </label>
      {/each}
    </div>
  </div>
{/snippet}

{#if popover}
  <!-- A field (like an input) showing the colour, opening the swatches. -->
  <div {...rest} {...part('field')} class={cx(className)} data-size={size}>
    {#if label && !field}<span {...part('label')} id="{id}-label">{label}</span>{/if}
    <Popover placement="bottom-start" bind:open data-swatches="">
      {#snippet trigger(props)}
        <button {...props} {...part('trigger')} type="button" {disabled}
          aria-labelledby={labelledBy ? `${labelledBy} ${id}-value` : undefined} aria-invalid={field?.invalid || undefined}>
          <span {...part('chip')} style:--swatch={chosen?.color ?? 'transparent'} data-empty={!chosen || undefined}></span>
          <span {...part('value')} id="{id}-value" data-placeholder={!chosen || undefined}>{chosen ? chosen.label ?? chosen.value : placeholder ?? uiLocale.messages.swatchPicker.placeholder}</span>
          <iconify-icon {...part('indicator')} icon="lucide:chevron-down" aria-hidden="true"></iconify-icon>
        </button>
      {/snippet}
      {@render grid()}
    </Popover>
  </div>
{:else}
  {@render grid()}
{/if}
