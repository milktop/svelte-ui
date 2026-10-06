<!--
  A password input with a button to show or hide it. Other attributes go on
  the <input>.

  <PasswordInput label="Password" bind:value={password} autocomplete="new-password" />

  - `value`: bindable
  - `icon`: an Iconify name before it
  - `visible`: bindable; whether the password shows
-->
<script>
  import * as passwordInput from '@zag-js/password-input'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './password-input.css'

  let {
    label = null, value = $bindable(''), visible = $bindable(false), icon = null, disabled = false,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('password-input', () => classes)
  const id = $props.id()
  const service = useMachine(passwordInput.machine, () => ({
    id, disabled, visible,
    invalid: !!field?.invalid,
    ids: field ? { input: field.id } : undefined,
    onVisibilityChange: (details) => { visible = details.visible },
  }))
  const api = $derived(passwordInput.connect(service, normalizeProps))
</script>

<div {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
    <input {...part('input')} {...api.getInputProps()} bind:value {...rest} {...fieldAttrs(field)} />
    <button {...part('toggle')} {...api.getVisibilityTriggerProps()}>
      <iconify-icon icon={api.visible ? 'lucide:eye-off' : 'lucide:eye'} aria-hidden="true"></iconify-icon>
    </button>
  </div>
</div>
