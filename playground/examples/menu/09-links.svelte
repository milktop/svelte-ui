<!-- Links and click handlers
  Items with `href` are links, so middle-click and "open in new tab" work. Neither needs a `value`: an item without one uses its label. A MenuItem can take its own `onclick` (Enter clicks the highlighted item too). -->
<script>
  import { Menu, MenuItem, MenuSeparator, Button } from '@milktop/svelte-ui'

  const pages = [
    { label: 'Buttons', icon: 'lucide:mouse-pointer-click', href: '#/button' },
    { label: 'Dialogs', icon: 'lucide:app-window', href: '#/dialog' },
    { separator: true },
    { label: 'Copy page link', icon: 'lucide:link' },
  ]
  let selected = $state(null)
  let clicked = $state(null)
</script>

<Menu items={pages} onselect={(value) => (selected = value)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Go to</Button>{/snippet}
</Menu>
<Menu>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">More</Button>{/snippet}
  <MenuItem href="#/button" icon="lucide:mouse-pointer-click">Buttons</MenuItem>
  <MenuItem href="#/dialog" icon="lucide:app-window">Dialogs</MenuItem>
  <MenuSeparator />
  <MenuItem icon="lucide:link" onclick={() => (clicked = 'Copy page link')}>Copy page link</MenuItem>
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify({ selected, clicked })}</p>
