<!--
  A group of nav items, with an optional heading (hidden in the rail).

  - `heading`
  - `collapsible`: a button beside the heading that collapses (or expands)
    all the section's groups at once
-->
<script>
  import { setContext, untrack } from 'svelte'
  import 'iconify-icon'
  import { cx, partsOf, useShell } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let { heading = null, collapsible = false, class: className = '', classes = {}, children, ...rest } = $props()

  const shell = useShell()
  const part = partsOf('nav-section', () => classes)
  let groups = $state([])
  const anyOpen = $derived(groups.some((group) => group.open))

  setContext('ui-nav-section', {
    // Untracked, so a group's effect doesn't rerun when the list changes.
    register(group) {
      untrack(() => groups.push(group))
      return () => untrack(() => groups.splice(groups.indexOf(group), 1))
    },
  })

  function toggleAll() {
    const open = !anyOpen
    for (const group of groups) group.open = open
  }
</script>

<div {...rest} {...part('root')} class={cx(className)} role="group" aria-label={heading}>
  {#if heading || collapsible}
    <div {...part('heading-row')}>
      <div {...part('heading')} aria-hidden="true">{heading ?? ''}</div>
      {#if collapsible && !shell?.rail}
        <button {...part('collapse-all')} type="button" onclick={toggleAll}
          aria-label={anyOpen ? 'Collapse all' : 'Expand all'} title={anyOpen ? 'Collapse all' : 'Expand all'}>
          <iconify-icon icon={anyOpen ? 'lucide:chevrons-down-up' : 'lucide:chevrons-up-down'} aria-hidden="true"></iconify-icon>
        </button>
      {/if}
    </div>
  {/if}
  {@render children?.()}
</div>
