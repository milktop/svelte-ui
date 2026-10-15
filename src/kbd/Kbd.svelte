<!--
  A keyboard key, or a shortcut of several.

  <Kbd>Esc</Kbd>
  <Kbd keys={['⌘', 'K']} />

  - `keys`: several keys, each in its own box (the content, if given, is one key)
  - `size`: 'sm' or 'md'
-->
<script>
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './kbd.css'

  let { keys = null, size = 'md', class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('kbd', () => classes)
</script>

{#if keys}
  <span {...rest} {...part('root')} class={cx(className)} data-size={size}>
    {#each keys as key}<kbd {...part('key')} data-size={size}>{key}</kbd>{/each}
  </span>
{:else}
  <kbd {...rest} {...part('key')} class={cx(className, classes?.key)} data-size={size}>{@render children?.()}</kbd>
{/if}
