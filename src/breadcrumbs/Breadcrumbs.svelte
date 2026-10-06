<!--
  Where the page sits: links from the top down to the current page.

  <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Students' }]} />

  - `items`: `{ label, href, icon }`; the last is the current page
  - `label`: what assistive tech calls the nav ('Breadcrumb')
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './breadcrumbs.css'

  let { items = [], label = 'Breadcrumb', class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('breadcrumbs', () => classes)
</script>

<nav {...rest} {...part('root')} class={cx(className)} aria-label={label}>
  <ol {...part('list')}>
    {#each items as item, i}
      {@const current = i === items.length - 1}
      <li {...part('crumb')}>
        {#if i > 0}<iconify-icon {...part('separator')} icon="lucide:chevron-right" aria-hidden="true"></iconify-icon>{/if}
        {#if item.href && !current}
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
