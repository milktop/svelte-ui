<!-- Unavailable dates
  `unavailable` gets each date and returns true to block it: weekends here. They show struck through, and arrow-key stepping skips them. -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'
  import { isWeekend } from '@internationalized/date'
</script>

<DatePicker label="Start date" unavailable={(date) => isWeekend(date, 'en-GB')} />
