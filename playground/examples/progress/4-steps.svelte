<!-- Steps
  `min` and `max` can be anything; here 3 of 4 steps. -->
<script>
  import { Progress } from '@milktop/svelte-ui'
</script>

<Progress label="Booking" showValue min={0} max={4} value={3} formatOptions={{ style: 'decimal' }} />
