<!--
  Events down a line, e.g. a student's history.

  <Timeline items={[
    { title: 'Lesson booked', time: '2 Oct', icon: 'lucide:calendar-plus' },
    { title: 'Invoice paid', time: '1 Oct', description: '£120', color: 'success' },
  ]} />

  Or as markup, when an event needs more than text:

  <Timeline>
    <TimelineItem title="Note added" time="30 Sep" icon="lucide:notebook-pen"><Card>…</Card></TimelineItem>
  </Timeline>

  - `items`: objects with a TimelineItem's props (only `title` is needed)
  - `variant`: 'line' (default) or 'cards' (each item's content in a card)
  - `size`: 'sm' or 'md' (default)
-->
<script>
  import TimelineItem from './TimelineItem.svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './timeline.css'

  let { items = null, variant = 'line', size = 'md', class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('timeline', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-variant={variant} data-size={size}>
  <ol {...part('list')}>
    {#each items ?? [] as item}<TimelineItem {...item} />{/each}
    {@render children?.()}
  </ol>
</div>
