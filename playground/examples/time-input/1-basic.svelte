<!-- Times
  'HH:mm', with `step` in minutes (the arrow keys move by it) and `min`/`max`; on phones, the system's wheel. -->
<script>
  import { TimeInput, Field } from '@milktop/svelte-ui'

  let start = $state('09:30')
</script>

<TimeInput label="Starts" bind:value={start} step={15} min="08:00" max="18:00" />
<Field label="Ends" hint="Quarter hours"><TimeInput step={15} /></Field>
<p>start: {JSON.stringify(start)}</p>
