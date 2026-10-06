<!-- Dates, ranges and keys
  The value is an ISO date, or two with `range`. Up and Down in the input step a day (Shift: a week); `min` and `max` limit both. -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'

  let date = $state('2026-10-06')
  let away = $state([])
</script>

<DatePicker label="Lesson date" bind:value={date} min="2026-10-01" max="2026-12-20" />
<DatePicker label="Tutor away" range bind:value={away} />
<p>{date ?? '—'}, {JSON.stringify(away)}</p>
