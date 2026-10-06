<!-- Cards, with markup -->
<script>
  import { Timeline, TimelineItem, Badge } from '@milktop/svelte-ui'
</script>

<Timeline variant="cards">
  <TimelineItem title="Note added" time="30 Sep" icon="lucide:notebook-pen">
    <p class="m-0 text-(--ui-muted)">Confident with fractions now; start on percentages next week.</p>
  </TimelineItem>
  <TimelineItem title="Homework set" time="24 Sep" icon="lucide:book-open" color="accent">
    <div class="flex flex-wrap gap-2"><Badge>Worksheet 4</Badge><Badge>Due 1 Oct</Badge></div>
  </TimelineItem>
  <TimelineItem title="First lesson" time="10 Sep" icon="lucide:sparkles" color="success" description="Assessment and goals for the year" />
</Timeline>
