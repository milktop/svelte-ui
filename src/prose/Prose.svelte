<!--
  Styles rich text: headings, lists, quotes, links, code, images and tables,
  e.g. the HTML an Editor saved, shown on a page.

  <Prose html={lesson.notes} />
  <Prose size="sm"><h2>Homework</h2><p>Worksheet 4…</p></Prose>

  Its look matches the Editor's, so what was written reads the same.

  - `html`: an HTML string to show (only from a source you trust, such as
    your own Editor's output saved by your app); or give it children
  - `size`: 'sm' (13px), 'md' (14px, default) or 'lg' (16px)
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './prose.css'

  let { html = null, size = 'md', class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('prose', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)} data-size={size}>
  {#if html != null}{@html html}{:else}{@render children?.()}{/if}
</div>
