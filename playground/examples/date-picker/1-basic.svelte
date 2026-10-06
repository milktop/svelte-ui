<!-- Dates, ranges and keys
  The value is an ISO date, or two with `range`. Up and Down in the input step a day (Shift: a week); `min` and `max` limit both. -->
<script>
  import { Fields, Field, DatePicker } from '@milktop/svelte-ui'

  let date = $state('2026-10-06')
  let away = $state([])
</script>

<Fields class="w-full">
  <Field label="Lesson date" span={6} hint="Bound: {date ?? '—'}"><DatePicker bind:value={date} min="2026-10-01" max="2026-12-20" /></Field>
  <Field label="Tutor away" span={6} hint={JSON.stringify(away)}><DatePicker range bind:value={away} /></Field>
</Fields>
