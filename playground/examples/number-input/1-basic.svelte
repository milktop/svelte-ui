<!-- Limits, steps and affixes
  Arrow keys step too (Shift for 10). The bound value is a number, or null when empty. -->
<script>
  import { NumberInput } from '@milktop/svelte-ui'

  let rate = $state(40)
  let minutes = $state(60)
</script>

<NumberInput label="Hourly rate" bind:value={rate} min={0} step={5} prefix="£" />
<NumberInput label="Duration" bind:value={minutes} min={15} max={180} step={15} suffix="min" />
<p class="m-0 self-end text-sm text-(--ui-muted)">{rate} ({typeof rate}), {minutes}</p>
