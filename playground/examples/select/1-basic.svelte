<!-- Strings and objects
  Plain strings, or objects with `labelKey` and `valueKey`; the bound value is the item's own (a number here). -->
<script>
  import { Fields, Field, Select } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace' },
    { id: 2, name: 'Alan Turing' },
    { id: 3, name: 'Grace Hopper', disabled: true },
  ]

  let level = $state(null)
  let studentId = $state(2)
</script>

<Fields class="w-full">
  <Field label="Level" span={6} hint="Bound: {level ?? '—'}"><Select items={['Key Stage 3', 'GCSE', 'A Level', 'IB']} bind:value={level} /></Field>
  <Field label="Student" span={6} hint="Bound: {studentId} ({typeof studentId})">
    <Select items={students} labelKey="name" valueKey="id" bind:value={studentId} />
  </Field>
</Fields>
