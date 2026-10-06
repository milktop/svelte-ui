<!-- Arrow and modal
  `arrow` points the panel at its trigger; `modal` traps focus and blocks the page until it closes. -->
<script>
  import { Popover, Button, Fields, Field, Input } from '@milktop/svelte-ui'
</script>

<Popover heading="Rename" arrow placement="bottom-start">
  {#snippet trigger(props)}<Button {...props} icon="lucide:pencil">With an arrow</Button>{/snippet}
  <Input value="Algebra" />
</Popover>
<Popover heading="Quick note" description="Focus stays in here until you close it." modal closable>
  {#snippet trigger(props)}<Button {...props} icon="lucide:sticky-note">Modal</Button>{/snippet}
  <Fields><Field label="Note"><Input placeholder="Remember…" /></Field></Fields>
</Popover>
