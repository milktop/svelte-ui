<!-- Styling and replacing parts
  `classes` for any part, a token for one instance, and `prev`/`next` snippets (they get Zag's props) for your own buttons. -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'
</script>

<DatePicker label="Styled" value="2026-10-06"
  classes={{ prev: 'rounded-full bg-pink-100 text-pink-600', next: 'rounded-full bg-pink-100 text-pink-600', viewTrigger: 'text-pink-700' }} />
<DatePicker label="Rounder" value="2026-10-06" style="--ui-radius: 14px; --ui-accent: #0d9488" />
<DatePicker label="Custom arrows" value="2026-10-06">
  {#snippet prev(props)}<button {...props} class={[props.class, 'w-auto px-2 text-xs']}>← Earlier</button>{/snippet}
  {#snippet next(props)}<button {...props} class={[props.class, 'w-auto px-2 text-xs']}>Later →</button>{/snippet}
</DatePicker>
