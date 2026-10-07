<!--
  A card: a surface grouping related content.

  <Card heading="Next lesson" description="Thursday at 16:00" icon="lucide:calendar">
    {#snippet actions()}<Button size="sm">Reschedule</Button>{/snippet}
    …body…
  </Card>

  - `heading`, `description`: the header; `icon`: an Iconify name in a
    tinted tile beside them
  - `actions` snippet: beside the heading; `footer` snippet: a tinted strip
    along the bottom
  - `variant`: 'default' (a bordered surface), 'elevated' (lifted, no
    border), 'outline' (a border, no fill or shadow) or 'subtle' (a tinted
    fill, for a panel inside a page or another card)
  - `size`: 'sm', 'md' (default) or 'lg': the padding
  - `divided`: a line between the header and the body
  - `href`: the whole card is a link, lifting on hover
  - `flush`: no padding round the body, for content that runs edge to edge (a table, a list)
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './card.css'

  let {
    heading = null, description = null, icon = null, variant = 'default', size = 'md', divided = false, href = null,
    flush = false, actions = null, footer = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('card', () => classes)
</script>

<svelte:element this={href ? 'a' : 'div'} {...rest} {...part('root')} {href} class={cx(className)} data-variant={variant}
  data-size={size} data-flush={flush || undefined} data-divided={divided || undefined} data-link={href ? '' : undefined}>
  {#if heading || description || actions || icon}
    <div {...part('header')}>
      {#if icon}<span {...part('icon')} aria-hidden="true"><iconify-icon {icon}></iconify-icon></span>{/if}
      <div {...part('titles')}>
        {#if heading}<h3 {...part('heading')}>{heading}</h3>{/if}
        {#if description}<p {...part('description')}>{description}</p>{/if}
      </div>
      {#if actions}<div {...part('actions')}>{@render actions()}</div>{/if}
    </div>
  {/if}
  {#if children}<div {...part('body')}>{@render children()}</div>{/if}
  {#if footer}<div {...part('footer')}>{@render footer()}</div>{/if}
</svelte:element>
