<!-- Header, actions and footer
  `heading` and `description`, plus `actions` and `footer` snippets. -->
<script>
  import { Card, Button } from '@milktop/svelte-ui'
</script>

<Card heading="Next lesson" description="Thursday at 16:00 with Ada" class="max-w-md">
  {#snippet actions()}<Button size="sm">Reschedule</Button>{/snippet}
  Quadratic equations: past paper 2, questions 4 to 7.
  {#snippet footer()}<Button size="sm" variant="ghost">Cancel</Button><Button size="sm" variant="primary">Start</Button>{/snippet}
</Card>
