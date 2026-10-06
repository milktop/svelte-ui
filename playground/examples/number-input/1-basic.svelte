<!-- Limits, steps and formatting
  Arrow keys step too (Shift for 10); `formatOptions` formats it (currency here); `allowMouseWheel` steps on scroll while focused. -->
<script>
  import { NumberInput } from '@milktop/svelte-ui'

  let rate = $state(40)
  let minutes = $state(60)
</script>

<NumberInput label="Hourly rate" bind:value={rate} min={0} step={5} formatOptions={{ style: 'currency', currency: 'GBP' }} locale="en-GB" allowMouseWheel />
<NumberInput label="Duration" bind:value={minutes} min={15} max={180} step={15} suffix="min" />
<p>{rate} ({typeof rate}), {minutes}</p>
