<!--
  A card: a surface grouping related content.

  <Card heading="Next lesson" description="Thursday at 16:00">
    {#snippet actions()}<Button size="sm">Reschedule</Button>{/snippet}
    …body…
  </Card>

  - `heading`, `description`: the header
  - `actions` snippet: beside the heading; `footer` snippet: a strip along the bottom
  - `flush`: no padding round the body, for content that runs edge to edge (a table, a list)
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './card.css'

  let {
    heading = null, description = null, flush = false, actions = null, footer = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('card', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-flush={flush || undefined}>
  {#if heading || description || actions}
    <div {...part('header')}>
      <div {...part('titles')}>
        {#if heading}<h3 {...part('heading')}>{heading}</h3>{/if}
        {#if description}<p {...part('description')}>{description}</p>{/if}
      </div>
      {#if actions}<div {...part('actions')}>{@render actions()}</div>{/if}
    </div>
  {/if}
  <div {...part('body')}>{@render children?.()}</div>
  {#if footer}<div {...part('footer')}>{@render footer()}</div>{/if}
</div>
