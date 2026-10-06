<!--
  One event in a Timeline; its content shows under the title.

  - `title`: the event
  - `time`: when, as text (format it first)
  - `description`: a line under the title
  - `icon`: an Iconify name in a circle; without one, a dot
  - `color`: tints the marker: 'accent', 'success', 'warning' or 'danger' (grey by default)
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './timeline.css'

  let {
    title = null, time = null, description = null, icon = null, color = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('timeline', () => classes)
</script>

<li {...rest} {...part('item')} class={cx(className)} data-color={color ?? 'neutral'}>
  <div {...part('marker')} aria-hidden="true">
    {#if icon}<span {...part('icon')}><iconify-icon {icon}></iconify-icon></span>{:else}<span {...part('dot')}></span>{/if}
  </div>
  <div {...part('body')}>
    <div {...part('header')}>
      {#if title}<span {...part('heading')}>{title}</span>{/if}
      {#if time}<time {...part('time')}>{time}</time>{/if}
    </div>
    {#if description}<div {...part('description')}>{description}</div>{/if}
    {#if children}<div {...part('content')}>{@render children()}</div>{/if}
  </div>
</li>
