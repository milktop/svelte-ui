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
  - `scroll`: what scrolls on wide screens: 'window' (default) or 'page',
    where the shell fills the viewport and only the page scrolls. `inset`
    always scrolls the page there. Phones scroll the window either way, so
    the browser can hide its toolbars. The page then takes focus, so Space
    and the arrow keys scroll it straight away, prints in full, and is marked
    `scroll-region` for Inertia's scroll resets. Listen for scrolling on the
    page (`useShell().scroller()` in the shell's parts), not the window.
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
    inset = false, scroll = 'window', collapsed = $bindable(false), persist = null, breakpoint = 768, shortcut = true,
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
  // State, not $derived: a NavItem's tooltip (zag) reads it while being
  // destroyed, mid-update, and that left a derived stale for good (the
  // rail stopped following `collapsed`).
  let rail = $state(false)
  $effect.pre(() => { rail = collapsed && !mobile })
  // Only the page scrolls (see `scroll`).
  const pageScroll = $derived(!mobile && (inset || scroll === 'page'))
  let root = $state()
  const page = () => root?.querySelector(':scope > [data-scope=page]') ?? null

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
    get pageScroll() { return pageScroll },
    scroller: () => (pageScroll && page()) || document.scrollingElement,
    toggle,
    close: () => (drawerOpen = false),
  })

  function onkeydown(e) {
    // Not in rich text editors, where it means bold.
    if (shortcut && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b' && !e.target.isContentEditable) {
      e.preventDefault()
      toggle()
    } else if (e.key === 'Escape' && drawerOpen) drawerOpen = false
    else if (pageScroll && !e.defaultPrevented) {
      const el = page()
      if (el) scrollKey(e, el)
    }
  }

  // The keys that scroll the window do nothing for the page while nothing is
  // focused, and Chrome ignores them on the page itself (focusable, see Page):
  // they scroll it here, and focus it. Focus inside the page leaves them to
  // the browser (fields, nested scrollers).
  function scrollKey(e, page) {
    if (![null, document.body, document.documentElement, page].includes(document.activeElement)) return
    if (e.altKey || e.ctrlKey || e.metaKey) return
    const step = page.clientHeight * 0.875
    const top = {
      ArrowDown: 40, ArrowUp: -40, PageDown: step, PageUp: -step,
      ' ': e.shiftKey ? -step : step,
      Home: -page.scrollTop, End: page.scrollHeight,
    }[e.key]
    if (top === undefined) return
    e.preventDefault()
    page.focus({ preventScroll: true })
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    page.scrollBy({ top, behavior: still ? 'auto' : 'smooth' })
  }
</script>

<svelte:window {onkeydown} />

<div bind:this={root} {...rest} {...part('root')} class={cx(className)} data-inset={inset || undefined}
  data-page-scroll={pageScroll || undefined} data-rail={rail || undefined} data-mobile={mobile || undefined}>
  {@render children?.()}
  {#if mobile && drawerOpen}<div {...part('backdrop')} role="presentation" onclick={() => (drawerOpen = false)}></div>{/if}
</div>
