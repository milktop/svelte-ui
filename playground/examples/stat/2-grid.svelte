<!-- In a grid
  `invert` for things where down is good. -->
<script>
  import { Stats, Stat } from '@milktop/svelte-ui'
</script>

<Stats>
  <Stat label="Students" value={36} change={4} changeUnit="" changeLabel="new this month" />
  <Stat label="Lessons" value={52} change={12.5} />
  <Stat label="Revenue" value="£1,820" change={-3.2} />
  <Stat label="Cancellations" value={3} change={-40} invert help="Fewer is better, so down is green" />
</Stats>
