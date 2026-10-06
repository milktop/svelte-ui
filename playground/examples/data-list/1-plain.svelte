<!-- Plain
  `items`: `{ label, value, info }`. -->
<script>
  import { DataList } from '@milktop/svelte-ui'

  const details = [
    { label: 'Name', value: 'Ada Lovelace' },
    { label: 'Email', value: 'ada@example.com' },
    { label: 'Year', value: 11, info: 'School year from September' },
    { label: 'Subject', value: 'GCSE Maths' },
  ]
</script>

<DataList items={details} />
