<!-- With a selection
  Tick some lessons. It isn’t modal, so you can keep selecting; Escape inside it or its close button closes it. -->
<script>
  import { ActionBar, Button, CheckboxGroup } from '@milktop/svelte-ui'

  const lessons = [
    { value: 1, label: 'Thu 8 Oct, Maths with Ada' },
    { value: 2, label: 'Fri 9 Oct, English with Alan' },
    { value: 3, label: 'Mon 12 Oct, Physics with Grace' },
    { value: 4, label: 'Tue 13 Oct, Maths with Katherine' },
  ]

  let picked = $state([])
  let done = $state('')

  function act(verb) {
    done = `${verb} ${picked.length} lessons`
    picked = []
  }
</script>

<CheckboxGroup label="Upcoming lessons" items={lessons} selectAll="All lessons" bind:value={picked} />
<ActionBar open={picked.length > 0} onclose={() => (picked = [])}>
  {#snippet selection()}{picked.length} selected{/snippet}
  <Button size="sm" icon="lucide:calendar-clock" onclick={() => act('Rescheduled')}>Reschedule</Button>
  <Button size="sm" variant="danger" icon="lucide:calendar-x" onclick={() => act('Cancelled')}>Cancel</Button>
</ActionBar>
<p class="m-0 w-full text-sm text-(--ui-muted)">picked: {JSON.stringify(picked)} {done}</p>
