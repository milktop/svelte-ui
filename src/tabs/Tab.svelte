<!--
  One panel of a Tabs; `label` (and an optional `icon`) make its tab.

  - `value`: identifies it (the Tabs' value when selected)
  - `label`, `icon`, `disabled`
-->
<script>
  import { getContext } from 'svelte'
  import { cx } from '../utils.js'

  let { value, label = '', icon = null, disabled = false, class: className = '', children, ...rest } = $props()

  const tabs = getContext('ui-tabs')
  const tab = {
    get value() { return value },
    get label() { return label },
    get icon() { return icon },
    get disabled() { return disabled },
  }
  $effect(() => tabs.register(tab))
</script>

<div {...rest} {...tabs.part('content')} {...tabs.api.getContentProps({ value: String(value) })} class={cx(className)}>
  {@render children?.()}
</div>
