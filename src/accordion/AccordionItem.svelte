<!--
  One section of an Accordion: a heading button and the content it expands.

  - `value`: identifies it; `heading`; `disabled`
  - `title` snippet: the heading's content, in place of `heading`
-->
<script>
  import { getContext } from 'svelte'
  import 'iconify-icon'
  import { cx } from '../utils.js'

  let { value, heading = '', disabled = false, title = null, class: className = '', children, ...rest } = $props()

  const accordion = getContext('ui-accordion')
  const part = (name) => accordion.part(name)
  const props = $derived({ value: String(value), disabled: !!disabled })
  $effect(() => { accordion.remember(value) })
</script>

<div {...rest} {...part('item')} {...accordion.api.getItemProps(props)} class={cx(className)}>
  <h3 {...part('heading')}>
    <button {...part('item-trigger')} {...accordion.api.getItemTriggerProps(props)}>
      <span {...part('heading-text')}>{#if title}{@render title()}{:else}{heading}{/if}</span>
      <span {...part('item-indicator')} {...accordion.api.getItemIndicatorProps(props)}><iconify-icon icon="lucide:chevron-down"></iconify-icon></span>
    </button>
  </h3>
  <div {...part('item-content')} {...accordion.api.getItemContentProps(props)}>
    <div {...part('inner')}>{@render children?.()}</div>
  </div>
</div>
