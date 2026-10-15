<!--
  Text you click to edit in place, e.g. a pet's name or a price on a details
  page. It reads as text until clicked; Enter saves and Escape cancels.

  <Editable bind:value={pet.name} onchange={save} />

  - `value`: bindable; updated once an edit is saved (not on each key)
  - `onchange`: called with the text once an edit is saved, if it changed
  - `placeholder`: shown when it's empty
  - `label`: a label above it (skipped inside a Field, which labels it)
  - `activationMode`: 'click' (default), 'dblclick' or 'focus'
  - `controls`: ✓ and ✕ buttons while editing, a pencil otherwise (true)
  - `submitMode`: 'both' (default: Enter or leaving the box saves), 'enter',
    'blur' or 'none'
  - `maxLength`, `disabled`, `readOnly`
-->
<script>
  import * as editable from '@zag-js/editable'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { untrack } from 'svelte'
  import '../icons.js'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './editable.css'

  let {
    value = $bindable(''), label = null, placeholder = null, activationMode = 'click', submitMode = 'both', controls = true,
    maxLength = null, disabled = false, readOnly = false, onchange = null, class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('editable', () => classes)
  const id = $props.id()
  const initial = untrack(() => String(value ?? ''))
  const service = useMachine(editable.machine, () => ({
    id, defaultValue: initial, activationMode, submitMode, disabled, readOnly,
    ...(placeholder != null && { placeholder }),
    ...(maxLength != null && { maxLength }),
    ...(uiLocale.zag('editable') && { translations: uiLocale.zag('editable') }),
    invalid: !!field?.invalid,
    ids: field ? { input: field.id, label: field.labelId } : undefined,
    onValueCommit: (details) => {
      if (details.value === String(value ?? '')) return
      value = details.value
      onchange?.(details.value)
    },
  }))
  const api = $derived(editable.connect(service, normalizeProps))

  // A new value from outside shows when it isn't being edited.
  $effect(() => {
    const next = String(value ?? '')
    untrack(() => { if (!api.editing && api.value !== next) api.setValue(next) })
  })
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('row')}>
    <div {...part('area')} {...api.getAreaProps()}>
      <input {...part('input')} {...api.getInputProps()} {...fieldAttrs(field)} />
      <span {...part('preview')} {...api.getPreviewProps()}>{api.valueText}</span>
    </div>
    {#if controls}
      <div {...part('control')} {...api.getControlProps()}>
        {#if api.editing}
          <button {...part('submit-trigger')} {...api.getSubmitTriggerProps()}><iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon></button>
          <button {...part('cancel-trigger')} {...api.getCancelTriggerProps()}><iconify-icon icon="lucide:x" aria-hidden="true"></iconify-icon></button>
        {:else}
          <button {...part('edit-trigger')} {...api.getEditTriggerProps()}><iconify-icon icon="lucide:pencil" aria-hidden="true"></iconify-icon></button>
        {/if}
      </div>
    {/if}
  </div>
</div>
