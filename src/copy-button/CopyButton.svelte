<!--
  Copies `value` to the clipboard, then shows a tick and "Copied" for a moment.

  <CopyButton value={bookingLink} />
  <Input value={bookingLink} readonly>{#snippet suffix()}<CopyButton value={bookingLink} iconOnly />{/snippet}</Input>

  - `label`, `copiedLabel`: the text ('Copy' and 'Copied'); `iconOnly` hides
    it (it stays the accessible name)
  - `timeout`: how long it shows "Copied" (2000 ms)
  - `oncopy`: called with the value once it is copied
-->
<script>
  import * as clipboard from '@zag-js/clipboard'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './copy-button.css'

  let {
    value = '', label = 'Copy', copiedLabel = 'Copied', iconOnly = false, timeout = 2000, oncopy = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('copy-button', () => classes)
  const id = $props.id()
  const service = useMachine(clipboard.machine, () => ({
    id, value: String(value ?? ''), timeout,
    onStatusChange: (details) => { if (details.copied) oncopy?.(value) },
  }))
  const api = $derived(clipboard.connect(service, normalizeProps))
  const text = $derived(api.copied ? copiedLabel : label)
</script>

<button {...rest} {...part('trigger')} {...api.getTriggerProps()} class={cx(className)}
  data-icon-only={iconOnly || undefined} aria-label={iconOnly ? text : undefined}>
  <iconify-icon {...part('icon')} icon={api.copied ? 'lucide:check' : 'lucide:copy'} aria-hidden="true"></iconify-icon>
  {#if !iconOnly}<span {...part('text')} aria-live="polite">{text}</span>{/if}
</button>
