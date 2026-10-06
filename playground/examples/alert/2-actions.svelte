<!-- With actions, dismissible
  An `actions` snippet; `ondismiss` adds the close button. -->
<script>
  import { Alert, Button } from '@milktop/svelte-ui'

  let shown = $state(true)
</script>

{#if shown}
  <Alert variant="warning" heading="Your profile is incomplete" ondismiss={() => (shown = false)} class="w-full">
    Students can’t book you until you add your availability.
    {#snippet actions()}<Button size="sm">Add availability</Button>{/snippet}
  </Alert>
{:else}
  <Button size="sm" onclick={() => (shown = true)}>Show it again</Button>
{/if}
