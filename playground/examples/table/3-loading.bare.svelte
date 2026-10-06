<!-- Loading and empty
  `loading` shows skeleton rows while there are none; an `empty` snippet replaces `emptyText`. -->
<script>
  import { Table, EmptyState, Button } from '@milktop/svelte-ui'
  import { students } from './students.js'

  const columns = [
    { key: 'name', label: 'Student', sortable: true },
    { key: 'subject', label: 'Subject' },
    { key: 'lessons', label: 'Lessons', align: 'end', sortable: true },
  ]
  let loading = $state(false)
  let empty = $state(false)
</script>

<div class="flex w-full flex-col gap-3">
  <Table {columns} rows={empty || loading ? [] : students.slice(0, 4)} {loading}>
    {#snippet empty()}
      <EmptyState icon="lucide:users" heading="No students yet" description="Add your first student to get started.">
        <Button size="sm" variant="primary" icon="lucide:plus">Add student</Button>
      </EmptyState>
    {/snippet}
  </Table>
  <div class="flex gap-2">
    <Button size="sm" onclick={() => (loading = !loading)}>{loading ? 'Stop loading' : 'Load'}</Button>
    <Button size="sm" onclick={() => (empty = !empty)}>{empty ? 'Show rows' : 'Empty'}</Button>
  </div>
</div>
