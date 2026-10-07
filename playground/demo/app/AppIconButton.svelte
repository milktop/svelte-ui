<!-- A naked icon button, as in the app's top bar and block headers: just the
     16px icon, grey, darker on hover. No box, so rows of them sit close. -->
<script>
  import { Button } from '@milktop/svelte-ui'

  let { class: className = '', ...rest } = $props()
</script>

<Button variant="ghost" size="sm" {...rest} classes={{ icon: 'text-[16px]' }}
  class="h-auto w-auto min-w-0 rounded-sm bg-transparent p-0 text-gray-500/80 hover:bg-transparent hover:text-gray-700 {className}" />
