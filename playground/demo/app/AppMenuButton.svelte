<!-- A header button that opens a menu: an icon and a small chevron, compact. -->
<script>
  import { Button } from '@milktop/svelte-ui'

  let { class: className = '', ...rest } = $props()
</script>

<Button size="sm" iconEnd="lucide:chevron-down" {...rest}
  class="gap-1 px-2.5 text-gray-700 [&>iconify-icon:last-of-type]:text-[12px] [&>iconify-icon:last-of-type]:text-gray-500 {className}" />
