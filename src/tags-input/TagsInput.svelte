<!--
  A tags input: type and press Enter (or a comma) to add a tag; Backspace
  removes the last; double-click a tag to edit it.

  <TagsInput label="Topics" bind:value={topics} placeholder="Add a topic…" />

  - `value`: bindable array of strings
  - `max`: the most tags allowed
  - `variant`: the tags' look: 'subtle', 'accent' or 'outline'
  - `editable`: false to stop editing tags in place
  - `delimiter`: typing it adds a tag too (',')
  - `validate`: function({ inputValue, value }) returning whether to add it; a
    rejected tag stays in the box to fix, and the field flashes red
  - `allowDuplicates`: let the same tag in twice
  - `addOnPaste`: split pasted text by the delimiter into tags (on by default)
  - `name`: for plain form posts (comma-separated)
-->
<script>
  import * as tagsInput from '@zag-js/tags-input'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './tags-input.css'

  let {
    label = null, value = $bindable([]), placeholder = 'Add…', max = Infinity, delimiter = ',', validate = undefined, allowDuplicates = false, addOnPaste = true, variant = 'subtle', editable = true,
    name = null, disabled = false, class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('tags-input', () => classes)
  let inputEl = $state()
  // What was typed, to put back when `validate` turns it down (Zag clears it).
  let typed = ''
  let rejected = $state(false)
  const id = $props.id()
  const service = useMachine(tagsInput.machine, () => ({
    id, name, disabled, max, editable, value, delimiter, validate, allowDuplicates, addOnPaste, blurBehavior: 'add',
    invalid: !!field?.invalid,
    ids: field ? { input: field.id, label: field.labelId } : undefined,
    onInputValueChange: (details) => { if (details.inputValue) typed = details.inputValue },
    onValueInvalid: () => {
      const text = typed
      // Zag clears the box in the next frame; put the text back after that.
      requestAnimationFrame(() => requestAnimationFrame(() => api.setInputValue(text)))
      rejected = true
      setTimeout(() => (rejected = false), 700)
    },
    onValueChange: (details) => {
      // Zag clears its own copy of the typed text after adding a tag, but not
      // always the box itself (after a delimiter), so clear that too.
      if (details.value.length > value.length && inputEl) inputEl.value = ''
      value = details.value
    },
  }))
  const api = $derived(tagsInput.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-variant={variant}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()} data-rejected={rejected || undefined}>
    <div {...part('tags')}>
      {#each api.value as tag, index (`${index}:${tag}`)}
        {@const itemProps = { index, value: tag }}
        <span {...api.getItemProps(itemProps)}>
          <div {...part('tag')} {...api.getItemPreviewProps(itemProps)}>
            <span {...part('tag-text')} {...api.getItemTextProps(itemProps)}>{tag}</span>
            <button {...part('tag-remove')} {...api.getItemDeleteTriggerProps(itemProps)}><iconify-icon icon="lucide:x"></iconify-icon></button>
          </div>
          <input {...part('tag-edit')} {...api.getItemInputProps(itemProps)} />
        </span>
      {/each}
      <input bind:this={inputEl} {...part('input')} {...api.getInputProps()} placeholder={api.value.length ? '' : placeholder} {...fieldAttrs(field)} />
    </div>
    <button {...part('clear')} {...api.getClearTriggerProps()}><iconify-icon icon="lucide:x"></iconify-icon></button>
  </div>
  <input {...api.getHiddenInputProps()} />
</div>
