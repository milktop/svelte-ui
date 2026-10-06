<!--
  A placeholder shape while content loads.

  <Skeleton circle width="2.5rem" height="2.5rem" />
  <Skeleton lines={3} />

  - `lines`: that many text-like lines (the last one shorter)
  - `circle`: a circle, e.g. for an avatar
  - `width`, `height`: any CSS length (defaults fit a line of text)

  It is hidden from assistive tech; announce loading elsewhere (aria-busy on
  the region, or a Spinner's label).
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './skeleton.css'

  let { lines = 0, circle = false, width = null, height = null, class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('skeleton', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)} aria-hidden="true"
  data-circle={circle || undefined} data-text={lines > 0 || undefined} style:width style:height>
  {#each { length: lines }, i}
    <span {...part('line')} data-last={(i === lines - 1 && lines > 1) || undefined}></span>
  {/each}
</div>
