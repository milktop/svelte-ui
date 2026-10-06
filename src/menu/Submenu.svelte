<!--
  A submenu inside a Menu (or another Submenu): a row that opens a nested
  menu of its own items, from `items` or child components like Menu's.

  <Submenu label="Share" icon="lucide:share-2">
    <MenuItem value="email">Email</MenuItem>
  </Submenu>

  - `label`: the row's text; `icon`: an optional Iconify name before it
  - `items`: as on Menu

  Its items' selections reach the outer Menu's `onselect`.
-->
<script>
  import * as menu from '@zag-js/menu'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import MenuItems from './MenuItems.svelte'
  import { provideMenu, useMenu } from './context.js'
  import { cx } from '../utils.js'
  import { Presence } from '../presence.svelte.js'

  let { label, icon = null, items = [], keepOpen = null, class: className = '', children, ...rest } = $props()

  const outer = useMenu()
  const part = outer.part
  const id = $props.id()

  const service = useMachine(menu.machine, () => ({
    id,
    // Follows its menu unless it sets its own (an undefined here would override Zag's default).
    closeOnSelect: keepOpen == null ? !outer.keepOpen : !keepOpen,
    positioning: { placement: 'right-start', strategy: 'fixed', gutter: 2 },
    navigate: (details) => details.node.click(),
    onSelect: (details) => outer.select(details.value),
  }))
  const api = $derived(menu.connect(service, normalizeProps))
  const presence = new Presence(() => api.open, 200)

  // Zag ties nested menus together through both services.
  $effect(() => {
    outer.api.setChild(service)
    api.setParent(outer.service)
  })

  provideMenu({
    get api() { return api },
    service, part,
    get keys() { return outer.keys },
    get keepOpen() { return keepOpen ?? outer.keepOpen },
    get onchange() { return outer.onchange },
    remember: outer.remember,
    select: outer.select,
  })
</script>

<div {...part('item')} {...outer.api.getTriggerItemProps(api)}>
  {#if icon}<iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon>{/if}
  <span {...part('label')}>{label}</span>
  <iconify-icon {...part('chevron')} icon="lucide:chevron-right" aria-hidden="true"></iconify-icon>
</div>
<div {...part('positioner')} {...api.getPositionerProps()}>
  <div {...rest} {...part('content')} {...api.getContentProps()} hidden={!presence.present} class={cx(className)}
    onanimationend={presence.done}>
    <MenuItems {items} />
    {@render children?.()}
  </div>
</div>
