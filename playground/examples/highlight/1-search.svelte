<!-- Search results
  The parts matching the query are marked; several words mark each. -->
<script>
  import { Highlight, Input } from '@milktop/svelte-ui'

  const people = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Margaret Hamilton', 'Barbara Liskov']
  let query = $state('an')
  const words = $derived(query.split(/\s+/).filter(Boolean))
  const found = $derived(people.filter((p) => !words.length || words.some((w) => p.toLowerCase().includes(w.toLowerCase()))))
</script>

<div class="flex w-full flex-col gap-3">
  <Input icon="lucide:search" bind:value={query} class="w-64" />
  <ul class="m-0 list-none p-0 text-sm">
    {#each found as person (person)}<li class="py-1"><Highlight text={person} query={words} /></li>{/each}
  </ul>
</div>
