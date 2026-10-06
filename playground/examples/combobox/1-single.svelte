<!-- Pick one or several
  Type to filter (labels starting with it come first). `multiple` shows the picks as tags and binds an array; `hideSelected` takes them out of the list. -->
<script>
  import { Combobox } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Alan Turing' }, { id: 3, name: 'Grace Hopper' },
    { id: 4, name: 'Katherine Johnson' }, { id: 5, name: 'Tim Berners-Lee' },
  ]
  const subjects = ['Biology', 'Chemistry', 'English', 'French', 'Geography', 'History', 'Maths', 'Physics']

  let studentId = $state(null)
  let picked = $state(['Maths'])
</script>

<Combobox label="Student" items={students} labelKey="name" valueKey="id" bind:value={studentId} />
<Combobox label="Subjects" items={subjects} multiple hideSelected variant="accent" bind:value={picked} placeholder="Add a subject…" />
<p>{studentId ?? '—'}, {JSON.stringify(picked)}</p>
