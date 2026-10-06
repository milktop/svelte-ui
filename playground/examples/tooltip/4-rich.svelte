<!-- Rich content and a delay
  A `tip` snippet, and `openDelay`. Without a trigger snippet, the content is wrapped in a span. -->
<script>
  import { Tooltip, Button } from '@milktop/svelte-ui'
</script>

<Tooltip placement="top-start" openDelay={300}>
  {#snippet trigger(props)}<Button {...props}>Rich content</Button>{/snippet}
  {#snippet tip()}<strong>Keyboard</strong><div>Tab here to open it without hovering</div>{/snippet}
</Tooltip>
<Tooltip content="Saving is off while offline">
  <Button disabled>Save (disabled)</Button>
</Tooltip>
