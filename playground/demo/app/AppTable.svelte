<!-- The app's tables, written as markup: no box (the block is the box), small
     headers, striped rows and cells split by hairlines. These rules are
     unlayered, so they beat svelte-ui's (in @layer ui) whatever their weight. -->
<script>
  import { Table } from '@milktop/svelte-ui'

  let { children } = $props()
</script>

<div class="app-table"><Table flush>{@render children?.()}</Table></div>

<style>
  .app-table :global([data-part=scroll]) { border: 0; border-radius: 0; box-shadow: none; background: transparent; }
  .app-table :global(th) { height: auto; padding: 0.75rem 1.5rem; background: white; font-size: 12px; font-weight: 500;
    color: var(--color-gray-700); border-bottom: 1px solid var(--color-gray-100); border-right: 1px solid var(--color-gray-100); }
  .app-table :global(td) { height: auto; padding: 1rem 1.5rem; font-size: 13px; line-height: 1.25rem;
    color: color-mix(in srgb, var(--color-gray-600) 90%, transparent); border-bottom: 0; border-right: 1px solid var(--color-gray-100); }
  .app-table :global(:is(th, td):last-child) { border-right: 0; }
  .app-table :global(tbody tr:nth-child(odd)) { background: var(--color-blue-50); }
  .app-table :global(tbody tr:hover) { background: #e4efff; }
</style>
