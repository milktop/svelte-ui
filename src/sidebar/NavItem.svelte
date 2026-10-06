<!--
  A sidebar link (or a button, without `href`). Other attributes (onclick,
  data-*) go on the <a>.

  <NavItem icon="lucide:users" href="/students" active={isCurrent('/students')} badge={3}>Students</NavItem>

  - `icon`: an Iconify name
  - `href`
  - `active`: the current page (sets aria-current)
  - `badge`: a count or short text on the right (hidden at 0)
  - `label`: its text, in place of the content

  In the rail only the icon shows, with its text in a tooltip (inside a
  group's flyout the text stays); in the drawer, following a link closes it.
-->
<script>
  import { getContext } from 'svelte'
  import 'iconify-icon'
  import Tooltip from '../tooltip/Tooltip.svelte'
  import { cx, partsOf, useShell } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let {
    icon = null, href = null, active = false, badge = null, label = null, onclick = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const shell = useShell()
  const flyout = getContext('ui-nav-flyout')
  const part = partsOf('nav-item', () => classes)
  let textEl = $state()
  const rail = $derived(!!shell?.rail && !flyout)
  const text = $derived(label ?? textEl?.textContent.trim() ?? '')

  function follow(e, tooltipClick) {
    tooltipClick?.(e)
    onclick?.(e)
    if (href && shell?.mobile) shell.close()
  }
</script>

<div {...part('root')} class={cx(className)} data-active={active || undefined}>
  <Tooltip content={text} placement="right" disabled={!rail}>
    {#snippet trigger(props)}
      <svelte:element this={href ? 'a' : 'button'} {...rest} {...props} {...part('link')} {href} type={href ? undefined : 'button'}
        aria-current={active ? 'page' : undefined} aria-label={rail ? text : undefined} onclick={(e) => follow(e, props.onclick)}>
        {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
        <span {...part('text')} bind:this={textEl}>{#if children}{@render children()}{:else}{label}{/if}</span>
        {#if badge !== null && badge !== 0}<span {...part('badge')}>{badge}</span>{/if}
      </svelte:element>
    {/snippet}
  </Tooltip>
</div>
