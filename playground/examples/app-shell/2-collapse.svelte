<!-- Rail, drawer and breadcrumbs
  This playground's own shell: its sidebar's button (or ⌘B) collapses it to an icon rail, remembered with `persist`; below 768px it's a drawer opened from the top bar. Breadcrumbs fold their middle past `max`. -->
<script>
  import { Breadcrumbs, Button } from '@milktop/svelte-ui'

  const trail = [
    { label: 'Home', href: '#/app-shell' }, { label: 'Students', href: '#/app-shell' }, { label: 'Ada Lovelace', href: '#/app-shell' },
    { label: 'Lessons', href: '#/app-shell' }, { label: 'Quadratics' },
  ]
</script>

<div class="flex w-full flex-col gap-4">
  <Breadcrumbs items={trail} max={3} />
  <Breadcrumbs items={trail.slice(2)} separator="/" />
  <div><Button size="sm" icon="lucide:panel-left" onclick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', metaKey: true }))}>Toggle the sidebar (⌘B)</Button></div>
</div>
