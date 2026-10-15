<!--
  A short label, like a status or a count.

  <Badge variant="success" dot>Paid</Badge>

  - `variant`: 'neutral' (default), 'accent', 'success', 'warning', 'danger' or 'outline'
  - `size`: 'sm' or 'md'
  - `icon`: an Iconify name before the text; `dot`: a coloured dot instead
  - `onremove`: an ✕ after the text that calls it: a tag (an applied
    filter, a record's label); `removeLabel` names it ('Remove …')
-->
<script>
  import '../icons.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './badge.css'

  let {
    variant = 'neutral', size = 'md', icon = null, dot = false, onremove = null, removeLabel = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('badge', () => classes)
  let root = $state()
</script>

<span bind:this={root} {...rest} {...part('root')} class={cx(className)} data-variant={variant} data-size={size}>
  {#if dot}<span {...part('dot')} aria-hidden="true"></span>
  {:else if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
  {@render children?.()}
  {#if onremove}
    <button {...part('remove')} type="button" onclick={onremove}
      aria-label={removeLabel ?? uiLocale.messages.common.remove(root?.textContent.trim() ?? '')}>
      <iconify-icon icon="lucide:x" aria-hidden="true"></iconify-icon>
    </button>
  {/if}
</span>
