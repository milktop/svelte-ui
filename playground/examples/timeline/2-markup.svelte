<!-- As markup -->
<script>
  import { Timeline, TimelineItem } from '@milktop/svelte-ui'
</script>

<Timeline>
  <TimelineItem title="Lesson booked" time="2 Oct" icon="lucide:calendar-plus" color="accent" description="Thursday 8 October, 16:00" />
  <TimelineItem title="Invoice paid" time="1 Oct" icon="lucide:receipt" color="success" description="£120 for September" />
  <TimelineItem title="Joined" time="1 Sep" icon="lucide:user-plus" />
</Timeline>
