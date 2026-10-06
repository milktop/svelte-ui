<!--
  A form field: a label, hint and error around one control, wired up for
  assistive tech. Controls inside it (Input, Select, DatePicker…) skip their
  own label and point at its.

  <Field label="Student" error={form.errors.student_id}>
    <Select items={students} bind:value={form.student_id} />
  </Field>

  - `label`, `hint`, `error` (shown instead of the hint), `required`
  - `span`: columns (of 12) to take inside Fields
  - without children it renders an Input: `value` (bindable) and any other
    props (type, placeholder, icon, suffix…) pass on to it
-->
<script>
  import Input from '../input/Input.svelte'
  import { cx, partsOf, provideField } from '../utils.js'
  import '../theme.css'
  import './field.css'

  let {
    label = null, hint = null, error = null, required = false, span = 12, value = $bindable(''),
    class: className = '', classes = {}, style = '', children, ...inputProps
  } = $props()

  const id = $props.id()
  const part = partsOf('field', () => classes)

  provideField({
    id: `${id}-control`,
    labelId: `${id}-label`,
    get label() { return label },
    get invalid() { return !!error },
    get describedBy() { return error ? `${id}-error` : hint ? `${id}-hint` : undefined },
  })
</script>

<div {...part('root')} class={cx(className)} style="--span: {span}; {style}">
  {#if label}
    <label {...part('label')} id="{id}-label" for="{id}-control">
      {label}{#if required}<span {...part('required')} aria-hidden="true"> *</span>{/if}
    </label>
  {/if}
  {#if children}{@render children()}{:else}<Input bind:value {required} {...inputProps} />{/if}
  {#if error}<p {...part('error')} id="{id}-error">{error}</p>
  {:else if hint}<p {...part('hint')} id="{id}-hint">{hint}</p>{/if}
</div>
