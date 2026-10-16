<!--
  A button, or a link that looks like one when given `href`. Other attributes
  (onclick, aria-label, form, target…) go on the <button> or <a>.

  <Button variant="primary" icon="lucide:save" loading={saving}>Save</Button>
  <Button variant="primary" icon="lucide:plus" href="/invoices/new">New invoice</Button>

  - `variant`: 'default', 'primary', 'danger', 'soft', 'ghost' or 'link'
  - `size`: 'sm', 'md' (matching the inputs' height) or 'lg'
  - `icon`, `iconEnd`: Iconify names; with no text it is an icon button, so give it an aria-label
  - `loading`: a spinner in place of the icon; also disables it
  - `round`: a circle for icon buttons, a pill with text
  - `block`: full width
  - `count`: a badge on the corner (hidden at 0 or null), "99+" past `max`
  - `dot`: a small dot there instead, for "something new"
  - `pulse`: a ring ripples out from the badge or dot (not when the system asks for less motion)
  - `countColor`: 'danger', 'accent', 'success', 'warning' or 'neutral'; or set
    `--ui-button-count-bg` and `--ui-button-count-text` for any other
  - `countLabel`: what the count is, for assistive tech ('new': "Inbox, 3 new")
  - `href`: renders an <a> with the same look and parts; `disabled` (or
    `loading`) drops the href and sets aria-disabled
  - `type`: 'button' by default (pass 'submit' for forms); not on a link
-->
<script>
  import '../icons.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './button.css'

  let {
    variant = 'default', size = 'md', icon = null, iconEnd = null, loading = false,
    round = false, block = false, count = null, max = 99, dot = false, pulse = false, countColor = 'danger', countLabel = null,
    href = null, type = 'button', disabled = false,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('button', () => classes)
  const badge = $derived(count > 0 ? (count > max ? `${max}+` : String(count)) : dot ? '' : null)
  // Read after the label by assistive tech: "Inbox, 3 new".
  const spoken = $derived(count > 0 ? `${count} ${countLabel ?? uiLocale.messages.button.countLabel}` : dot ? countLabel ?? uiLocale.messages.button.countLabel : '')
  // An aria-label hides the button's text from assistive tech, so the count joins the label.
  const label = $derived(rest['aria-label'] && spoken ? `${rest['aria-label']}, ${spoken}` : rest['aria-label'])
  const off = $derived(disabled || loading)
  // A link can't be disabled: without its href it goes nowhere, and aria-disabled says so.
  const attrs = $derived(href != null
    ? { href: off ? undefined : href, 'aria-disabled': off || undefined }
    : { type, disabled: off })
</script>

<svelte:element this={href != null ? 'a' : 'button'} {...rest} {...part('root')} class={cx(className)} {...attrs} aria-label={label}
  data-variant={variant} data-size={size} data-round={round || undefined} data-block={block || undefined}
  data-loading={loading || undefined} data-icon-only={(!children && !(icon && iconEnd)) || undefined} aria-busy={loading || undefined}>
  {#if loading}
    <span {...part('spinner')} aria-hidden="true"></span>
  {:else if icon}
    <iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>
  {/if}
  {@render children?.()}
  {#if iconEnd}<iconify-icon {...part('icon')} icon={iconEnd} aria-hidden="true"></iconify-icon>{/if}
  {#if badge != null}
    <span {...part('badge')} aria-hidden="true" data-dot={badge === '' || undefined} data-pulse={pulse || undefined} data-color={countColor}>{badge}</span>
    {#if !rest['aria-label']}<span {...part('spoken')}>, {spoken}</span>{/if}
  {/if}
</svelte:element>
