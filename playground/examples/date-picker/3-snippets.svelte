<!-- Replacing parts
  The `prev` and `next` snippets get Zag's props and the part's class; spread them onto your own button. -->
<script>
  import { DatePicker } from '@milktop/svelte-ui'
</script>

<DatePicker label="Custom arrows" value="2026-10-06">
  {#snippet prev(props)}<button {...props} class={[props.class, 'w-auto px-2 text-xs']}>← Earlier</button>{/snippet}
  {#snippet next(props)}<button {...props} class={[props.class, 'w-auto px-2 text-xs']}>Later →</button>{/snippet}
</DatePicker>
