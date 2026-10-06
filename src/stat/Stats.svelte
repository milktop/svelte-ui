<!--
  A responsive grid of stats: one column, then two, then `columns`, as its
  own width (not the screen's) allows.

  <Stats variant="cards">
    <Stat label="Students" value={24} />
    <Stat label="Lessons" value={52} />
  </Stats>

  - `columns`: the most per row (4)
  - `variant`: 'plain' (default), 'cards' (each stat a card) or 'divided'
    (one card split into cells)
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './stat.css'

  let { columns = 4, variant = 'plain', class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('stats', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-variant={variant} style:--columns={columns}>
  <div {...part('grid')}>{@render children?.()}</div>
</div>
