<!-- Custom items and parts
  The `item` snippet renders each option; `classes` reaches into the trigger and the list. -->
<script>
  import { Select } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace', level: 'A Level' },
    { id: 2, name: 'Alan Turing', level: 'GCSE' },
  ]
</script>

<Select label="Student" items={students} labelKey="name" valueKey="id" value={1}>
  {#snippet item(student)}
    <span class="flex flex-col"><span>{student.name}</span><span class="text-xs text-(--ui-muted)">{student.level}</span></span>
  {/snippet}
</Select>
<Select label="Colour" items={['Pink', 'Teal', 'Amber']} value="Pink"
  classes={{ trigger: 'rounded-full border-pink-300', item: 'rounded-full', itemIndicator: 'text-pink-600' }} />
