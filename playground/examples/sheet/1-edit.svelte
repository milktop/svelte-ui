<!-- Edit form
  The body scrolls; the header and footer stay put. -->
<script>
  import { Sheet, Button, Fields, Field, Textarea } from '@milktop/svelte-ui'

  const lessons = [
    { date: 'Thu 8 Oct', topic: 'Fractions and decimals' },
    { date: 'Thu 1 Oct', topic: 'Ratio and proportion' },
    { date: 'Thu 24 Sep', topic: 'Percentages' },
    { date: 'Thu 17 Sep', topic: 'Negative numbers' },
    { date: 'Thu 10 Sep', topic: 'Place value' },
  ]

  let editing = $state(false)
  let student = $state({ name: 'Ada Lovelace', email: 'ada@example.com', year: 11, notes: 'Prefers worked examples.' })
  let draft = $state({})

  $effect(() => { if (editing) draft = { ...student } })

  function save() {
    student = draft
    editing = false
  }
</script>

<Sheet heading="Edit student" description="Changes are saved to their profile." bind:open={editing}>
  {#snippet trigger(props)}<Button {...props} icon="lucide:pencil">Edit student</Button>{/snippet}
  <Fields>
    <Field label="Name" bind:value={draft.name} />
    <Field span={8} label="Email" type="email" bind:value={draft.email} />
    <Field span={4} label="Year" type="number" min={7} max={13} bind:value={draft.year} />
    <Field label="Notes"><Textarea bind:value={draft.notes} /></Field>
  </Fields>
  <h3 class="mt-8 mb-3 text-sm font-semibold">Recent lessons</h3>
  <ul class="m-0 flex list-none flex-col gap-3 p-0">
    {#each lessons as lesson}
      <li class="flex justify-between gap-4 border-b border-(--ui-border) pb-3">{lesson.topic}<span class="text-(--ui-muted)">{lesson.date}</span></li>
    {/each}
  </ul>
  {#snippet footer()}
    <Button onclick={() => (editing = false)}>Cancel</Button>
    <Button variant="primary" onclick={save}>Save</Button>
  {/snippet}
</Sheet>
<p class="m-0 w-full text-sm text-(--ui-muted)">student: {JSON.stringify(student)}</p>
