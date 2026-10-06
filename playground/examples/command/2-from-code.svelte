<!-- Opened from code
  No trigger: bind `open`. -->
<script>
  import { Command, Button } from '@milktop/svelte-ui'
  import { actions } from './actions.js'

  let open = $state(false)
  let picked = $state(null)
</script>

<Command items={actions} hotkey={null} bind:open onselect={(value) => (picked = value)} />
<Button onclick={() => (open = true)}>Open it</Button>
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify({ open, picked })}</p>
