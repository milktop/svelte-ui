<!-- The appearance panel: a popover of settings that override the library's
     tokens, as in imba-ui's playground. -->
<script>
  import { Popover, Button, Fields, Field, Segmented, Select, colorScheme } from '@milktop/svelte-ui'
  import { appearance, reset, isDark, accents, fonts, radii, densities, layouts, canvases, sidebars, widths, aligns, options } from './appearance.svelte.js'

  const themes = [
    { value: 'light', label: 'Light', icon: 'lucide:sun' },
    { value: 'dark', label: 'Dark', icon: 'lucide:moon' },
    { value: 'system', label: 'System', icon: 'lucide:monitor' },
  ]
</script>

<Popover heading="Appearance" description="Overrides the --ui-* tokens on <html>." closable placement="bottom-end"
  class="w-[min(40rem,calc(100vw-32px))] max-h-[calc(100vh-80px)] overflow-y-auto">
  {#snippet trigger(props)}<Button {...props} size="sm" variant="ghost" icon="lucide:palette" aria-label="Appearance" />{/snippet}

  <Fields classes={{ grid: 'grid-cols-1 sm:grid-cols-2 gap-x-6 [&>*]:col-auto' }}>
    <Field label="Theme"><Segmented size="sm" items={themes} bind:value={() => colorScheme.value, (v) => (colorScheme.value = v)} /></Field>
    <Field label="Accent">
      <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Accent">
        {#each Object.entries(accents) as [key, accent]}
          <button type="button" role="radio" aria-checked={appearance.accent === key} aria-label={accent.name}
            style="background: {accent[isDark() ? 'dark' : 'light'][0]}" onclick={() => (appearance.accent = key)}
            class="size-7 cursor-pointer rounded-full border-2 border-(--ui-surface) p-0 outline outline-1 outline-(--ui-border) hover:outline-(--ui-muted) aria-checked:outline-2 aria-checked:outline-(--ui-text)"></button>
        {/each}
      </div>
    </Field>
    <Field label="Font"><Select size="sm" items={options(fonts)} bind:value={appearance.font} /></Field>
    <Field label="Radius"><Segmented size="sm" items={options(radii)} bind:value={appearance.radius} /></Field>
    <Field label="Layout" hint="AppShell's inset option"><Segmented size="sm" items={options(layouts)} bind:value={appearance.layout} /></Field>
    <Field label="Background" hint="--ui-canvas, in light mode"><Segmented size="sm" items={options(canvases)} bind:value={appearance.canvas} /></Field>
    <Field label="Sidebar" hint="--ui-sidebar-bg (inset layout)"><Segmented size="sm" items={options(sidebars)} bind:value={appearance.sidebar} /></Field>
    <Field label="Width" hint="Page's width"><Segmented size="sm" items={options(widths)} bind:value={appearance.width} /></Field>
    <Field label="Page" hint="Page's align"><Segmented size="sm" items={options(aligns)} bind:value={appearance.align} /></Field>
    <Field label="Density" hint="Sets --ui-control-height"><Segmented size="sm" items={options(densities)} bind:value={appearance.density} /></Field>
  </Fields>
  <div class="mt-4 flex justify-end"><Button variant="link" size="sm" onclick={reset}>Reset</Button></div>
</Popover>
