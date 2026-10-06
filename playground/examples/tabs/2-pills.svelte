<!-- Pills -->
<script>
  import { Tabs, Tab } from '@milktop/svelte-ui'

  let view = $state('week')
</script>

<Tabs variant="pills" bind:value={view}>
  <Tab value="day" label="Day">Today: 3 lessons.</Tab>
  <Tab value="week" label="Week">This week: 14 lessons.</Tab>
  <Tab value="month" label="Month">October: 52 lessons.</Tab>
</Tabs>
<p class="m-0 w-full text-sm text-(--ui-muted)">view: {JSON.stringify(view)}</p>
