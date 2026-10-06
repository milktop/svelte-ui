<!--
  A small toolbar floating at the bottom of the screen while something is
  selected, e.g. table rows.

  <ActionBar open={picked.length > 0} onclose={() => (picked = [])}>
    {#snippet selection()}{picked.length} selected{/snippet}
    <Button size="sm">Message</Button>
    <Button size="sm" variant="danger">Archive</Button>
  </ActionBar>

  It isn't modal: the page stays usable (keep ticking rows) and focus isn't
  moved. It's rendered at the end of <body>, a toolbar for assistive tech,
  centred over the main area beside an AppShell's sidebar.

  - `open`: shows it; bindable
  - `selection` snippet: the count or summary on the left
  - `closable`: false hides the close button; it (and Escape inside the bar)
    closes it and calls `onclose`, where you'd clear the selection
  - `label`: the toolbar's accessible name
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import { Presence, portal } from '../presence.svelte.js'
  import '../theme.css'
  import './action-bar.css'

  let {
    open = $bindable(false), closable = true, label = 'Selection actions', onclose = null,
    selection = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('action-bar', () => classes)
  const presence = new Presence(() => open)

  function close() {
    open = false
    onclose?.()
  }
</script>

{#if presence.present}
  <div {@attach portal} {...part('positioner')}>
    <div {...rest} {...part('content')} class={cx(className)} role="toolbar" aria-label={label} data-state={open ? 'open' : 'closed'}
      onanimationend={presence.done} onkeydown={(e) => e.key === 'Escape' && close()}>
      {#if selection}<div {...part('selection')}>{@render selection()}</div><span {...part('separator')} aria-hidden="true"></span>{/if}
      <div {...part('actions')}>{@render children?.()}</div>
      {#if closable}<button {...part('close')} type="button" aria-label="Close" onclick={close}><iconify-icon icon="lucide:x"></iconify-icon></button>{/if}
    </div>
  </div>
{/if}
