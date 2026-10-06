<!--
  A button. Other attributes (onclick, aria-label, form…) go on the <button>.

  <Button variant="primary" icon="lucide:save" loading={saving}>Save</Button>

  - `variant`: 'default', 'primary', 'danger', 'soft' or 'ghost'
  - `size`: 'sm', 'md' (matching the inputs' height) or 'lg'
  - `icon`, `iconEnd`: Iconify names; with no text it is an icon button, so give it an aria-label
  - `loading`: a spinner in place of the icon; also disables it
  - `round`: a circle for icon buttons, a pill with text
  - `block`: full width
  - `count`: a badge on the corner (hidden at 0), "99+" past `max`
  - `type`: 'button' by default (pass 'submit' for forms)
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './button.css'

  let {
    variant = 'default', size = 'md', icon = null, iconEnd = null, loading = false,
    round = false, block = false, count = null, max = 99, type = 'button', disabled = false,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('button', () => classes)
  const badge = $derived(count > 0 ? (count > max ? `${max}+` : String(count)) : null)
</script>

<button {...rest} {...part('root')} class={cx(className)} {type} disabled={disabled || loading}
  data-variant={variant} data-size={size} data-round={round || undefined} data-block={block || undefined}
  data-loading={loading || undefined} data-icon-only={!children || undefined} aria-busy={loading || undefined}>
  {#if loading}
    <span {...part('spinner')} aria-hidden="true"></span>
  {:else if icon}
    <iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>
  {/if}
  {@render children?.()}
  {#if iconEnd}<iconify-icon {...part('icon')} icon={iconEnd} aria-hidden="true"></iconify-icon>{/if}
  {#if badge}<span {...part('badge')} aria-hidden="true">{badge}</span>{/if}
</button>
