<!--
  A line between things: across (between sections) or up (between toolbar
  buttons), with an optional label in the middle ('or', 'Today').

  <Divider />
  <Divider label="or" />
  <Divider orientation="vertical" />

  - `label`: text in the line (or children); `align`: 'center' (default),
    'start' or 'end'
  - `orientation`: 'horizontal' (default) or 'vertical' (as tall as its row)
  - `variant`: 'solid' (default), 'dashed' or 'dotted'
  - `spacing`: the room either side, a CSS length (0.75rem across, 0.5rem up)
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './divider.css'

  let {
    label = null, align = 'center', orientation = 'horizontal', variant = 'solid', spacing = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('divider', () => classes)
  const labelled = $derived(!!(label || children))
</script>

<!-- A labelled line is a separator with a name; a plain one only a separator. -->
<div {...rest} {...part('root')} class={cx(className)} role="separator" aria-orientation={orientation}
  data-orientation={orientation} data-variant={variant} data-align={align} data-labelled={labelled ? '' : undefined} style:--spacing={spacing}>
  {#if labelled}<span {...part('label')}>{#if children}{@render children()}{:else}{label}{/if}</span>{/if}
</div>
