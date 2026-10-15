<!-- Theming: each way to restyle, from the whole app to one part, each live
     (the tokens themselves are on the Tokens page). -->
<script>
  import { Button, Badge, Input, Switch, Checkbox, Progress, Segmented, Field, CopyButton, colorScheme } from '@milktop/svelte-ui'
  import Demo from '../lib/Demo.svelte'
  import { examplesOf } from '../registry.js'

  const fonts = [{ value: 'inherit', label: 'Inherit' }, { value: 'Georgia, serif', label: 'Serif' }, { value: 'ui-monospace, monospace', label: 'Mono' }]
  const radii = [{ value: '2px', label: 'Sharp' }, { value: '6px', label: 'Default' }, { value: '12px', label: 'Round' }]
  const strokes = [{ value: '1.5', label: 'Light' }, { value: '2', label: 'Default' }, { value: '2.5', label: 'Bold' }]

  // Where each way applies, and what it reaches.
  const wins = [
    ['The whole app', ':root { --ui-accent: … }', 'Every component, through tokens'],
    ['Part of a page, or one instance', 'class="[--ui-accent:…]" (or style)', 'Everything inside it; overrides :root'],
    ['Every instance', '[data-scope=checkbox][data-part=control] { … }', 'That part wherever it’s used; beats @layer ui'],
    ['One part of one instance', "classes={{ control: '…' }}", 'That part of that instance'],
    ['A part’s content', '{#snippet item(…)}, {#snippet trigger(…)}', 'What the part shows'],
  ]

  let accent = $state('#e11d48')
  let radius = $state('12px')
  let font = $state('inherit')
  let stroke = $state('2')
  let agree = $state(true)

  // The accent's companions, mixed from it: a soft tint for selections and
  // soft buttons, a deep shade for text on it, and the focus ring.
  const accentTokens = (colour, dark) => ({
    'ui-accent': colour,
    'ui-accent-soft': `color-mix(in srgb, ${colour} ${dark ? 30 : 15}%, ${dark ? 'black' : 'white'})`,
    'ui-accent-soft-text': `color-mix(in srgb, ${colour} ${dark ? 35 : 70}%, ${dark ? 'white' : 'black'})`,
    'ui-ring': colour,
    'ui-ring-soft': `color-mix(in srgb, ${colour} 25%, transparent)`,
  })

  const style = $derived(Object.entries({ ...accentTokens(accent, colorScheme.dark), 'ui-radius': radius, 'ui-font': font, 'ui-icon-stroke': stroke })
    .map(([name, value]) => `--${name}: ${value}`).join('; '))

  const snippet = $derived.by(() => {
    const block = (dark) => {
      const all = accentTokens(accent, dark)
      if (!dark) {
        all['ui-radius'] = radius
        if (font !== 'inherit') all['ui-font'] = font
        if (stroke !== '2') all['ui-icon-stroke'] = stroke
      }
      return Object.entries(all).map(([name, value]) => `  --${name}: ${value};`).join('\n')
    }
    return `:root {\n${block(false)}\n}\n\n:root.dark {\n${block(true)}\n}`
  })

  const code = 'rounded bg-(--ui-hover) px-1 text-xs'
  const pre = 'm-0 overflow-x-auto rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-4 text-xs leading-relaxed'
</script>

<h1 class="m-0 text-xl font-bold">Theming</h1>
<p class="mt-1 mb-0 text-sm text-(--ui-muted)">
  Ways to change how the components look, from the broadest to the narrowest. Start with tokens
  (the <code class={code}>--ui-*</code> variables; <a href="#/tokens" class="text-(--ui-accent)">Tokens</a> lists
  them all): they reach every component at once. Reach for a component's parts only for what tokens don't
  cover. All the library's CSS sits in <code class={code}>@layer ui</code>, so your CSS and Tailwind's utilities beat
  it without <code class={code}>!important</code>. Each component page's Styling panel lists the tokens, variables
  and parts it uses.
</p>

<section class="flex flex-col gap-3 py-5">
  <h2 class="m-0 text-base font-semibold">The whole app</h2>
  <p class="m-0 text-sm text-(--ui-muted)">Pick an accent, radius, font and icon weight: the box shows them, and the CSS below sets them for the whole app, with deeper tints for dark mode. Paste it into your app's CSS. (For a scale of shades from one colour, and the sidebar styles, see Appearance.)</p>
  <div class="flex flex-wrap items-end gap-4">
    <label class="flex flex-col gap-1.5 text-sm font-medium">Accent
      <input type="color" bind:value={accent} class="h-9 w-16 cursor-pointer rounded-(--ui-radius) border border-(--ui-border) bg-(--ui-surface) p-1" /></label>
    <Field label="Radius"><Segmented items={radii} bind:value={radius} /></Field>
    <Field label="Font"><Segmented items={fonts} bind:value={font} /></Field>
    <Field label="Icons"><Segmented items={strokes} bind:value={stroke} /></Field>
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
  <div class="relative">
    <pre class={pre}><code>{snippet}</code></pre>
    <CopyButton value={snippet} class="absolute top-2 right-2" />
  </div>
</section>

{#each examplesOf('theming') as example (example.path)}<Demo {example} />{/each}

<section class="flex flex-col gap-3 py-5">
  <h2 class="m-0 text-base font-semibold">Which wins</h2>
  <div class="overflow-x-auto rounded-lg border border-(--ui-border) bg-(--ui-surface)">
    <table class="w-full border-collapse text-left text-sm">
      <thead class="text-xs text-(--ui-muted)"><tr><th class="px-3 py-2 font-medium">Where</th><th class="px-3 py-2 font-medium">How</th><th class="px-3 py-2 font-medium">Reaches</th></tr></thead>
      <tbody>
        {#each wins as [where, how, reaches] (where)}
          <tr class="border-t border-(--ui-border)"><td class="px-3 py-2">{where}</td><td class="px-3 py-2"><code class="text-xs">{how}</code></td>
            <td class="px-3 py-2 text-(--ui-muted)">{reaches}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
