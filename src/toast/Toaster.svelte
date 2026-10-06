<!--
  The region toasts stack in, rendered at the end of <body>. Put one in the
  app layout, then call `toaster` from anywhere:

  <Toaster />
  toaster.success({ title: 'Lesson booked', description: 'Thursday at 16:00' })
  toaster.error({ title: 'Could not save' })
  const id = toaster.loading({ title: 'Uploading…' })
  toaster.update(id, { type: 'success', title: 'Uploaded' })

  Toasts pause while hovered or focused, Escape dismisses the focused one, and
  Alt+T jumps to them. An `action: { label, onClick }` adds a button.

  - `store`: a toaster from createToaster (the shared `toaster` by default)
  - `label`: the region's accessible name ('Notifications')
-->
<script>
  import * as toast from '@zag-js/toast'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import Toast from './Toast.svelte'
  import { toaster } from './toaster.js'
  import { cx, partsOf } from '../utils.js'
  import { portal } from '../presence.svelte.js'
  import '../theme.css'
  import './toast.css'

  let { store = toaster, label = 'Notifications', class: className = '', classes = {} } = $props()

  const part = partsOf('toast', () => classes)
  const id = $props.id()
  const service = useMachine(toast.group.machine, () => ({ id, store }))
  const api = $derived(toast.group.connect(service, normalizeProps))
</script>

<div {@attach portal} {...part('group')} {...api.getGroupProps({ label })} class={cx(className)}>
  {#each api.getToasts() as data, index (data.id)}
    <Toast toast={data} {index} parent={service} {part} />
  {/each}
</div>
