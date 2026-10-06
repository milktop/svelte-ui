<!--
  An app layout: the sidebar down the left, the top bar and page beside it.
  Put a Sidebar, a Topbar and a Page inside; each takes its place.

  <AppShell inset persist="app:sidebar">
    <Sidebar>…</Sidebar>
    <Topbar>…</Topbar>
    <Page>…</Page>
  </AppShell>

  - `inset`: the page as a rounded panel on a frame, with a grey sidebar
    whose hovered and current items go white (the `--ui-sidebar-inset-*` tokens)
  - `collapsed`: bindable; the sidebar as an icon rail
  - `persist`: a localStorage key to remember `collapsed`
  - `breakpoint`: below this width (768px) the sidebar is a drawer, opened
    from the top bar's menu button
  - `shortcut`: false to leave ⌘B alone (for a second shell on the page)

  ⌘B (Ctrl+B) collapses the sidebar, or opens the drawer on phones; Escape
  closes the drawer.
-->
<script>
  import { cx, partsOf, provideShell } from '../utils.js'
  import '../theme.css'
  import './app-shell.css'

  let {
    inset = false, collapsed = $bindable(false), persist = null, breakpoint = 768, shortcut = true,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('app-shell', () => classes)

  if (persist) {
    try {
      const saved = localStorage.getItem(persist)
      if (saved !== null) collapsed = saved === 'true'
    } catch {}
  }

  let mobile = $state(false)
  let drawerOpen = $state(false)
  const rail = $derived(collapsed && !mobile)

  $effect(() => {
    const query = matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => {
      mobile = query.matches
      if (!mobile) drawerOpen = false
    }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  })

  // Where the main area starts, for things fixed to the viewport that centre
  // over it (ActionBar).
  $effect(() => {
    if (!shortcut) return
    const left = mobile ? '0px' : rail ? 'var(--ui-sidebar-rail-width)' : 'var(--ui-sidebar-width)'
    document.documentElement.style.setProperty('--ui-main-left', left)
    return () => document.documentElement.style.removeProperty('--ui-main-left')
  })

  function toggle() {
    if (mobile) return (drawerOpen = !drawerOpen)
    collapsed = !collapsed
    try { if (persist) localStorage.setItem(persist, String(collapsed)) } catch {}
  }

  provideShell({
    get rail() { return rail },
    get mobile() { return mobile },
    get drawerOpen() { return drawerOpen },
    toggle,
    close: () => (drawerOpen = false),
  })

  function onkeydown(e) {
    // Not in rich text editors, where it means bold.
    if (shortcut && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b' && !e.target.isContentEditable) {
      e.preventDefault()
      toggle()
    } else if (e.key === 'Escape' && drawerOpen) drawerOpen = false
  }
</script>

<svelte:window {onkeydown} />

<div {...rest} {...part('root')} class={cx(className)} data-inset={inset || undefined}
  data-rail={rail || undefined} data-mobile={mobile || undefined}>
  {@render children?.()}
  {#if mobile && drawerOpen}<div {...part('backdrop')} role="presentation" onclick={() => (drawerOpen = false)}></div>{/if}
</div>
