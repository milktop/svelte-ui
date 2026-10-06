<!-- Line
  With no value the first enabled tab is selected. -->
<script>
  import { Tabs, Tab, Button } from '@milktop/svelte-ui'

  let tab = $state(null)
</script>

<Tabs bind:value={tab}>
  <Tab value="lessons" label="Lessons" icon="lucide:calendar">Upcoming lessons: Maths with Ada on Thursday, Physics with Alan on Friday.</Tab>
  <Tab value="students" label="Students" icon="lucide:users">12 active students, 3 waiting for a first lesson.</Tab>
  <Tab value="invoices" label="Invoices" icon="lucide:receipt">2 invoices are due this week.</Tab>
  <Tab value="reports" label="Reports" disabled>Coming soon.</Tab>
</Tabs>
<p class="m-0 flex w-full items-center gap-3 text-sm text-(--ui-muted)">tab: {JSON.stringify(tab)}
  <Button size="sm" onclick={() => (tab = 'invoices')}>Invoices</Button></p>
