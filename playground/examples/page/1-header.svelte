<!-- A page header
  Heading, description and an `actions` snippet, above the content. (Shown in a box here; normally it fills the main area.) -->
<script>
  import { Page, Button, Card, Input } from '@milktop/svelte-ui'

  let query = $state('')
</script>

<div class="w-full rounded-xl border border-(--ui-border)">
  <Page heading="Students" description="12 students" width="full">
    {#snippet actions()}<Button variant="primary" icon="lucide:plus">Add student</Button>{/snippet}
    <Input icon="lucide:search" placeholder="Search…" bind:value={query} class="mb-4 w-64" />
    <Card>Students matching “{query}” would be listed here.</Card>
  </Page>
</div>
