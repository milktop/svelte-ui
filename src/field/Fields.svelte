<!--
  A group of fields on a 12-column grid (one column on phones). Each Field
  takes `span` columns.

  <Fields legend="Lesson">
    <Field label="Student" span={6}>…</Field>
    <Field label="Date" span={6}>…</Field>
  </Fields>

  - `legend`, `description`: a heading for the group
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './field.css'

  let { legend = null, description = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('fields', () => classes)
</script>

<fieldset {...rest} {...part('root')} class={cx(className)}>
  {#if legend}<legend {...part('legend')}>{legend}</legend>{/if}
  {#if description}<p {...part('description')}>{description}</p>{/if}
  <div {...part('grid')}>{@render children?.()}</div>
</fieldset>
