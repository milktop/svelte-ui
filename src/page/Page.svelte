<!--
  A page: its header (heading, description, actions) and content, at a
  readable width.

  <Page heading="Students" description="12 students">
    {#snippet actions()}<Button variant="primary">Add student</Button>{/snippet}
    …content…
  </Page>

  - `heading`, `description`
  - `width`: 'narrow', 'default', 'wide' or 'full'
  - `align`: 'center' or 'start'
  - `actions`, `breadcrumbs` snippets

  When the shell scrolls the page rather than the window, the page can take
  focus (so the keyboard scrolls it) and is marked `scroll-region`, so
  Inertia resets and restores its scroll on visits as it does the window's.
-->
<script>
  import { cx, partsOf, provideShell, useShell } from '../utils.js'
  import '../theme.css'
  import './page.css'

  let {
    heading = null, description = null, width = 'default', align = 'center',
    actions = null, breadcrumbs = null,
    class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('page', () => classes)

  const shell = useShell()
  const scrolling = $derived(shell?.pageScroll ? { tabindex: -1, 'scroll-region': '' } : {})

  // What's inside a page isn't the shell's: a Sidebar shown in it (as an
  // example, say) doesn't collapse or turn into a drawer with the app's.
  provideShell(null)
</script>

<div {...scrolling} {...rest} {...part('root')} class={cx(className)} data-width={width} data-align={align}>
  <div {...part('inner')}>
    {#if heading || description || actions || breadcrumbs}
      <header {...part('header')}>
        {#if breadcrumbs}<div {...part('breadcrumbs')}>{@render breadcrumbs()}</div>{/if}
        <div {...part('titles')}>
          <div>
            {#if heading}<h1 {...part('heading')}>{heading}</h1>{/if}
            {#if description}<p {...part('description')}>{description}</p>{/if}
          </div>
          {#if actions}<div {...part('actions')}>{@render actions()}</div>{/if}
        </div>
      </header>
    {/if}
    <div {...part('content')}>{@render children?.()}</div>
  </div>
</div>
