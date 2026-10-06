<!--
  Nav items under a label that opens and closes.

  <NavGroup label="Forms" icon="lucide:form" open>
    <NavItem href="/input">Input</NavItem>
  </NavGroup>

  - `label`, `icon`
  - `open`: bindable. In an `accordion` Sidebar, opening one closes the others.

  In the rail only its icon shows; clicking it expands the sidebar, opened.
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf, useShell, useSidebar } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { label, icon = null, open = $bindable(false), class: className = '', classes = {}, children, ...rest } = $props()

  const shell = useShell()
  const sidebar = useSidebar()
  const part = partsOf('nav-group', () => classes)
  const id = $props.id()

  // An accordion closes this group when another opens.
  $effect(() => { if (open && sidebar?.accordion) sidebar.openGroup = id })
  $effect(() => { if (sidebar?.accordion && sidebar.openGroup !== id) open = false })

  function toggle() {
    if (shell?.rail) {
      shell.toggle()
      open = true
    } else open = !open
  }
</script>

<div {...rest} {...part('root')} class={cx(className)} data-open={open || undefined}>
  <button {...part('trigger')} type="button" aria-expanded={open} aria-controls="{id}-panel" onclick={toggle}
    title={shell?.rail ? label : undefined}>
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
    <span {...part('text')}>{label}</span>
    <iconify-icon {...part('indicator')} icon="lucide:chevron-down" aria-hidden="true"></iconify-icon>
  </button>
  {#if open && !shell?.rail}<div {...part('panel')} id="{id}-panel">{@render children?.()}</div>{/if}
</div>
