<!-- Styling and replacing parts
  `classes` for any part, a token for one instance, and `prev`/`next` snippets (they get Zag's props) for your own buttons. -->
<script>
  import { Fields, Field, DatePicker } from '@milktop/svelte-ui'
</script>

<Fields class="w-full">
  <Field label="Styled" span={4}>
    <DatePicker value="2026-10-06" classes={{ prev: 'rounded-full bg-pink-100 text-pink-600', next: 'rounded-full bg-pink-100 text-pink-600', viewTrigger: 'text-pink-700' }} />
  </Field>
  <Field label="Rounder" span={4}><DatePicker value="2026-10-06" style="--ui-radius: 14px; --ui-accent: #0d9488" /></Field>
  <Field label="Custom arrows" span={4}>
    <DatePicker value="2026-10-06">
      {#snippet prev(props)}<button {...props} class={[props.class, 'w-auto px-2 text-xs']}>← Earlier</button>{/snippet}
      {#snippet next(props)}<button {...props} class={[props.class, 'w-auto px-2 text-xs']}>Later →</button>{/snippet}
    </DatePicker>
  </Field>
</Fields>
