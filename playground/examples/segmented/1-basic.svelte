<!-- Options in a row
  Strings or objects with icons; `iconOnly` keeps just the icons (their labels show on hover); `size` matches the buttons. -->
<script>
  import { Segmented } from '@milktop/svelte-ui'

  let view = $state('Week')
  let layout = $state('list')
</script>

<Segmented label="View" items={['Day', 'Week', 'Month']} bind:value={view} />
<Segmented label="Layout" iconOnly bind:value={layout}
  items={[{ value: 'list', label: 'List', icon: 'lucide:list' }, { value: 'grid', label: 'Grid', icon: 'lucide:grid-2x2' }]} />
<Segmented label="Size" size="sm" items={['S', 'M', 'L']} value="M" />
<p>{view}, {layout}</p>
