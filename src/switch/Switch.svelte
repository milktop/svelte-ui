<!--
  An on/off switch with its label.

  <Switch bind:checked={reminders}>Email reminders</Switch>

  - `checked`: bindable
  - `label`: its text (or children)
  - `name`, `value`: for plain form posts
  - `disabled`
-->
<script>
  import * as zagSwitch from '@zag-js/switch'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './switch.css'

  let {
    checked = $bindable(false), label = null, name = null, value = 'on', disabled = false,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('switch', () => classes)
  const id = $props.id()
  const service = useMachine(zagSwitch.machine, () => ({
    id, name, value, disabled, checked,
    invalid: !!field?.invalid,
    onCheckedChange: (details) => { checked = details.checked },
  }))
  const api = $derived(zagSwitch.connect(service, normalizeProps))
</script>

<label {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  <span {...part('control')} {...api.getControlProps()}><span {...part('thumb')} {...api.getThumbProps()}></span></span>
  {#if label || children}
    <span {...part('label')} {...api.getLabelProps()}>{#if children}{@render children()}{:else}{label}{/if}</span>
  {/if}
  <input {...api.getHiddenInputProps()} {...fieldAttrs(field)} />
</label>
