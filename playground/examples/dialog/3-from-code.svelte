<!-- Opened from code
  No trigger: binding `open` is enough. -->
<script>
  import { Dialog, Button } from '@milktop/svelte-ui'

  let open = $state(false)
</script>

<Button onclick={() => (open = true)}>Open dialog</Button>
<Dialog heading="Lesson booked" bind:open>
  Maths with Ada, Thursday 8 October at 16:00. A confirmation is on its way.
  {#snippet footer()}<Button variant="primary" onclick={() => (open = false)}>Done</Button>{/snippet}
</Dialog>
