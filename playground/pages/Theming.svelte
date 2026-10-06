<!-- Theming: brand a section live, a snippet for the whole app, and every token. -->
<script>
  import { Button, Badge, Input, Switch, Checkbox, Progress, Segmented, Field, Table, colorScheme } from '@milktop/svelte-ui'
  import themeSource from '../../src/theme.css?raw'

  // The tokens and their defaults, read from theme.css: the :root block,
  // then the dark block's overrides.
  function readTokens() {
    const tokens = []
    const byName = {}
    let mode = null
    for (const line of themeSource.split('\n')) {
      if (/^\s*:root \{/.test(line)) mode = 'light'
      else if (/^\s*:root\.dark/.test(line)) mode = 'dark'
      else if (/^\s*\}/.test(line)) mode = null
      else if (mode) {
        const m = line.match(/^\s*--(ui-[\w-]+):\s*(.+);/)
        if (!m) continue
        byName[m[1]] ??= tokens[tokens.push({ name: m[1], light: '', dark: '' }) - 1]
        byName[m[1]][mode] = m[2].trim()
      }
    }
    return tokens
  }
  const tokens = readTokens()
  const isColour = (token) => !/radius|font|height|width|shadow|padding|weight/.test(token.name)

  const fonts = [{ value: 'inherit', label: 'Inherit' }, { value: 'Georgia, serif', label: 'Serif' }, { value: 'ui-monospace, monospace', label: 'Mono' }]
  const radii = [{ value: '2px', label: 'Sharp' }, { value: '6px', label: 'Default' }, { value: '12px', label: 'Round' }]

  let accent = $state('#e11d48')
  let radius = $state('12px')
  let font = $state('inherit')
  let agree = $state(true)
  let copied = $state(false)

  // The accent's companions, mixed from it: a soft tint for selections and
  // soft buttons, a deep shade for text on it, and the focus ring.
  const accentTokens = (colour, dark) => ({
    'ui-accent': colour,
    'ui-accent-soft': `color-mix(in srgb, ${colour} ${dark ? 30 : 15}%, ${dark ? 'black' : 'white'})`,
    'ui-accent-soft-text': `color-mix(in srgb, ${colour} ${dark ? 35 : 70}%, ${dark ? 'white' : 'black'})`,
    'ui-ring': colour,
    'ui-ring-soft': `color-mix(in srgb, ${colour} 25%, transparent)`,
  })

  const style = $derived(Object.entries({ ...accentTokens(accent, colorScheme.dark), 'ui-radius': radius, 'ui-font': font })
    .map(([name, value]) => `--${name}: ${value}`).join('; '))

  const snippet = $derived.by(() => {
    const block = (dark) => {
      const all = accentTokens(accent, dark)
      if (!dark) {
        all['ui-radius'] = radius
        if (font !== 'inherit') all['ui-font'] = font
      }
      return Object.entries(all).map(([name, value]) => `  --${name}: ${value};`).join('\n')
    }
    return `:root {\n${block(false)}\n}\n\n:root.dark {\n${block(true)}\n}`
  })

  async function copy() {
    await navigator.clipboard.writeText(snippet)
    copied = true
    setTimeout(() => (copied = false), 1500)
  }
</script>

<h1 class="m-0 text-xl font-bold">Theming</h1>
<p class="mt-1 mb-0 text-sm text-(--ui-muted)">
  Components read <code>--ui-*</code> tokens. Override them on <code>:root</code> to brand the app, or on any element
  (<code>style="--ui-accent: …"</code>) to restyle just what's inside it. All the library's CSS sits in <code>@layer ui</code>,
  so your CSS and Tailwind's utilities beat it without <code>!important</code>.
</p>

<section class="flex flex-col gap-3 py-5">
  <h2 class="m-0 text-base font-semibold">Brand a section</h2>
  <div class="flex flex-wrap items-end gap-4">
    <label class="flex flex-col gap-1.5 text-sm font-medium">Accent
      <input type="color" bind:value={accent} class="h-9 w-16 cursor-pointer rounded-(--ui-radius) border border-(--ui-border) bg-(--ui-surface) p-1" /></label>
    <Field label="Radius"><Segmented items={radii} bind:value={radius} /></Field>
    <Field label="Font"><Segmented items={fonts} bind:value={font} /></Field>
  </div>
  <!-- The overrides apply to this box only. -->
  <div {style} class="flex w-full flex-col gap-4 rounded-[calc(var(--ui-radius)+4px)] border border-dashed border-(--ui-border) p-5 font-(family-name:--ui-font)">
    <div class="flex flex-wrap items-center gap-3">
      <Button variant="primary" icon="lucide:calendar-plus">Book a lesson</Button>
      <Button variant="soft">Soft</Button>
      <Button icon="lucide:bell" aria-label="Notifications" count={3} countColor="accent" />
      <Badge variant="accent">New</Badge>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <Input icon="lucide:search" placeholder="Search students" class="w-64" />
      <Switch label="Reminders" bind:checked={agree} />
      <Checkbox label="Agree" bind:checked={agree} />
    </div>
    <Progress value={64} label="Monthly goal" showValue />
  </div>
  <p class="m-0 text-sm text-(--ui-muted)">The snippet sets these for the whole app, with dark values (a deeper tint) for dark mode. Paste it into your app's CSS.</p>
  <div class="relative">
    <pre class="m-0 overflow-x-auto rounded-(--ui-radius) bg-(--ui-hover) p-4 text-xs leading-relaxed"><code>{snippet}</code></pre>
    <Button size="sm" class="absolute top-2 right-2" onclick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
  </div>
</section>

<section class="flex flex-col gap-3 py-5">
  <h2 class="m-0 text-base font-semibold">Tokens</h2>
  <Table>
    <table>
      <thead><tr><th>Token</th><th>Light</th><th>Dark</th></tr></thead>
      <tbody>
        {#each tokens as token}
          <tr>
            <td>
              {#if isColour(token)}<span class="mr-2 inline-block h-5 w-5 rounded border border-(--ui-border) align-middle" style:background="var(--{token.name})"></span>{/if}
              <code class="text-xs">--{token.name}</code>
            </td>
            <td class="text-xs break-words whitespace-normal text-(--ui-muted)"><code>{token.light}</code></td>
            <td class="text-xs break-words whitespace-normal text-(--ui-muted)"><code>{token.dark || 'same'}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Table>
</section>
