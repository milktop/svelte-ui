<!--
  Nav items under a label that opens and closes.

  <NavGroup label="Forms" icon="lucide:form" open>
    <NavItem href="/input">Input</NavItem>
  </NavGroup>

  - `label`, `icon`
  - `open`: bindable
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { label, icon = null, open = $bindable(false), class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('nav-group', () => classes)
  const id = $props.id()
</script>

<div {...rest} {...part('root')} class={cx(className)} data-open={open || undefined}>
  <button {...part('trigger')} type="button" aria-expanded={open} aria-controls="{id}-panel" onclick={() => (open = !open)}>
    {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
    <span {...part('text')}>{label}</span>
    <iconify-icon {...part('indicator')} icon="lucide:chevron-down" aria-hidden="true"></iconify-icon>
  </button>
  {#if open}<div {...part('panel')} id="{id}-panel">{@render children?.()}</div>{/if}
</div>
