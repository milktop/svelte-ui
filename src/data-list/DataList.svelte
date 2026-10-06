<!--
  Labels and their values, as a description list (<dl>), e.g. a student's details.

  <DataList items={[
    { label: 'Email', value: 'ada@example.com' },
    { label: 'Year', value: 11, info: 'School year in September' },
  ]} />

  Or as markup, when values need more than text:

  <DataList>
    <DataItem label="Status"><Badge variant="success">Active</Badge></DataItem>
  </DataList>

  - `items`: `{ label, value, info }` (value shown as text)
  - `orientation`: 'horizontal' (default; labels beside values) or 'vertical' (labels above)
  - `variant`: 'plain' (default), 'divided' (lines between items) or 'card'
    (a bordered box with lines between)
  - `columns`: lays items out in a grid of this many columns (stacking on
    narrow screens); best with vertical items
  - `labelWidth`: the label column's width when horizontal ('10rem')
-->
<script>
  import DataItem from './DataItem.svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './data-list.css'

  let {
    items = null, orientation = 'horizontal', variant = 'plain', columns = null, labelWidth = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('data-list', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-orientation={orientation} data-variant={variant}
  data-grid={columns ? '' : undefined} style:--columns={columns} style:--label-width={labelWidth}>
  <dl {...part('list')}>
    {#each items ?? [] as item}<DataItem label={item.label} info={item.info}>{item.value ?? ''}</DataItem>{/each}
    {@render children?.()}
  </dl>
</div>
