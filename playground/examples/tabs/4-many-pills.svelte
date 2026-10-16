<!-- Many pills
  A pill list longer than its container scrolls sideways instead of overflowing. -->
<script>
  import { Tabs, Tab } from '@milktop/svelte-ui'

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month = $state('October')
</script>

<div class="w-full max-w-sm">
  <Tabs variant="pills" bind:value={month}>
    {#each months as m (m)}
      <Tab value={m} label={m}>{m}: lessons to come.</Tab>
    {/each}
  </Tabs>
</div>
