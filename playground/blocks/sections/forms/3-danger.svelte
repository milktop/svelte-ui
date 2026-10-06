<!-- Danger zone
  A destructive action, set apart, with a confirmation. -->
<script>
  import { Card, Dialog, Button } from '@milktop/svelte-ui'

  let confirming = $state(false)
</script>

<Card class="max-w-xl">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <h3 class="m-0 text-base font-semibold text-(--ui-danger)">Delete account</h3>
      <p class="mt-1 mb-0 text-sm text-(--ui-muted)">Removes your students, lessons and invoices for good.</p>
    </div>
    <Dialog alert size="sm" closable={false} heading="Delete your account?"
      description="This can’t be undone. Download your invoices first if you need them." bind:open={confirming}>
      {#snippet trigger(props)}<Button {...props} variant="danger">Delete account</Button>{/snippet}
      {#snippet footer()}
        <Button onclick={() => (confirming = false)}>Keep it</Button>
        <Button variant="danger" onclick={() => (confirming = false)}>Delete for good</Button>
      {/snippet}
    </Dialog>
  </div>
</Card>
