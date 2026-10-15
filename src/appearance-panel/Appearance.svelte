<!--
  Light or dark (`colorScheme`), the accent colour and the sidebar style
  (`appearance`), behind one button. The choices are saved.

  <Appearance accents={['teal', 'blue', 'violet']} sidebars={['neutral', 'tint', 'dark']} />
  <Appearance dev />

  - `accents`, `sidebars`: what users may choose, by name (every one if left
    out; see `accents` and `sidebarStyles`). A saved choice outside them moves
    to their first item, so put the default first.
  - `dev`: for trying themes out while building the app; take it off before
    shipping. Offers every accent and sidebar style whatever the lists say,
    any colour, a reset, and the `accents` and `sidebars` to paste for the
    current choice. Its switch turns dev mode off to preview what users get.
  - `schemes`: false leaves out light and dark (e.g. with a ThemeToggle
    elsewhere)
  - `placement`: where the panel opens ('bottom-end')
  - `labels`: words over the locale's `appearance` ones
  - `onchange`: called with appearance's value ({ accent, custom, sidebar })
    when the user changes it
-->
<script>
  import Popover from '../popover/Popover.svelte'
  import Button from '../button/Button.svelte'
  import Segmented from '../segmented/Segmented.svelte'
  import SwatchPicker from '../swatch-picker/SwatchPicker.svelte'
  import NativeSelect from '../native-select/NativeSelect.svelte'
  import Switch from '../switch/Switch.svelte'
  import { colorScheme } from '../color-scheme.svelte.js'
  import { appearance, accents as allAccents, sidebarStyles as allSidebars } from '../appearance.svelte.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './appearance.css'

  let {
    accents = null, sidebars = null, dev = false, schemes = true, placement = 'bottom-end', labels = null, onchange = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('appearance', () => classes)
  const words = $derived({ ...uiLocale.messages.appearance, ...labels })
  let devMode = $state(true)
  const exploring = $derived(dev && devMode)

  // In the lists' own order (the first is the fallback), or every one
  const accentNames = $derived(exploring || !accents ? Object.keys(allAccents) : accents.filter((name) => name in allAccents))
  const sidebarNames = $derived(exploring || !sidebars ? allSidebars : sidebars.filter((name) => allSidebars.includes(name)))

  const schemeIcons = { system: 'lucide:monitor', light: 'lucide:sun', dark: 'lucide:moon' }
  const schemeItems = $derived(['system', 'light', 'dark'].map((s) => ({ value: s, label: uiLocale.messages.themeToggle[s], icon: schemeIcons[s] })))
  const accentItems = $derived(accentNames.map((name) => ({ value: name, label: words.accents[name] ?? name, color: allAccents[name][0][6] })))
  const sidebarItems = $derived(sidebarNames.map((name) => ({ value: name, label: words.sidebars[name] ?? name })))

  // A saved choice outside the lists moves to their first item.
  $effect(() => {
    if (!exploring) appearance.restrict(accentNames, sidebarNames)
  })

  // The current choice as code to paste into the app: the props that offer
  // it, or for a custom colour, the default that sets it.
  const config = $derived(appearance.custom
    ? `appearance.defaults = ${JSON.stringify({ custom: appearance.custom, sidebar: appearance.sidebar })}`
    : `accents={['${appearance.accent}']} sidebars={['${appearance.sidebar}']}`)

  function choose(changes) {
    appearance.update(changes)
    onchange?.(appearance.value)
  }

  function reset() {
    appearance.reset()
    onchange?.(appearance.value)
  }
</script>

<div {...rest} {...part('root')} class={cx(className)}>
  <Popover heading={words.label} {placement}>
    {#snippet trigger(props)}<Button {...props} class={classes?.trigger} variant="ghost" icon="lucide:palette" aria-label={words.label} />{/snippet}
    <div {...part('panel')}>
      {#if schemes}
        <div {...part('setting')}>
          <div {...part('label')}>{words.mode}</div>
          <Segmented size="sm" items={schemeItems} aria-label={words.mode}
            bind:value={() => colorScheme.value, (next) => { if (next) colorScheme.value = next }} />
        </div>
      {/if}
      <div {...part('setting')}>
        <div {...part('label')}>{words.accent}</div>
        <SwatchPicker size="sm" items={accentItems} aria-label={words.accent}
          bind:value={() => (appearance.custom ? null : appearance.accent), (next) => { if (next) choose({ accent: next, custom: null }) }} />
      </div>
      {#if exploring}
        <label {...part('custom')}>
          <input type="color" value={appearance.custom ?? appearance.scale[6]} oninput={(e) => choose({ custom: e.currentTarget.value })} />
          <span>{words.custom}</span>
          {#if appearance.custom}<code>{appearance.custom}</code>{/if}
        </label>
      {/if}
      <div {...part('setting')}>
        <div {...part('label')}>
          <span>{words.sidebar}</span>
          {#if colorScheme.dark}<span {...part('hint')}>{words.lightOnly}</span>{/if}
        </div>
        {#if sidebarItems.length <= 4}
          <Segmented size="sm" items={sidebarItems} aria-label={words.sidebar}
            bind:value={() => appearance.sidebar, (next) => { if (next) choose({ sidebar: next }) }} />
        {:else}
          <NativeSelect size="sm" items={sidebarItems} aria-label={words.sidebar}
            bind:value={() => appearance.sidebar, (next) => { if (next) choose({ sidebar: next }) }} />
        {/if}
      </div>
      {#if dev}
        <div {...part('dev')}>
          <Switch label={words.dev} bind:checked={devMode} />
          {#if exploring}
            <code {...part('config')}>{config}</code>
            <Button size="sm" onclick={reset}>{words.reset}</Button>
          {/if}
        </div>
      {/if}
    </div>
  </Popover>
</div>
