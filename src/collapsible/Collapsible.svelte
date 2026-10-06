<!--
  A section that opens and closes, animating its height.

  <Collapsible heading="Lesson notes">…</Collapsible>
  <Collapsible bind:open>
    {#snippet trigger(props)}<Button {...props}>Show more</Button>{/snippet}
    …
  </Collapsible>

  - `heading`: a built-in toggle with a chevron
  - `trigger` snippet: your own toggle instead; spread its props onto it
  - `open`: bindable; `disabled`
-->
<script>
  import * as collapsible from '@zag-js/collapsible'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './collapsible.css'

  let { open = $bindable(false), heading = null, disabled = false, trigger = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('collapsible', () => classes)
  const id = $props.id()
  const service = useMachine(collapsible.machine, () => ({
    id, open, disabled,
    onOpenChange: (details) => { open = details.open },
  }))
  const api = $derived(collapsible.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if trigger}{@render trigger(api.getTriggerProps())}
  {:else if heading}
    <button {...part('trigger')} {...api.getTriggerProps()}>
      <span {...part('heading')}>{heading}</span>
      <span {...part('indicator')} {...api.getIndicatorProps()}><iconify-icon icon="lucide:chevron-down"></iconify-icon></span>
    </button>
  {/if}
  <div {...part('content')} {...api.getContentProps()}>
    <div {...part('inner')}>{@render children?.()}</div>
  </div>
</div>
