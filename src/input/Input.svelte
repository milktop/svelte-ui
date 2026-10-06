<!--
  A text input: a box holding a native <input>, with optional content before
  and after it. Other attributes (placeholder, name, autocomplete, oninput…)
  go on the <input>.

  <Input label="Name" bind:value={name} />
  <Input icon="lucide:search" placeholder="Search…" bind:value={query} />

  - `label`: a label above it (skipped inside a Field)

  - `value`: bindable (a number for type="number")
  - `type`: as on a native input
  - `icon`: an Iconify name shown before the input
  - `prefix`, `suffix`: text before or after it ('£', 'kg')
  - `start`, `end` snippets: anything else before or after it (a button)
  - `size`: 'sm' or 'md'; `round`: a pill (a search box)
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './input.css'

  let {
    label = null, value = $bindable(''), type = 'text', icon = null, prefix = null, suffix = null,
    size = 'md', round = false, start = null, end = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('input', () => classes)
  const ownId = $props.id()
  const id = $derived(field?.id ?? `${ownId}-input`)
</script>

<div {...part('root')} class={cx(className)} data-size={size} data-round={round || undefined}>
  {#if label && !field}<label {...part('label')} for={id}>{label}</label>{/if}
  <div {...part('control')}>
    {#if start}{@render start()}
    {:else if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>
    {:else if prefix}<span {...part('prefix')}>{prefix}</span>{/if}
    <input {...part('input')} {type} {id} bind:value {...rest} {...fieldAttrs(field)} />
    {#if end}{@render end()}
    {:else if suffix}<span {...part('suffix')}>{suffix}</span>{/if}
  </div>
</div>
