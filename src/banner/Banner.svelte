<!--
  A slim, prominent strip for an announcement or a page-wide message, e.g.
  across the top of the content. For a message within the content, use Alert.

  <Banner icon="lucide:sparkles" dismissible>
    Notes can now be shared with parents. <a href="/help/notes">See how</a>
  </Banner>

  - `variant`: 'accent' (default, solid), 'soft', 'neutral', 'success', 'warning' or 'danger'
  - `icon`: an Iconify name before the message
  - `actions` snippet: buttons or links at the end
  - `dismissible`: a close button, which sets `open` (bindable) to false and
    calls `ondismiss`
  - `full`: no rounding, to run edge to edge
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './banner.css'

  let {
    open = $bindable(true), variant = 'accent', icon = null, dismissible = false, full = false, ondismiss = null,
    actions = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('banner', () => classes)

  function dismiss() {
    open = false
    ondismiss?.()
  }
</script>

{#if open}
  <div {...rest} {...part('root')} class={cx(className)} data-variant={variant} data-full={full || undefined} role="status">
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
    <div {...part('description')}>{@render children?.()}</div>
    {#if actions}<div {...part('actions')}>{@render actions()}</div>{/if}
    {#if dismissible}
      <button {...part('close')} type="button" aria-label="Dismiss" onclick={dismiss}><iconify-icon icon="lucide:x"></iconify-icon></button>
    {/if}
  </div>
{/if}
