<!-- Tags
  `onremove` adds an ✕: applied filters, or a record's labels. -->
<script>
  import { Badge, Button } from '@milktop/svelte-ui'

  const all = ['Status: Active', 'Subject: Maths', 'Year 11']
  let filters = $state(all)
</script>

{#each filters as filter (filter)}
  <Badge variant="accent" onremove={() => (filters = filters.filter((f) => f !== filter))}>{filter}</Badge>
{/each}
{#if filters.length < all.length}<Button size="sm" variant="link" onclick={() => (filters = all)}>Reset</Button>{/if}
