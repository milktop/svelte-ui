<!--
  One panel of a Tabs; `label` (and an optional `icon`) make its tab.

  - `value`: identifies it (the Tabs' value when selected)
  - `label`, `icon`, `disabled`
  - `count`: a small count after the label (hidden at 0 or null); past `max`
    it shows e.g. "99+"
  - `dot`: a dot there instead, for "something to look at"
  - `pulse`: a ring ripples out from the count or dot (not when the system
    asks for less motion)
  - `countColor`: 'neutral' (default, quiet), 'accent', 'danger', 'success'
    or 'warning', for the dot too
  - `countLabel`: what the count is, for assistive tech ("Invoices, 2 overdue")
-->
<script>
  import { getContext } from 'svelte'
  import { cx } from '../utils.js'

  let {
    value, label = '', icon = null, disabled = false,
    count = null, max = 99, dot = false, pulse = false, countColor = 'neutral', countLabel = '',
    class: className = '', children, ...rest
  } = $props()

  const tabs = getContext('ui-tabs')
  const tab = {
    get value() { return value },
    get label() { return label },
    get icon() { return icon },
    get disabled() { return disabled },
    get badge() { return count > 0 ? (count > max ? `${max}+` : String(count)) : dot ? '' : null },
    get spoken() { return count > 0 ? [count, countLabel].filter(Boolean).join(' ') : dot ? countLabel : '' },
    get pulse() { return pulse },
    get countColor() { return countColor },
  }
  $effect(() => tabs.register(tab))
</script>

<div {...rest} {...tabs.part('content')} {...tabs.api.getContentProps({ value: String(value) })} class={cx(className)}>
  {@render children?.()}
</div>
