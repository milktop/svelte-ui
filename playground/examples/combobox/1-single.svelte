<!-- Pick one
  Type to filter; the bound value is the item's own (a number here). -->
<script>
  import { Combobox } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Alan Turing' }, { id: 3, name: 'Grace Hopper' },
    { id: 4, name: 'Katherine Johnson' }, { id: 5, name: 'Tim Berners-Lee' },
  ]

  let studentId = $state(null)
</script>

<Combobox label="Student" items={students} labelKey="name" valueKey="id" bind:value={studentId} />
<p class="m-0 self-end text-sm text-(--ui-muted)">studentId: {studentId ?? '—'}</p>
