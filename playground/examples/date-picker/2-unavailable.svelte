<!-- Unavailable dates
  `unavailable` gets each date and returns true to block it: weekends here. They show struck through, and arrow-key stepping skips them. -->
<script>
  import { Fields, Field, DatePicker } from '@milktop/svelte-ui'
  import { isWeekend } from '@internationalized/date'

  let start = $state(null)
</script>

<Fields class="w-full">
  <Field label="Start date" span={6} hint="Weekdays only">
    <DatePicker bind:value={start} unavailable={(date) => isWeekend(date, 'en-GB')} />
  </Field>
</Fields>
