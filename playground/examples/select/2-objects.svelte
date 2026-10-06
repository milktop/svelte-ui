<!-- Objects and a custom item
  `labelKey` and `valueKey` pick the fields; the bound value is the item's own (a number here). The `item` snippet renders each option. -->
<script>
  import { Select } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace', level: 'A Level' },
    { id: 2, name: 'Alan Turing', level: 'GCSE' },
    { id: 3, name: 'Grace Hopper', level: 'IB', disabled: true },
  ]

  let studentId = $state(2)
</script>

<Select label="Student" items={students} labelKey="name" valueKey="id" bind:value={studentId}>
  {#snippet item(student)}
    <span class="flex flex-col"><span>{student.name}</span><span class="text-xs text-(--ui-muted)">{student.level}</span></span>
  {/snippet}
</Select>
<p class="m-0 self-end text-sm text-(--ui-muted)">studentId: {studentId} ({typeof studentId})</p>
