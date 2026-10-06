<!--
  A light, dark and system switch, driving `colorScheme`, so every toggle on
  the page stays in step and the choice is saved.

  <ThemeToggle />
  <ThemeToggle variant="menu" />
  <ThemeToggle mobile="menu" />
  <ThemeToggle variant="toggle" />

  - `variant`: 'segmented' (default: icon-only buttons with tooltips), 'menu'
    (one button showing the current choice, opening a menu of all of them) or
    'toggle' (one button flipping between light and dark)
  - `mobile`: the variant below `breakpoint` (e.g. 'menu' where space is tight)
  - `breakpoint`: the width in px `mobile` applies under (768)
  - `options`: which schemes to offer, in order (system, light, dark)
  - `system`: false leaves out 'system' whatever `options` says
  - `labels`: the tooltips and accessible names, `{ light, dark, system }`
  - `label`: names the group for assistive tech
  - `size`: 'sm', 'md' (default) or 'lg', for every variant
  - `placement`: where the menu variant opens ('bottom-end', or 'bottom' with `iconOnly`)
  - `keepOpen`: the menu variant stays open after a choice
  - `iconOnly`: the menu variant lists just the icons, the current one highlighted
  - `onchange`: called with 'light', 'dark' or 'system'
-->
<script>
  import 'iconify-icon'
  import Segmented from '../segmented/Segmented.svelte'
  import Menu from '../menu/Menu.svelte'
  import MenuRadioGroup from '../menu/MenuRadioGroup.svelte'
  import MenuRadio from '../menu/MenuRadio.svelte'
  import Tooltip from '../tooltip/Tooltip.svelte'
  import { colorScheme } from '../color-scheme.svelte.js'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './theme-toggle.css'

  let {
    variant = 'segmented', mobile = null, breakpoint = 768, options = ['system', 'light', 'dark'], system = true,
    labels = { light: 'Light', dark: 'Dark', system: 'System' }, label = 'Colour scheme', placement = null,
    size = 'md', keepOpen = null, iconOnly = false, onchange = null, class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('theme-toggle', () => classes)
  const icons = { light: 'lucide:sun', dark: 'lucide:moon', system: 'lucide:monitor' }

  let narrow = $state(false)
  $effect(() => {
    if (!mobile) return
    const query = matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => (narrow = query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  })

  const mode = $derived(mobile && narrow ? mobile : variant)
  const offersSystem = $derived(system && options.includes('system'))
  const items = $derived(options.filter((s) => icons[s] && (s !== 'system' || system)).map((s) => ({ value: s, label: labels[s], icon: icons[s] })))
  // Without the system option, show what the OS currently resolves to.
  const value = $derived(offersSystem ? colorScheme.value : colorScheme.dark ? 'dark' : 'light')
  const shown = $derived(colorScheme.dark ? 'dark' : 'light')

  function pick(scheme) {
    if (scheme == null || scheme === value) return
    colorScheme.value = scheme
    onchange?.(scheme)
  }
</script>

<div {...rest} {...part('root')} class={cx(className)} role="group" aria-label={label} data-variant={mode} data-size={size}
  data-icon-only={(iconOnly && mode === 'menu') || undefined}>
  {#if mode === 'menu'}
    <Menu placement={placement ?? (iconOnly ? 'bottom' : 'bottom-end')} keepOpen={keepOpen ?? false}>
      {#snippet trigger(props)}
        <button {...props} {...part('trigger')} type="button" aria-label="{label}: {labels[value]}">
          <iconify-icon {...part('trigger-icon')} icon={icons[value]} aria-hidden="true"></iconify-icon>
        </button>
      {/snippet}
      <MenuRadioGroup bind:value={() => value, pick}>
        {#each items as item (item.value)}<MenuRadio value={item.value} icon={item.icon}>{item.label}</MenuRadio>{/each}
      </MenuRadioGroup>
    </Menu>
  {:else if mode === 'toggle'}
    <!-- Flips what's showing, so 'system' becomes an explicit choice. -->
    <Tooltip content={labels[shown]}>
      {#snippet trigger(props)}
        <button {...props} {...part('trigger')} type="button" aria-label={labels.dark} aria-pressed={colorScheme.dark}
          onclick={(e) => { props.onclick?.(e); pick(colorScheme.dark ? 'light' : 'dark') }}>
          <iconify-icon {...part('trigger-icon')} icon={icons[shown]} aria-hidden="true"></iconify-icon>
        </button>
      {/snippet}
    </Tooltip>
  {:else}
    <Segmented iconOnly {size} {items} bind:value={() => value, pick} />
  {/if}
</div>
