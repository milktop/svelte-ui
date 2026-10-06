<!-- One toast; the Toaster renders these, keyed by toast id. Internal. -->
<script>
  import * as toast from '@zag-js/toast'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'

  let { toast: data, index, parent, part } = $props()

  const service = useMachine(toast.machine, () => ({ ...data, parent, index }))
  const api = $derived(toast.connect(service, normalizeProps))
  const icons = { info: 'lucide:info', success: 'lucide:circle-check', warning: 'lucide:triangle-alert', error: 'lucide:circle-alert' }
</script>

<div {...part('root')} {...api.getRootProps()}>
  <span {...api.getGhostBeforeProps()}></span>
  {#if api.type === 'loading'}<span {...part('spinner')} aria-hidden="true"></span>
  {:else if icons[api.type]}<iconify-icon {...part('icon')} icon={icons[api.type]} aria-hidden="true"></iconify-icon>{/if}
  <div {...part('text')}>
    {#if api.title}<div {...part('title')} {...api.getTitleProps()}>{api.title}</div>{/if}
    {#if api.description}<div {...part('description')} {...api.getDescriptionProps()}>{api.description}</div>{/if}
  </div>
  <!-- Zag calls action.onClick and dismisses the toast. -->
  {#if data.action}<button {...part('action-trigger')} {...api.getActionTriggerProps()}>{data.action.label}</button>{/if}
  <button {...part('close-trigger')} {...api.getCloseTriggerProps()}><iconify-icon icon="lucide:x"></iconify-icon></button>
  <span {...api.getGhostAfterProps()}></span>
</div>
