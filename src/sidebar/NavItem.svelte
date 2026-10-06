<!--
  A sidebar link. Other attributes (onclick, data-*) go on the <a>.

  <NavItem icon="lucide:users" href="/students" active={isCurrent('/students')}>Students</NavItem>

  - `icon`: an Iconify name
  - `href`
  - `active`: the current page (sets aria-current)
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { icon = null, href, active = false, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('nav-item', () => classes)
</script>

<div {...part('root')} class={cx(className)} data-active={active || undefined}>
  <a {...rest} {...part('link')} {href} aria-current={active ? 'page' : undefined}>
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
    <span {...part('text')}>{@render children?.()}</span>
  </a>
</div>
