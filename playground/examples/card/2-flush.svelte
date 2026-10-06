<!-- Flush
  No padding round the body, for lists and tables that run edge to edge. -->
<script>
  import { Card } from '@milktop/svelte-ui'

  const lessons = ['Ada: Thursday 16:00', 'Alan: Friday 10:00', 'Grace: Monday 09:30']
</script>

<Card heading="This week" flush class="max-w-md">
  <ul class="m-0 list-none p-0">
    {#each lessons as lesson}
      <li class="border-b border-(--ui-border) px-5 py-3 last:border-0">{lesson}</li>
    {/each}
  </ul>
</Card>
