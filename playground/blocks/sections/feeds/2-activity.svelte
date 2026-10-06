<!-- Activity card
  Recent activity, with a link to everything. -->
<script>
  import { Card, Button, Timeline } from '@milktop/svelte-ui'
</script>

<Card heading="Activity" class="max-w-md">
  {#snippet actions()}<Button size="sm" variant="ghost">View all</Button>{/snippet}
  <Timeline size="sm" items={[
    { title: 'Alan paid £140', time: '2h', color: 'success' },
    { title: 'Grace booked Monday 15:30', time: '5h', color: 'accent' },
    { title: 'Ada cancelled Thursday', time: '1d', color: 'danger' },
    { title: 'Radia joined', time: '2d' },
  ]} />
</Card>
