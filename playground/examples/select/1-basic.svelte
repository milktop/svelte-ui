<!-- Strings and objects
  Plain strings, or objects with `labelKey` and `valueKey`; the bound value is the item's own (a number here). -->
<script>
  import { Select } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace' },
    { id: 2, name: 'Alan Turing' },
    { id: 3, name: 'Grace Hopper', disabled: true },
  ]

  let level = $state(null)
  let studentId = $state(2)
</script>

<Select label="Level" items={['Key Stage 3', 'GCSE', 'A Level', 'IB']} bind:value={level} />
<Select label="Student" items={students} labelKey="name" valueKey="id" bind:value={studentId} />
<p>{level ?? '—'}, {studentId} ({typeof studentId})</p>
