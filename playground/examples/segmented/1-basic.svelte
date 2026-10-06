<!-- Options in a row
  Strings or objects with icons; `iconOnly` keeps just the icons (their labels show on hover); `size` matches the buttons. -->
<script>
  import { Fields, Field, Segmented } from '@milktop/svelte-ui'

  let view = $state('Week')
  let layout = $state('list')
</script>

<Fields class="w-full">
  <Field label="View" span={6} hint="Bound: {view}"><Segmented items={['Day', 'Week', 'Month']} bind:value={view} /></Field>
  <Field label="Layout" span={3} hint="Bound: {layout}">
    <Segmented iconOnly bind:value={layout} items={[{ value: 'list', label: 'List', icon: 'lucide:list' }, { value: 'grid', label: 'Grid', icon: 'lucide:grid-2x2' }]} />
  </Field>
  <Field label="Size" span={3}><Segmented size="sm" items={['S', 'M', 'L']} value="M" /></Field>
</Fields>
