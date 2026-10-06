<!--
  A number input with step buttons; arrow keys step too (Shift for 10).

  <NumberInput label="Hourly rate" bind:value={rate} min={0} step={5} prefix="£" />

  - `value`: bindable number, or null when empty
  - `min`, `max`, `step`
  - `prefix`, `suffix`: text before or after it ('£', 'kg'); `icon`: an Iconify name before it
  - `formatOptions`: Intl.NumberFormat options, e.g. { style: 'currency', currency: 'GBP' }, with `locale`
  - `allowMouseWheel`: scroll over the focused input to step
  - `steppers`: false to hide the buttons
  - `name`: for plain form posts
-->
<script>
  import * as numberInput from '@zag-js/number-input'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './number-input.css'

  let {
    label = null, value = $bindable(null), min = undefined, max = undefined, step = 1, prefix = null, suffix = null,
    icon = null, formatOptions = undefined, locale = undefined, allowMouseWheel = false, steppers = true, placeholder = '', name = null, disabled = false,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('number-input', () => classes)

  // Zag works on the text ('1.', '' while typing); `value` is its number.
  let text = $state(value == null ? '' : String(value))
  $effect(() => {
    const number = text === '' ? null : Number(text)
    if (value !== number && !(Number.isNaN(number) && value == null)) text = value == null ? '' : String(value)
  })

  const id = $props.id()
  const service = useMachine(numberInput.machine, () => ({
    id, name, disabled, min, max, step, formatOptions, locale, allowMouseWheel,
    invalid: !!field?.invalid,
    ids: field ? { input: field.id, label: field.labelId } : undefined,
    value: text,
    onValueChange: (details) => {
      text = details.value
      value = Number.isNaN(details.valueAsNumber) ? null : details.valueAsNumber
    },
  }))
  const api = $derived(numberInput.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>
    {:else if prefix}<span {...part('prefix')}>{prefix}</span>{/if}
    <input {...part('input')} {...api.getInputProps()} {placeholder} {...fieldAttrs(field)} />
    {#if suffix}<span {...part('suffix')}>{suffix}</span>{/if}
    {#if steppers}
      <button {...part('decrement')} {...api.getDecrementTriggerProps()}><iconify-icon icon="lucide:minus"></iconify-icon></button>
      <button {...part('increment')} {...api.getIncrementTriggerProps()}><iconify-icon icon="lucide:plus"></iconify-icon></button>
    {/if}
  </div>
</div>
