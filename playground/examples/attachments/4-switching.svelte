<!-- Switching layout
  The layout is the app’s choice: here a Segmented (icons only) is bound to it. -->
<script>
  import { Attachments, Segmented } from '@milktop/svelte-ui'
  import { files } from './files.js'

  let view = $state('grid')
</script>

<div class="flex w-full flex-col gap-3">
  <Segmented items={[{ value: 'grid', label: 'Grid', icon: 'lucide:layout-grid' }, { value: 'list', label: 'List', icon: 'lucide:list' }]}
    iconOnly label="Layout" bind:value={view} />
  <Attachments layout={view} items={files.slice(0, 5)} removable />
</div>
