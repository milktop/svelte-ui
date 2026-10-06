<!--
  Nav items under a label that opens and closes.

  <NavGroup label="Forms" icon="lucide:form" open>
    <NavItem href="/input">Input</NavItem>
  </NavGroup>

  - `label`, `icon`
  - `open`: bindable. In an `accordion` Sidebar, opening one closes the others.

  In the rail only its icon shows, and its items open beside it as a flyout:
  on hover, or on click for keyboard and touch. Escape, leaving it or
  following a link closes it.
-->
<script>
  import { getContext, setContext } from 'svelte'
  import 'iconify-icon'
  import { cx, partsOf, useShell, useSidebar } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { label, icon = null, open = $bindable(false), class: className = '', classes = {}, children, ...rest } = $props()

  const shell = useShell()
  const sidebar = useSidebar()
  const section = getContext('ui-nav-section')
  const part = partsOf('nav-group', () => classes)
  const id = $props.id()
  const rail = $derived(!!shell?.rail)

  // Items inside the flyout keep their labels (no rail tooltips).
  setContext('ui-nav-flyout', true)

  // An accordion closes this group when another opens.
  $effect(() => { if (open && sidebar?.accordion) sidebar.openGroup = id })
  $effect(() => { if (sidebar?.accordion && sidebar.openGroup !== id) open = false })

  // A NavSection's "collapse all" opens and closes its groups.
  $effect(() => section?.register({ get open() { return open }, set open(v) { open = v } }))

  let flyout = $state(false)
  let root = $state()
  let toggleEl = $state()
  let position = $state({ top: 0, left: 0 })

  function showFlyout() {
    if (!rail) return
    const box = toggleEl.getBoundingClientRect()
    position = { top: box.top, left: box.right }
    flyout = true
  }

  function toggle() {
    if (!rail) open = !open
    else if (flyout) flyout = false
    else showFlyout()
  }

  // Leaving by keyboard closes the flyout.
  function focusLeft(e) {
    if (flyout && !root.contains(e.relatedTarget)) flyout = false
  }

  function escaped(e) {
    if (e.key !== 'Escape' || !flyout) return
    flyout = false
    toggleEl.focus()
  }

  $effect(() => { if (!rail) flyout = false })
</script>

<div {...rest} {...part('root')} class={cx(className)} bind:this={root} data-open={open || undefined}
  data-rail={rail || undefined} data-flyout={(rail && flyout) || undefined}
  onpointerenter={showFlyout} onpointerleave={() => (flyout = false)} onfocusout={focusLeft} onkeydown={escaped}>
  <button {...part('trigger')} bind:this={toggleEl} type="button" aria-expanded={rail ? flyout : open}
    aria-controls="{id}-panel" aria-label={rail ? label : undefined} onclick={toggle}>
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
    <span {...part('text')}>{label}</span>
    <iconify-icon {...part('indicator')} icon="lucide:chevron-down" aria-hidden="true"></iconify-icon>
  </button>
  {#if rail ? flyout : open}
    <div {...part('children')} id="{id}-panel" style:--flyout-top="{position.top}px" style:--flyout-left="{position.left}px"
      onclick={(e) => e.target.closest('a') && (flyout = false)} role="presentation">
      <div {...part('panel')}>
        {#if rail}<div {...part('flyout-heading')} aria-hidden="true">{label}</div>{/if}
        {@render children?.()}
      </div>
    </div>
  {/if}
</div>
