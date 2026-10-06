<!--
  One label and its value (the content), in a DataList.

  - `label`: the term
  - `info`: adds an icon with this text in a tooltip
-->
<script>
  import 'iconify-icon'
  import Tooltip from '../tooltip/Tooltip.svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './data-list.css'

  let { label = '', info = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('data-list', () => classes)
</script>

<div {...rest} {...part('item')} class={cx(className)}>
  <dt {...part('label')}>
    <span>{label}</span>
    {#if info}
      <Tooltip content={info}>
        {#snippet trigger(props)}<span {...props} {...part('info')} tabindex="0" aria-label={info}><iconify-icon icon="lucide:info"></iconify-icon></span>{/snippet}
      </Tooltip>
    {/if}
  </dt>
  <dd {...part('value')}>{@render children?.()}</dd>
</div>
