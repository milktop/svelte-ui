<!-- A line between items in a Menu or Submenu. -->
<script>
  import { useMenu } from './context.js'

  const menu = useMenu()
</script>

<div {...menu.part('separator')} {...menu.api.getSeparatorProps()}></div>
