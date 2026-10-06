<!-- Folding long trails
  With `max`, the middle crumbs fold into a … button that shows them. -->
<script>
  import { Breadcrumbs, Button } from '@milktop/svelte-ui'
  import { lesson } from './lesson.js'

  let max = $state(4)
</script>

{#key max}<Breadcrumbs items={lesson} {max} />{/key}
<p class="m-0 flex w-full items-center gap-2 text-sm text-(--ui-muted)">max: {max}
  <Button size="sm" onclick={() => (max = 3)}>max = 3</Button>
  <Button size="sm" onclick={() => (max = 4)}>max = 4</Button>
  <Button size="sm" onclick={() => (max = null)}>No max</Button></p>
