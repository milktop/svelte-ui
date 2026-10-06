<!-- Simple
  A title, a line about the page, and its main actions. -->
<script>
  import { Button } from '@milktop/svelte-ui'
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
  <div>
    <h1 class="m-0 text-2xl font-bold">Invoices</h1>
    <p class="mt-1 mb-0 text-sm text-(--ui-muted)">Bill students and track what’s been paid.</p>
  </div>
  <div class="flex gap-2">
    <Button icon="lucide:download">Export</Button>
    <Button variant="primary" icon="lucide:plus">New invoice</Button>
  </div>
</div>
