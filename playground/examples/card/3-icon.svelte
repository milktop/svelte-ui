<!-- Icon and divider
  `icon` puts a tinted tile beside the heading; `divided` draws a line under the header. -->
<script>
  import { Card, Button, Badge } from '@milktop/svelte-ui'
</script>

<Card icon="lucide:receipt" heading="Invoice #1042" description="Ada Lovelace · due 15 October" divided class="max-w-md">
  {#snippet actions()}<Badge variant="warning" dot>Unpaid</Badge>{/snippet}
  <div class="flex items-baseline justify-between"><span class="text-(--ui-muted)">4 lessons × £35</span><span class="text-2xl font-bold">£140</span></div>
  {#snippet footer()}<Button size="sm" variant="ghost">Download</Button><Button size="sm" variant="primary" icon="lucide:send">Send reminder</Button>{/snippet}
</Card>
