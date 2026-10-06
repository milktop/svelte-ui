<!--
  A tooltip: a short hint on hover and keyboard focus.

  <Tooltip content="Archive">
    {#snippet trigger(props)}<Button {...props} icon="lucide:archive" aria-label="Archive" />{/snippet}
  </Tooltip>
  <Tooltip content="Ada Lovelace"><Avatar name="Ada Lovelace" /></Tooltip>

  - `trigger` snippet: the element it describes; spread its props onto it.
    Without one, the content is wrapped in a span that takes them
  - `content`: the text; a `tip` snippet takes richer markup instead
  - `placement`: 'top' (default), 'bottom-start', …
  - `openDelay` (0), `closeDelay` in ms; `interactive`: stays open while the
    pointer is over it; `disabled`
  - `open`: bindable

  It closes on Escape, click or scroll. Disabled buttons fire no events, so
  wrap those (no trigger snippet).
-->
<script>
  import * as tooltip from '@zag-js/tooltip'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './tooltip.css'

  let {
    content = null, placement = 'top', openDelay = 0, closeDelay = undefined, interactive = false, disabled = false,
    open = $bindable(false), trigger = null, tip = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('tooltip', () => classes)
  const id = $props.id()
  const service = useMachine(tooltip.machine, () => ({
    id, open, openDelay, closeDelay, interactive, disabled,
    positioning: { placement, strategy: 'fixed', gutter: 8 },
    onOpenChange: (details) => { open = details.open },
  }))
  const api = $derived(tooltip.connect(service, normalizeProps))
</script>

{#if trigger}{@render trigger(api.getTriggerProps())}
{:else}<span {...part('trigger')} {...api.getTriggerProps()}>{@render children?.()}</span>{/if}
{#if api.open}
  <div {...part('positioner')} {...api.getPositionerProps()}>
    <div {...rest} {...part('content')} {...api.getContentProps()} class={cx(className)}>
      <div {...part('arrow')} {...api.getArrowProps()}><div {...part('arrow-tip')} {...api.getArrowTipProps()}></div></div>
      {#if tip}{@render tip()}{:else}{content}{/if}
    </div>
  </div>
{/if}
