<!-- One divided card -->
<script>
  import { Stats, Stat } from '@milktop/svelte-ui'
</script>

<Stats variant="divided" columns={3}>
  <Stat label="Invoiced" value="£2,140" help="October so far" />
  <Stat label="Paid" value="£1,820" change={8} />
  <Stat label="Outstanding" value="£320" change={15} invert />
</Stats>
