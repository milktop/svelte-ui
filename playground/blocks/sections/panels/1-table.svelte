<!-- Card with a table
  Card and Table with `flush`: the table runs edge to edge. -->
<script>
  import { Card, Button, Table } from '@milktop/svelte-ui'
  import { upcoming } from '../../data.js'

  const columns = [
    { key: 'student', label: 'Student' },
    { key: 'subject', label: 'Subject' },
    { key: 'when', label: 'When' },
    { key: 'length', label: 'Length', align: 'end' },
  ]
</script>

<Card flush heading="Upcoming lessons" description="The next 7 days">
  {#snippet actions()}<Button size="sm" icon="lucide:calendar">Calendar</Button>{/snippet}
  <Table flush {columns} rows={upcoming} />
</Card>
