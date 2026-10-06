<!--
  A modal dialog, rendered at the end of <body> so no ancestor's stacking or
  overflow can trap it.

  <Dialog heading="Delete lesson?" description="This cannot be undone." bind:open>
    {#snippet trigger(props)}<Button {...props}>Delete</Button>{/snippet}
    …body…
    {#snippet footer()}<Button onclick={() => (open = false)}>Cancel</Button>…{/snippet}
  </Dialog>

  Focus moves in and is trapped while it is open, the page behind doesn't
  scroll, Escape or a click on the backdrop closes it, and focus returns to
  the trigger.

  - `open`: bindable
  - `trigger` snippet: the button that opens it (optional); spread its props onto it
  - `heading`, `description`: label and describe it for assistive tech
  - `footer` snippet: buttons along the bottom
  - `alert`: an alertdialog, for confirmations; the backdrop doesn't close it
  - `size`: 'sm', 'md' (default) or 'lg'
  - `closable`: false hides the close button
-->
<script>
  import * as dialog from '@zag-js/dialog'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import { Presence, portal } from '../presence.svelte.js'
  import '../theme.css'
  import './dialog.css'

  let {
    open = $bindable(false), heading = null, description = null, alert = false, size = 'md', closable = true,
    trigger = null, footer = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('dialog', () => classes)
  const id = $props.id()
  const service = useMachine(dialog.machine, () => ({
    id, open, role: alert ? 'alertdialog' : 'dialog',
    onOpenChange: (details) => { open = details.open },
  }))
  const api = $derived(dialog.connect(service, normalizeProps))
  const presence = new Presence(() => api.open)
</script>

{@render trigger?.(api.getTriggerProps())}
{#if presence.present}
  <div {@attach portal} style="display: contents">
    <div {...part('backdrop')} {...api.getBackdropProps()} hidden={false}></div>
    <div {...part('positioner')} {...api.getPositionerProps()}>
      <div {...rest} {...part('content')} {...api.getContentProps()} hidden={false} class={cx(className)} data-size={size}
        onanimationend={presence.done}>
        {#if closable}<button {...part('close-trigger')} {...api.getCloseTriggerProps()} aria-label="Close"><iconify-icon icon="lucide:x"></iconify-icon></button>{/if}
        {#if heading || description}
          <div {...part('header')}>
            {#if heading}<h2 {...part('title')} {...api.getTitleProps()}>{heading}</h2>{/if}
            {#if description}<p {...part('description')} {...api.getDescriptionProps()}>{description}</p>{/if}
          </div>
        {/if}
        {#if children}<div {...part('body')}>{@render children()}</div>{/if}
        {#if footer}<div {...part('footer')}>{@render footer()}</div>{/if}
      </div>
    </div>
  </div>
{/if}
