<!--
  A sidebar link. Other attributes (onclick, data-*) go on the <a>.

  <NavItem icon="lucide:users" href="/students" active={isCurrent('/students')} badge={3}>Students</NavItem>

  - `icon`: an Iconify name
  - `href`
  - `active`: the current page (sets aria-current)
  - `badge`: a count or short text on the right (hidden at 0)

  In the rail only the icon shows, with its text as a tooltip; in the drawer,
  following a link closes it.
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf, useShell } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { icon = null, href, active = false, badge = null, onclick = null, class: className = '', classes = {}, children, ...rest } = $props()

  const shell = useShell()
  const part = partsOf('nav-item', () => classes)
  let text = $state()

  function follow(e) {
    onclick?.(e)
    if (shell?.mobile) shell.close()
  }
</script>

<div {...part('root')} class={cx(className)} data-active={active || undefined}>
  <a {...rest} {...part('link')} {href} aria-current={active ? 'page' : undefined} onclick={follow}
    title={shell?.rail ? text?.textContent.trim() : undefined}>
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
    <span {...part('text')} bind:this={text}>{@render children?.()}</span>
    {#if badge !== null && badge !== 0}<span {...part('badge')}>{badge}</span>{/if}
  </a>
</div>
