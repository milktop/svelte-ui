<!--
  Sections behind headings that expand them.

  <Accordion bind:value={open}>
    <AccordionItem value="pricing" heading="How much are lessons?">…</AccordionItem>
    <AccordionItem value="cancel" heading="Can I cancel?">…</AccordionItem>
  </Accordion>

  Arrow keys move between headings, Home/End jump to the ends.

  - `value`: bindable; the open item's value (or null), or an array of them with `multiple`
  - `multiple`: several open at once
  - `collapsible`: the open item can be closed again (default true)
-->
<script>
  import * as accordion from '@zag-js/accordion'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { setContext } from 'svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './accordion.css'

  let { value = $bindable(null), multiple = false, collapsible = true, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('accordion', () => classes)
  const id = $props.id()
  const keys = (v) => [].concat(v ?? []).map(String)
  // Item values as given (numbers stay numbers), by their string keys.
  const values = new Map()

  const service = useMachine(accordion.machine, () => ({
    id, multiple, collapsible: multiple || collapsible, value: keys(value),
    onValueChange: (details) => {
      const picked = details.value.map((key) => values.get(key) ?? key)
      value = multiple ? picked : (picked[0] ?? null)
    },
  }))
  const api = $derived(accordion.connect(service, normalizeProps))

  setContext('ui-accordion', {
    get api() { return api },
    get part() { return part },
    remember: (v) => values.set(String(v), v),
  })
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>{@render children?.()}</div>
