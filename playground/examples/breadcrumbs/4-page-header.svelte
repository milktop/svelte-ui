<!-- In a page header -->
<script>
  import { Breadcrumbs, Card, Page, Button } from '@milktop/svelte-ui'
  import { lesson } from './lesson.js'
</script>

<Card>
  <Page heading="Ada Lovelace" description="GCSE Maths, Thursdays at 16:00">
    {#snippet breadcrumbs()}<Breadcrumbs items={lesson.slice(0, 3)} />{/snippet}
    {#snippet actions()}<Button size="sm" variant="primary" icon="lucide:calendar-plus">Book lesson</Button>{/snippet}
  </Page>
</Card>
