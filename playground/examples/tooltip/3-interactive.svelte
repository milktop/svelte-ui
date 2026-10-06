<!-- Interactive
  Stays open while the pointer is over it, so its text can be selected. -->
<script>
  import { Tooltip, Button } from '@milktop/svelte-ui'
</script>

<Tooltip interactive placement="right">
  {#snippet trigger(props)}<Button {...props} icon="lucide:key-round">Booking code</Button>{/snippet}
  {#snippet tip()}Code <strong>TUT-4821-XQ</strong> (select to copy){/snippet}
</Tooltip>
