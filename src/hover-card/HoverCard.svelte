<!--
  A richer preview that opens while the pointer rests on (or keyboard focus
  is on) a trigger, e.g. a person's details over their name.

  <HoverCard>
    {#snippet trigger(props)}<a {...props} href="/students/1">Ada Lovelace</a>{/snippet}
    …card content…
  </HoverCard>

  It stays open while the pointer is over the card, so its content can be
  selected or clicked. Keep anything essential reachable another way (touch
  has no hover).

  - `trigger` snippet: spread its props onto your link or button
  - `placement`: 'bottom' (default), 'top', 'right-start', …
  - `openDelay`, `closeDelay`: in ms (400 and 200)
  - `arrow`: points the card at its trigger; `disabled`; `open`: bindable
-->
<script>
  import * as hoverCard from '@zag-js/hover-card'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { cx, partsOf } from '../utils.js'
  import { Presence } from '../presence.svelte.js'
  import '../theme.css'
  import './hover-card.css'

  let {
    placement = 'bottom', openDelay = 400, closeDelay = 200, arrow = false, disabled = false, open = $bindable(false),
    trigger = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('hover-card', () => classes)
  const id = $props.id()
  const service = useMachine(hoverCard.machine, () => ({
    id, open, openDelay, closeDelay, disabled,
    positioning: { placement, strategy: 'fixed', gutter: 8 },
    onOpenChange: (details) => { open = details.open },
  }))
  const api = $derived(hoverCard.connect(service, normalizeProps))
  const presence = new Presence(() => api.open)
</script>

{@render trigger?.(api.getTriggerProps())}
<div {...part('positioner')} {...api.getPositionerProps()}>
  {#if presence.present}
    <div {...rest} {...part('content')} {...api.getContentProps()} hidden={false} class={cx(className)} onanimationend={presence.done}>
      {#if arrow}<div {...part('arrow')} {...api.getArrowProps()}><div {...part('arrow-tip')} {...api.getArrowTipProps()}></div></div>{/if}
      {@render children?.()}
    </div>
  {/if}
</div>
