<!--
  A message in the page (not a popup; see Toast for those).

  <Alert variant="warning" heading="Payment overdue">Ada's invoice is 5 days late.</Alert>

  - `variant`: 'info' (default), 'success', 'warning' or 'danger'
  - `heading`: a bold first line; the content is the message
  - `icon`: an Iconify name in place of the variant's, or false for none
  - `ondismiss`: shows a close button that calls it (hide the alert in response)
  - `actions` snippet: buttons under the message

  Danger and warning alerts are role=alert, so assistive tech announces them
  when they appear; the others are role=status.
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './alert.css'

  let {
    variant = 'info', heading = null, icon = true, ondismiss = null, actions = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('alert', () => classes)
  const icons = { info: 'lucide:info', success: 'lucide:circle-check', warning: 'lucide:triangle-alert', danger: 'lucide:circle-alert' }
</script>

<div {...rest} {...part('root')} class={cx(className)} data-variant={variant}
  role={variant === 'danger' || variant === 'warning' ? 'alert' : 'status'}>
  {#if icon}<iconify-icon {...part('icon')} icon={icon === true ? icons[variant] ?? icons.info : icon} aria-hidden="true"></iconify-icon>{/if}
  <div {...part('text')}>
    {#if heading}<div {...part('heading')}>{heading}</div>{/if}
    {#if children}<div {...part('description')}>{@render children()}</div>{/if}
    {#if actions}<div {...part('actions')}>{@render actions()}</div>{/if}
  </div>
  {#if ondismiss}
    <button {...part('close')} type="button" aria-label="Dismiss" onclick={ondismiss}><iconify-icon icon="lucide:x"></iconify-icon></button>
  {/if}
</div>
