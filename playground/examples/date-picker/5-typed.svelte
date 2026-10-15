<!-- Typing a date
  Separators go in as you type (11102026 → 11/10/2026). A date it can't take (past `min` or `max`, unavailable, or not whole) stays, marked invalid with the reason, and `oninvalidchange` hears it. -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'

  let date = $state(null)
  let problem = $state(null)
</script>

<DatePicker label="This term" min="2026-09-07" max="2026-12-18" bind:value={date} oninvalidchange={(reason) => (problem = reason)} />
<p>{JSON.stringify({ date, problem })}</p>
