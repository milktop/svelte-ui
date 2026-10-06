<!-- A form
  Fields on a 12-column grid. Controls inside a Field use its label, hint and error. Submit with nothing picked to see the errors. -->
<script>
  import { Fields, Field, Select, DatePicker, Button, Card } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace' },
    { id: 2, name: 'Alan Turing' },
  ]

  let form = $state({ student_id: null, date: null, duration: 60, notes: '' })
  let errors = $state({})
  let saved = $state(null)

  function save(e) {
    e.preventDefault()
    errors = {
      student_id: form.student_id ? null : 'Pick a student',
      date: form.date ? null : 'Pick a date',
    }
    saved = errors.student_id || errors.date ? null : $state.snapshot(form)
  }
</script>

<form onsubmit={save} class="w-full max-w-2xl">
  <Card>
    <Fields legend="New lesson" description="Book a lesson with one of your students.">
      <Field label="Student" error={errors.student_id} span={6}>
        <Select items={students} labelKey="name" valueKey="id" bind:value={form.student_id} />
      </Field>
      <Field label="Date" error={errors.date} span={6}>
        <DatePicker bind:value={form.date} />
      </Field>
      <Field label="Duration" type="number" suffix="min" bind:value={form.duration} hint="Most lessons are 60 minutes" span={6} />
      <Field label="Notes" placeholder="Anything to prepare?" bind:value={form.notes} span={12} />
    </Fields>

    {#snippet footer()}
      {#if saved}<span class="mr-auto text-sm text-(--ui-success)">Saved {JSON.stringify(saved)}</span>{/if}
      <Button type="submit" variant="primary">Book lesson</Button>
    {/snippet}
  </Card>
</form>
