<!--
  A textarea that grows with its content, from `rows` lines up to `maxRows`
  (then it scrolls). Other attributes go on the <textarea>.

  <Textarea bind:value={notes} rows={3} maxRows={8} placeholder="Notes" />

  - `label`: a label above it (skipped inside a Field)
  - `value`: bindable
  - `rows`: the starting height in lines
  - `maxRows`: grow up to this many lines, then scroll
  - `autogrow`: false for a fixed height the user can resize
-->
<script>
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './textarea.css'

  let {
    label = null, value = $bindable(''), rows = 3, maxRows = null, autogrow = true,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('textarea', () => classes)
  let el = $state()
  const ownId = $props.id()
  const id = $derived(field?.id ?? `${ownId}-textarea`)

  // Fits the height to the content, capped at maxRows.
  $effect(() => {
    value
    if (!autogrow || !el) return
    const style = getComputedStyle(el)
    const line = parseFloat(style.lineHeight)
    const max = maxRows ? line * maxRows : Infinity
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, max)}px`
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
  })
</script>

<div {...part('root')} class={cx(className)}>
  {#if label && !field}<label {...part('label')} for={id}>{label}</label>{/if}
  <div {...part('control')}>
    <textarea {...part('textarea')} bind:this={el} bind:value {rows} {id} data-autogrow={autogrow || undefined}
      {...rest} {...fieldAttrs(field)}></textarea>
  </div>
</div>
