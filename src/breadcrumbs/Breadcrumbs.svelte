<!--
  Where the page sits: links from the top down to the current page.

  <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Students' }]} />

  - `items`: `{ label, href, icon }`; the last is the current page
  - `separator`: text between crumbs ('/', '›'); a chevron by default
  - `max`: with more items than this, the middle ones fold into a "…" button
    that shows them
  - `label`: what assistive tech calls the nav ('Breadcrumb')
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './breadcrumbs.css'

  let { items = [], separator = null, max = null, label = 'Breadcrumb', class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('breadcrumbs', () => classes)
  let unfolded = $state(false)

  // The first crumb, a "…" for the folded middle, and the last max - 1.
  const shown = $derived(!max || unfolded || items.length <= max
    ? items
    : [items[0], { fold: true }, ...items.slice(items.length - (max - 1))])
</script>

<nav {...rest} {...part('root')} class={cx(className)} aria-label={label}>
  <ol {...part('list')}>
    {#each shown as item, i}
      {@const current = i === shown.length - 1}
      <li {...part('crumb')}>
        {#if i > 0}
          {#if separator}<span {...part('separator')} aria-hidden="true">{separator}</span>
          {:else}<iconify-icon {...part('separator')} icon="lucide:chevron-right" aria-hidden="true"></iconify-icon>{/if}
        {/if}
        {#if item.fold}
          <button {...part('more')} type="button" aria-label="Show {items.length - max + 1} more" onclick={() => (unfolded = true)}>…</button>
        {:else if item.href && !current}
          <a {...part('link')} href={item.href}>
            {#if item.icon}<iconify-icon {...part('icon')} icon={item.icon} aria-hidden="true"></iconify-icon>{/if}{item.label}
          </a>
        {:else}
          <span {...part('link')} data-current={current || undefined} aria-current={current ? 'page' : undefined}>
            {#if item.icon}<iconify-icon {...part('icon')} icon={item.icon} aria-hidden="true"></iconify-icon>{/if}{item.label}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
