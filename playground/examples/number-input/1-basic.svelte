<!-- Limits, steps and formatting
  Arrow keys step too (Shift for 10); `formatOptions` formats it (currency here); `allowMouseWheel` steps on scroll while focused. -->
<script>
  import { Fields, Field, NumberInput } from '@milktop/svelte-ui'

  let rate = $state(40)
  let minutes = $state(60)
</script>

<Fields class="w-full">
  <Field label="Hourly rate" span={6} hint="Bound: {rate} ({typeof rate})">
    <NumberInput bind:value={rate} min={0} step={5} formatOptions={{ style: 'currency', currency: 'GBP' }} locale="en-GB" allowMouseWheel />
  </Field>
  <Field label="Duration" span={6} hint="15 to 180, in 15s"><NumberInput bind:value={minutes} min={15} max={180} step={15} suffix="min" /></Field>
</Fields>
