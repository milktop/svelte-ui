<!-- With breadcrumbs and details -->
<script>
  import { Breadcrumbs, Button } from '@milktop/svelte-ui'
</script>

<div class="flex flex-col gap-3">
  <Breadcrumbs items={[{ label: 'Lessons', href: '#' }, { label: 'October', href: '#' }, { label: 'Maths with Ada' }]} />
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="m-0 text-2xl font-bold">Maths with Ada</h1>
      <div class="mt-2 flex flex-wrap gap-4 text-sm text-(--ui-muted) [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1.5">
        <span><iconify-icon icon="lucide:calendar"></iconify-icon>Thursday 8 October</span>
        <span><iconify-icon icon="lucide:clock"></iconify-icon>16:00–17:00</span>
        <span><iconify-icon icon="lucide:map-pin"></iconify-icon>Online</span>
      </div>
    </div>
    <div class="flex gap-2">
      <Button icon="lucide:pencil">Edit</Button>
      <Button variant="primary" icon="lucide:video">Join</Button>
    </div>
  </div>
</div>
