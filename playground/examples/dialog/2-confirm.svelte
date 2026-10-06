<!-- Confirmation
  `alert` makes it an alertdialog: clicking the backdrop doesn’t close it. -->
<script>
  import { Dialog, Button } from '@milktop/svelte-ui'

  let open = $state(false)
  let deleted = $state(false)
</script>

<Dialog alert size="sm" closable={false} heading="Delete lesson?"
  description="Thursday’s lesson with Ada will be cancelled and both of you notified." bind:open>
  {#snippet trigger(props)}<Button {...props} variant="danger" icon="lucide:trash-2">Delete lesson</Button>{/snippet}
  {#snippet footer()}
    <Button onclick={() => (open = false)}>Keep it</Button>
    <Button variant="danger" onclick={() => { deleted = true; open = false }}>Delete</Button>
  {/snippet}
</Dialog>
<p class="m-0 flex w-full items-center gap-3 text-sm text-(--ui-muted)">deleted: {deleted}
  {#if deleted}<Button size="sm" onclick={() => (deleted = false)}>Undo delete</Button>{/if}</p>
