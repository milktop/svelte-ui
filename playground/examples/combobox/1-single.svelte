<!-- Pick one or several
  Type to filter (labels starting with it come first). `multiple` shows the picks as tags and binds an array. -->
<script>
  import { Fields, Field, Combobox } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Alan Turing' }, { id: 3, name: 'Grace Hopper' },
    { id: 4, name: 'Katherine Johnson' }, { id: 5, name: 'Tim Berners-Lee' },
  ]
  const subjects = ['Biology', 'Chemistry', 'English', 'French', 'Geography', 'History', 'Maths', 'Physics']

  let studentId = $state(null)
  let picked = $state(['Maths'])
</script>

<Fields class="w-full">
  <Field label="Student" span={6} hint="Bound: {studentId ?? '—'}"><Combobox items={students} labelKey="name" valueKey="id" bind:value={studentId} /></Field>
  <Field label="Subjects" span={6} hint={JSON.stringify(picked)}>
    <Combobox items={subjects} multiple variant="accent" bind:value={picked} placeholder="Add a subject…" />
  </Field>
</Fields>
