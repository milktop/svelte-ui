<!-- Roomy
  `size` is 'sm', 'md' (default) or 'lg'. -->
<script>
  import { Table } from '@milktop/svelte-ui'
  import { students } from './students.js'

  const columns = [
    { key: 'name', label: 'Student', sortable: true },
    { key: 'subject', label: 'Subject' },
    { key: 'lessons', label: 'Lessons', align: 'end', sortable: true },
  ]
</script>

<Table {columns} rows={students.slice(0, 3)} size="lg" />
