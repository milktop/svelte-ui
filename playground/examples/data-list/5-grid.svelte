<!-- Stacked, in a grid -->
<script>
  import { DataList } from '@milktop/svelte-ui'
</script>

<DataList orientation="vertical" columns={3} items={[
  { label: 'Lessons', value: '24' },
  { label: 'Attendance', value: '92%' },
  { label: 'Since', value: 'September 2025' },
  { label: 'Tutor', value: 'Grace Hopper' },
  { label: 'Rate', value: '£35 / hour' },
  { label: 'Payment', value: 'Monthly, by card' },
]} />
