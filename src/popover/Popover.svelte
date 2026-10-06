<!--
  A popover: a panel that opens from a trigger, for settings or details.

  <Popover heading="Appearance" closable placement="bottom-end">
    {#snippet trigger(props)}<Button {...props} icon="lucide:palette" aria-label="Appearance" />{/snippet}
    …content…
  </Popover>

  - `trigger` snippet: the button that opens it; spread its props onto your button
  - `heading`, `description`: a header for the panel
  - `closable`: a close button in the corner
  - `arrow`: points the panel at its trigger
  - `modal`: traps focus and blocks the page behind it
  - `open`: bindable
  - `placement`: where it opens ('bottom')
-->
<script>
  import * as popover from '@zag-js/popover'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './popover.css'

  let {
    heading = null, description = null, closable = false, arrow = false, modal = false, open = $bindable(false), placement = 'bottom',
    trigger = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('popover', () => classes)
  const id = $props.id()
  const service = useMachine(popover.machine, () => ({
    id, open, modal,
    // Fixed, so a scrolling or clipped parent can't cut it off.
    positioning: { placement, strategy: 'fixed' },
    onOpenChange: (details) => { open = details.open },
  }))
  const api = $derived(popover.connect(service, normalizeProps))
</script>

{@render trigger?.(api.getTriggerProps())}
<div {...part('positioner')} {...api.getPositionerProps()}>
  <div {...rest} {...part('content')} {...api.getContentProps()} class={cx(className)}>
    {#if arrow}<div {...part('arrow')} {...api.getArrowProps()}><div {...part('arrow-tip')} {...api.getArrowTipProps()}></div></div>{/if}
    {#if heading || description}
      <div {...part('header')}>
        {#if heading}<div {...part('title')} {...api.getTitleProps()}>{heading}</div>{/if}
        {#if description}<p {...part('description')} {...api.getDescriptionProps()}>{description}</p>{/if}
      </div>
    {/if}
    {@render children?.()}
    {#if closable}
      <button {...part('close')} {...api.getCloseTriggerProps()} aria-label="Close"><iconify-icon icon="lucide:x"></iconify-icon></button>
    {/if}
  </div>
</div>
