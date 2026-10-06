<!--
  A checkbox with its label.

  <Checkbox bind:checked={agreed}>I agree to the terms</Checkbox>

  - `checked`: bindable; true, false or 'indeterminate'
  - `label`: its text (or children, for richer content)
  - `labelHidden`: keep the label for assistive tech only (a table's row checkbox)
  - `name`, `value`: for plain form posts
  - `disabled`
-->
<script>
  import * as checkbox from '@zag-js/checkbox'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './checkbox.css'

  let {
    checked = $bindable(false), label = null, labelHidden = false, name = null, value = 'on', disabled = false,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('checkbox', () => classes)
  const id = $props.id()
  const service = useMachine(checkbox.machine, () => ({
    id, name, value, disabled, checked,
    invalid: !!field?.invalid,
    onCheckedChange: (details) => { checked = details.checked },
  }))
  const api = $derived(checkbox.connect(service, normalizeProps))
</script>

<label {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  <div {...part('control')} {...api.getControlProps()}>
    <span {...part('indicator')} {...api.getIndicatorProps()}>
      <iconify-icon icon={api.checked === 'indeterminate' ? 'lucide:minus' : 'lucide:check'} aria-hidden="true"></iconify-icon>
    </span>
  </div>
  {#if label || children}
    <span {...part('label')} {...api.getLabelProps()} data-hidden={labelHidden || undefined}>{#if children}{@render children()}{:else}{label}{/if}</span>
  {/if}
  <input {...api.getHiddenInputProps()} {...fieldAttrs(field)} />
</label>
