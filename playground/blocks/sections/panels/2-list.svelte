<!-- Card with a list
  A short list and a footer link to the rest. -->
<script>
  import { Card, Avatar, Button } from '@milktop/svelte-ui'
  import { students } from '../../data.js'
</script>

<Card flush heading="New students">
  <ul class="m-0 flex list-none flex-col p-0">
    {#each students.slice(0, 4) as student}
      <li class="flex items-center gap-3 border-b border-(--ui-border) px-5 py-3 last:border-0">
        <Avatar size="sm" name={student.name} />
        <span class="grow font-medium">{student.name}</span>
        <span class="text-xs text-(--ui-muted)">{student.subject}</span>
      </li>
    {/each}
  </ul>
  {#snippet footer()}<Button size="sm" variant="ghost" iconEnd="lucide:arrow-right" class="w-full justify-center">All students</Button>{/snippet}
</Card>
