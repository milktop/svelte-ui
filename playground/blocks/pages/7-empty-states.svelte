<!-- Empty states
  Nothing yet, no results, a failed load and a missing page. -->
<script>
  import { Card, EmptyState, Button, Alert } from '@milktop/svelte-ui'

  let failed = $state(true)
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4">
  <Card>
    <EmptyState icon="lucide:users" heading="No students yet" description="Add your first student to start booking lessons.">
      <Button icon="lucide:upload">Import</Button>
      <Button variant="primary" icon="lucide:user-plus">Add student</Button>
    </EmptyState>
  </Card>
  <Card>
    <EmptyState icon="lucide:search-x" heading="No results for “quantum”" description="Check the spelling or try fewer words.">
      <Button variant="ghost">Clear search</Button>
    </EmptyState>
  </Card>
  {#if failed}
    <Alert variant="danger" heading="Couldn’t load invoices" ondismiss={() => (failed = false)} class="col-span-full">
      The server didn’t respond. Your data is safe; try again in a moment.
      {#snippet actions()}<Button size="sm">Retry</Button>{/snippet}
    </Alert>
  {/if}
  <Card class="col-span-full">
    <div class="flex flex-col items-center py-12 text-center">
      <span class="text-5xl leading-none font-extrabold tracking-tight text-(--ui-accent)">404</span>
      <h2 class="mt-4 mb-0 text-xl font-bold">Page not found</h2>
      <p class="mt-2 mb-0 max-w-sm text-sm text-(--ui-muted)">The page you’re looking for doesn’t exist or has moved.</p>
      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <Button icon="lucide:arrow-left">Go back</Button>
        <Button variant="primary" icon="lucide:house">Dashboard</Button>
      </div>
    </div>
  </Card>
</div>
