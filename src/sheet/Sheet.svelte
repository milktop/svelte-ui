<!--
  A panel that slides in from an edge of the screen, for viewing or editing
  something without leaving the page.

  <Sheet heading="Edit student" bind:open={editing}>
    …body…
    {#snippet footer()}…buttons…{/snippet}
  </Sheet>

  A modal dialog underneath: focus is trapped, the page behind doesn't
  scroll, Escape or the backdrop closes it, and focus returns to the trigger.

  - `side`: 'right' (default), 'left', 'top' or 'bottom'
  - `size`: 'sm', 'md' (default) or 'lg': the width (or height for top and bottom)
  - `open`, `trigger`, `heading`, `description`, `footer`, `closable`, `alert`: as for Dialog
-->
<script>
  import * as dialog from '@zag-js/dialog'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import { Presence, portal } from '../presence.svelte.js'
  import '../theme.css'
  import './sheet.css'

  let {
    open = $bindable(false), side = 'right', heading = null, description = null, alert = false, size = 'md', closable = true,
    trigger = null, footer = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('sheet', () => classes)
  const id = $props.id()
  const service = useMachine(dialog.machine, () => ({
    id, open, role: alert ? 'alertdialog' : 'dialog',
    onOpenChange: (details) => { open = details.open },
  }))
  const api = $derived(dialog.connect(service, normalizeProps))
  const presence = new Presence(() => api.open, 400)
</script>

{@render trigger?.(api.getTriggerProps())}
{#if presence.present}
  <div {@attach portal} style="display: contents">
    <div {...api.getBackdropProps()} {...part('backdrop')} hidden={false}></div>
    <div {...api.getPositionerProps()} {...part('positioner')} data-side={side}>
      <div {...rest} {...api.getContentProps()} {...part('content')} hidden={false} class={cx(className)} data-side={side} data-size={size}
        onanimationend={presence.done}>
        {#if closable}<button {...api.getCloseTriggerProps()} {...part('close-trigger')} aria-label="Close"><iconify-icon icon="lucide:x"></iconify-icon></button>{/if}
        {#if heading || description}
          <div {...part('header')}>
            {#if heading}<h2 {...api.getTitleProps()} {...part('title')}>{heading}</h2>{/if}
            {#if description}<p {...api.getDescriptionProps()} {...part('description')}>{description}</p>{/if}
          </div>
        {/if}
        <div {...part('body')}>{@render children?.()}</div>
        {#if footer}<div {...part('footer')}>{@render footer()}</div>{/if}
      </div>
    </div>
  </div>
{/if}
