<!-- Binding and limits
  The value is an ISO date. Type a date or pick one; `min` and `max` limit both. -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'

  let date = $state('2026-10-06')
</script>

<DatePicker label="Lesson date" bind:value={date} min="2026-10-01" max="2026-12-20" />
<p class="m-0 self-end text-sm text-(--ui-muted)">{date ?? '—'}</p>
