<!-- Placement and arrow -->
<script>
  import { HoverCard, Avatar } from '@milktop/svelte-ui'

  const team = [
    { name: 'Ada Lovelace', role: 'Maths', students: 12 },
    { name: 'Alan Turing', role: 'Computer science', students: 9 },
    { name: 'Grace Hopper', role: 'Physics', students: 14 },
  ]
</script>

{#each team as person}
  <HoverCard placement="right" arrow>
    {#snippet trigger(props)}
      <button {...props} type="button" class="cursor-pointer rounded-full border-0 bg-transparent p-0" aria-label={person.name}><Avatar name={person.name} /></button>
    {/snippet}
    <div class="font-semibold">{person.name}</div>
    <div class="text-xs text-(--ui-muted)">{person.role} · {person.students} students</div>
  </HoverCard>
{/each}
