<!-- Stacked and divided -->
<script>
  import { DataList } from '@milktop/svelte-ui'
</script>

<DataList orientation="vertical" variant="divided" items={[
  { label: 'Name', value: 'Ada Lovelace' },
  { label: 'Email', value: 'ada@example.com' },
  { label: 'Year', value: 11, info: 'School year from September' },
]} />
