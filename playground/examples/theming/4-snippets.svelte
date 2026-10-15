<!-- A part's content: snippets
  Where a part's markup is the thing to change, the component takes a snippet for it: a select's items and chosen value, a tab's trigger, a calendar's events. -->
<script>
  import { Select, Avatar, Tabs, Tab } from '@milktop/svelte-ui'

  const people = [{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Alan Turing' }, { id: 3, name: 'Grace Hopper' }]
  let picked = $state(1)
</script>

{#snippet person(p)}<span class="flex items-center gap-2"><Avatar size="sm" name={p.name} color="auto" />{p.name}</span>{/snippet}

<Select items={people} labelKey="name" valueKey="id" bind:value={picked} class="w-60" item={person} chosen={person} />
<Tabs class="w-full">
  {#snippet trigger(tab)}<span class="italic">{tab.label}</span>{/snippet}
  <Tab value="a" label="Italic">Its own trigger content.</Tab>
  <Tab value="b" label="Labels">Each tab's label, drawn by the snippet.</Tab>
</Tabs>
