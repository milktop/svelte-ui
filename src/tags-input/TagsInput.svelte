<!--
  A tags input: type and press Enter (or a comma) to add a tag; Backspace
  removes the last; double-click a tag to edit it.

  <TagsInput label="Topics" bind:value={topics} placeholder="Add a topic…" />

  - `value`: bindable array of strings
  - `max`: the most tags allowed
  - `variant`: the tags' look: 'subtle', 'accent' or 'outline'
  - `editable`: false to stop editing tags in place
  - `delimiter`: typing it adds a tag too (',')
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
    label = null, value = $bindable([]), placeholder = 'Add…', max = Infinity, delimiter = ',', variant = 'subtle', editable = true,
    name = null, disabled = false, class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('tags-input', () => classes)
  let inputEl = $state()
  const id = $props.id()
  const service = useMachine(tagsInput.machine, () => ({
    id, name, disabled, max, editable, value, delimiter, blurBehavior: 'add', addOnPaste: true,
    invalid: !!field?.invalid,
    ids: field ? { input: field.id, label: field.labelId } : undefined,
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
  <div {...part('control')} {...api.getControlProps()}>
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
