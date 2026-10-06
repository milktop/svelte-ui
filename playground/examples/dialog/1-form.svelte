<!-- Form dialog
  A `trigger` snippet opens it; `footer` holds the buttons. -->
<script>
  import { Dialog, Button, Fields, Field } from '@milktop/svelte-ui'

  let open = $state(false)
  let student = $state({ name: 'Ada Lovelace', email: 'ada@example.com', year: 11 })
  let draft = $state({})

  // A fresh copy each time it opens.
  $effect(() => { if (open) draft = { ...student } })

  function save() {
    student = draft
    open = false
  }
</script>

<Dialog heading="Edit student" description="Changes are saved to their profile." bind:open>
  {#snippet trigger(props)}<Button {...props} icon="lucide:pencil">Edit student</Button>{/snippet}
  <Fields>
    <Field label="Name" bind:value={draft.name} />
    <Field span={8} label="Email" type="email" bind:value={draft.email} />
    <Field span={4} label="Year" type="number" min={7} max={13} bind:value={draft.year} />
  </Fields>
  {#snippet footer()}
    <Button onclick={() => (open = false)}>Cancel</Button>
    <Button variant="primary" onclick={save}>Save</Button>
  {/snippet}
</Dialog>
<p class="m-0 w-full text-sm text-(--ui-muted)">student: {JSON.stringify(student)}</p>
