<!-- Styling parts
  `classes` for any part, on this instance only. -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'
</script>

<DatePicker label="Styled" value="2026-10-06"
  classes={{ prev: 'rounded-full bg-pink-100 text-pink-600', next: 'rounded-full bg-pink-100 text-pink-600', viewTrigger: 'text-pink-700' }} />
<DatePicker label="Rounder" value="2026-10-06" style="--ui-radius: 14px; --ui-accent: #0d9488" />
