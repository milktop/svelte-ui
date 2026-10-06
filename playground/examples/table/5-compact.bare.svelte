<!-- Compact, with a sticky header
  `maxHeight` scrolls the rows under the header. -->
<script>
  import { Table } from '@milktop/svelte-ui'
  import { students } from './students.js'

  const columns = [
    { key: 'name', label: 'Student', sortable: true },
    { key: 'subject', label: 'Subject' },
    { key: 'lessons', label: 'Lessons', align: 'end', sortable: true },
  ]
  let sort = $state({ key: 'lessons', dir: 'desc' })
</script>

<Table {columns} rows={students} size="sm" maxHeight="16rem" bind:sort />
