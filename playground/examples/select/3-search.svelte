<!-- Searchable
  `searchable` turns it into an input that filters the list (labels starting with the text first). With `multiple`, the picks show as tags. -->
<script>
  import { Select } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Alan Turing' }, { id: 3, name: 'Grace Hopper' },
    { id: 4, name: 'Katherine Johnson' }, { id: 5, name: 'Tim Berners-Lee' },
  ]
  const subjects = ['Biology', 'Chemistry', 'English', 'French', 'Geography', 'History', 'Maths', 'Physics']

  let studentId = $state(null)
  let picked = $state(['Maths'])
</script>

<Select label="Student" items={students} labelKey="name" valueKey="id" searchable clearable bind:value={studentId} />
<Select label="Subjects" items={subjects} searchable multiple hideSelected variant="accent" bind:value={picked} placeholder="Add a subject…" />
<p>{studentId ?? '—'}, {JSON.stringify(picked)}</p>
