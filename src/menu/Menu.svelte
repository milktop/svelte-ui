<!--
  A dropdown menu of actions from a trigger.

  <Menu items={actions} onselect={run}>
    {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">Actions</Button>{/snippet}
  </Menu>

  <Menu onselect={run}>
    {#snippet trigger(props)}<Button {...props}>File</Button>{/snippet}
    <MenuItem value="new" icon="lucide:file-plus" shortcut="⌘N">New</MenuItem>
    <Submenu label="Share" icon="lucide:share-2"><MenuItem value="email">Email</MenuItem></Submenu>
    <MenuSeparator />
    <MenuGroup label="Danger zone"><MenuItem value="delete" danger>Delete</MenuItem></MenuGroup>
  </Menu>

  Arrow keys move through the items (right and left open and close
  submenus), typing jumps to one, Enter selects, and Escape or a click outside
  closes it, returning focus to the trigger. Items come from `items`, from
  child components (after any `items`), or both.

  - `items`: strings or objects with `labelKey`/`valueKey`/`disabledKey` (the
    label stands in for a missing value), plus optional `icon`, `shortcut`,
    `danger` and `href` (a link); `{ separator: true }` draws a line,
    `{ group: 'Label' }` a group heading, and `{ label, icon, items: […] }` a
    submenu with its own items
  - Checkbox and radio entries: `{ type: 'checkbox', value, label, checked }`
    and `{ type: 'radio', name, value, label, checked }` (one checked per
    `name`). The menu updates `checked` and calls `onchange` with
    `{ type, name, value, checked }`
  - `onselect`: called with the chosen action's value, from submenus too
  - `trigger` snippet: spread its props onto your button
  - `placement`: 'bottom-start' (default), 'bottom-end', …
  - `label`: a small label above the items
  - `keepOpen`: stay open after an item is chosen (to tick several); an
    item's own `keepOpen` overrides it
  - `context`: open on right-click (or long-press) of the trigger, at the
    pointer (see ContextMenu)
  - `open`: bindable
  - Child components: MenuItem, MenuSeparator, MenuGroup, Submenu,
    MenuCheckbox, and MenuRadioGroup with MenuRadios
-->
<script>
  import * as menu from '@zag-js/menu'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import MenuItems from './MenuItems.svelte'
  import { provideMenu } from './context.js'
  import { cx, partsOf } from '../utils.js'
  import { Presence } from '../presence.svelte.js'
  import '../theme.css'
  import './menu.css'

  let {
    items = [], labelKey = 'label', valueKey = 'value', disabledKey = 'disabled', placement = 'bottom-start',
    label = null, keepOpen = false, context = false, open = $bindable(false), onselect = null, onchange = null,
    trigger = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('menu', () => classes)
  const id = $props.id()
  const values = new Map()

  const service = useMachine(menu.machine, () => ({
    id, open, closeOnSelect: !keepOpen,
    positioning: { placement, strategy: 'fixed', gutter: 4 },
    // Enter on a link: Zag's own click doesn't bubble, so routers listening
    // on the document would miss it.
    navigate: (details) => details.node.click(),
    onOpenChange: (details) => { open = details.open },
    onSelect: (details) => select(details.value),
  }))
  const api = $derived(menu.connect(service, normalizeProps))
  const presence = new Presence(() => api.open, 200)

  function select(key) {
    if (values.has(key)) onselect?.(values.get(key))
  }

  provideMenu({
    get api() { return api },
    service, part,
    get keys() { return { labelKey, valueKey, disabledKey } },
    get keepOpen() { return keepOpen },
    get onchange() { return onchange },
    remember: (key, value) => values.set(key, value),
    select,
  })
</script>

{@render trigger?.(context ? api.getContextTriggerProps() : api.getTriggerProps())}
<div {...part('positioner')} {...api.getPositionerProps()}>
  <div {...rest} {...part('content')} {...api.getContentProps()} hidden={!presence.present} class={cx(className)}
    onanimationend={presence.done}>
    {#if label}<div {...part('menu-label')}>{label}</div>{/if}
    <MenuItems {items} />
    {@render children?.()}
  </div>
</div>
