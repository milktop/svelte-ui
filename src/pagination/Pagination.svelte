<!--
  Previous and next buttons and page numbers, with ellipses for long runs.

  <Pagination count={students.length} pageSize={10} bind:page />
  {#each students.slice((page - 1) * 10, page * 10) as student}…{/each}

  - `count`: the number of items; `pageSize` per page (10)
  - `page`: the current page, from 1; bindable. Past the last page (after
    filtering), it goes to the last one
  - `siblingCount`: pages shown either side of the current one (1)
  - `summary`: shows "Showing 11–20 of 95 items" alongside
  - `noun`: what the items are called in the summary ('items')
  - `firstLast`: buttons for the first and last page, shown when some pages
    are hidden behind an ellipsis (false to never show them)
  - `label`: the nav's accessible name
-->
<script>
  import * as pagination from '@zag-js/pagination'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './pagination.css'

  let {
    count = 0, pageSize = 10, page = $bindable(1), siblingCount = 1, summary = false, noun = 'items', firstLast = true,
    label = 'Pagination', class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('pagination', () => classes)
  const id = $props.id()
  const totalPages = $derived(Math.max(1, Math.ceil(count / pageSize)))
  $effect.pre(() => { if (page > totalPages) page = totalPages })

  const service = useMachine(pagination.machine, () => ({
    id, count, pageSize, siblingCount, page, type: 'button',
    onPageChange: (details) => { page = details.page },
  }))
  const api = $derived(pagination.connect(service, normalizeProps))
  const from = $derived(count ? (page - 1) * pageSize + 1 : 0)
  const to = $derived(Math.min(page * pageSize, count))
  // First and last only help when some page numbers are hidden.
  const edges = $derived(firstLast && api.pages.some((item) => item.type === 'ellipsis'))
</script>

<nav {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} aria-label={label}>
  {#if summary}<span {...part('summary')}>Showing {from}–{to} of {count}{noun ? ` ${noun}` : ''}</span>{/if}
  <div {...part('pages')}>
    {#if edges}<button {...part('nav-button')} {...api.getFirstTriggerProps()}><iconify-icon icon="lucide:chevrons-left"></iconify-icon></button>{/if}
    <button {...part('nav-button')} {...api.getPrevTriggerProps()}><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
    {#each api.pages as item, i}
      {#if item.type === 'page'}<button {...part('item')} {...api.getItemProps(item)}>{item.value}</button>
      {:else}<span {...part('ellipsis')} {...api.getEllipsisProps({ index: i })}>…</span>{/if}
    {/each}
    <button {...part('nav-button')} {...api.getNextTriggerProps()}><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
    {#if edges}<button {...part('nav-button')} {...api.getLastTriggerProps()}><iconify-icon icon="lucide:chevrons-right"></iconify-icon></button>{/if}
  </div>
</nav>
