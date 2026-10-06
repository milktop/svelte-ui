<!-- Options in a row
  Strings or objects with icons; `iconOnly` keeps just the icons. -->
<script>
  import { Segmented } from '@milktop/svelte-ui'

  let view = $state('Week')
  let layout = $state('list')
</script>

<Segmented items={['Day', 'Week', 'Month']} bind:value={view} />
<Segmented iconOnly bind:value={layout}
  items={[{ value: 'list', label: 'List', icon: 'lucide:list' }, { value: 'grid', label: 'Grid', icon: 'lucide:grid-2x2' }]} />
<Segmented size="sm" items={['S', 'M', 'L']} value="M" />
<p class="m-0 w-full text-sm text-(--ui-muted)">{view}, {layout}</p>
