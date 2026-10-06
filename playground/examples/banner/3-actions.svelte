<!-- With actions -->
<script>
  import { Banner, Button } from '@milktop/svelte-ui'
</script>

<Banner variant="warning" icon="lucide:credit-card">
  Your trial ends in 3 days.
  {#snippet actions()}<Button size="sm" variant="ghost">Later</Button><Button size="sm">Choose a plan</Button>{/snippet}
</Banner>
