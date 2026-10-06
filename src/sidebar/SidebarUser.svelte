<!--
  The signed-in user, for the sidebar's footer: avatar, name and a line under
  it, opening a menu of account actions upwards (to the right in the rail,
  where only the avatar shows).

  <SidebarUser name="Ada Lovelace" description="ada@example.com" items={account} onselect={run} />

  It's a Menu with the user as its trigger: give it `items`, Menu's child
  components, or both, and `onselect`.

  - `name`, `description`, `src`
  - `letters`, `color`: passed to the Avatar
-->
<script>
  import 'iconify-icon'
  import Menu from '../menu/Menu.svelte'
  import Avatar from '../avatar/Avatar.svelte'
  import { cx, partsOf, useShell } from '../utils.js'
  import '../theme.css'
  import './sidebar.css'

  let {
    name = '', description = null, src = null, letters = 2, color = 'accent', items = [], onselect = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const shell = useShell()
  const part = partsOf('sidebar-user', () => classes)
  const rail = $derived(!!shell?.rail)
</script>

<div {...part('root')} class={cx(className)} data-rail={rail || undefined}>
  <Menu {...rest} {items} {onselect} placement={rail ? 'right-end' : 'top-start'}>
    {#snippet trigger(props)}
      <button {...props} {...part('trigger')} type="button" aria-label={rail ? name : undefined}>
        <Avatar {name} {src} size="sm" {letters} {color} />
        <span {...part('text')}>
          <span {...part('name')}>{name}</span>
          {#if description}<span {...part('description')}>{description}</span>{/if}
        </span>
        <iconify-icon {...part('indicator')} icon="lucide:chevrons-up-down" aria-hidden="true"></iconify-icon>
      </button>
    {/snippet}
    {@render children?.()}
  </Menu>
</div>
