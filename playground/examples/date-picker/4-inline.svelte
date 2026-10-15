<!-- Inline
  `inline`: just the month, always showing, e.g. beside a schedule. (EventCalendar's title opens one to jump to a date.) -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'

  let date = $state('2026-10-11')
</script>

<DatePicker inline bind:value={date} />
<p>date: {JSON.stringify(date)}</p>
