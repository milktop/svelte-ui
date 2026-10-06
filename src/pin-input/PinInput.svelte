<!--
  A code input: one box per character, for verification codes and PINs.

  <PinInput label="Code" count={6} bind:value={code} oncomplete={verify} />

  - `value`: bindable string
  - `count`: how many boxes (4)
  - `type`: 'numeric', 'alphabetic' or 'alphanumeric'
  - `mask`: hide the characters, like a password
  - `otp`: offer one-time codes from the keyboard (autocomplete="one-time-code")
  - `oncomplete`: called with the value once every box is filled
  - `name`: for plain form posts
-->
<script>
  import * as pinInput from '@zag-js/pin-input'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './pin-input.css'

  let {
    label = null, value = $bindable(''), count = 4, type = 'numeric', mask = false, otp = false,
    placeholder = '', oncomplete = null, name = null, disabled = false,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('pin-input', () => classes)
  const id = $props.id()
  const service = useMachine(pinInput.machine, () => ({
    id, name, disabled, count, type, mask, otp, placeholder,
    invalid: !!field?.invalid,
    // Inside a Field, its label points at the first box.
    ids: field ? { label: field.labelId, input: (i) => (i === '0' ? field.id : `${id}-box-${i}`) } : undefined,
    value: value.split('').slice(0, count),
    onValueChange: (details) => { value = details.valueAsString },
    onValueComplete: (details) => oncomplete?.(details.valueAsString),
  }))
  const api = $derived(pinInput.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    {#each Array.from({ length: count }) as _, index}
      <input {...part('box')} {...api.getInputProps({ index })} {...fieldAttrs(field)} />
    {/each}
  </div>
  <input {...api.getHiddenInputProps()} />
</div>
