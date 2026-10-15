<!-- In a form, new or edit
  One form for both: a new record starts with no files, an edit with the saved ones (plain objects with an `id`). In a Field it takes the label, hint and error. With `name` and `keptName` it posts with the form like any input: the new Files, and the ids of the saved files still there (so the server can delete the rest). Submit to see what would be sent. -->
<script>
  import { Attachments, Field, Fields, Input, Segmented, Button } from '@milktop/svelte-ui'
  import { photo } from './files.js'

  const saved = [
    { id: 101, name: 'Worksheet 4.pdf', size: 482000, type: 'application/pdf' },
    { id: 102, name: 'Homework photo.jpg', size: 910000, type: 'image/jpeg', ...photo('form-homework') },
  ]

  let mode = $state('new')
  const record = $derived(mode === 'edit' ? { title: 'Fractions homework', files: saved } : null)
  let title = $state('')
  let files = $state([])
  let error = $state(null)
  let sent = $state(null)

  // A fresh form for each mode, as an app would have one per record.
  $effect(() => {
    title = record?.title ?? ''
    files = record?.files ?? []
    error = sent = null
  })

  function submit(e) {
    e.preventDefault()
    if (!files.length) return (error = 'Attach at least one file')
    error = null
    // What a plain form post would send, read back from the form itself.
    const data = new FormData(e.currentTarget)
    const removed = (record?.files ?? []).filter((file) => !files.includes(file))
    sent = JSON.stringify({
      title: data.get('title'),
      newFiles: data.getAll('files').map((file) => file.name),
      keep: data.getAll('keep'),
      removed: removed.map((file) => file.id),
    }, null, 1)
  }
</script>

<div class="flex w-full flex-col gap-4">
  <Segmented items={[{ value: 'new', label: 'New record' }, { value: 'edit', label: 'Edit record' }]} bind:value={mode} />
  <form onsubmit={submit} novalidate class="flex w-full flex-col gap-4">
    <Fields>
      <Field label="Title" span={12}><Input name="title" bind:value={title} placeholder="e.g. Fractions homework" /></Field>
      <Field label="Files" hint="Images or PDFs, up to 5." {error} required span={12}>
        <Attachments bind:items={() => files, (next) => { files = next; error = null }} addable removable layout="list"
          accept="image/*,.pdf" maxFiles={5} name="files" keptName="keep" />
      </Field>
    </Fields>
    <div class="flex items-center gap-3">
      <Button type="submit" variant="primary">{record ? 'Save changes' : 'Create'}</Button>
      {#if sent}<pre class="m-0 flex-1 overflow-x-auto text-xs text-(--ui-muted)">{sent}</pre>{/if}
    </div>
  </form>
</div>
