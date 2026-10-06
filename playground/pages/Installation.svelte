<!-- Installation: install, set up the CSS layers, import and use, style. -->
<script>
  import { Badge } from '@milktop/svelte-ui'
  import pkg from '../../package.json'

  let { repo } = $props()

  const version = `v${pkg.version}`

  const install = `npm install github:milktop/svelte-ui#${version}
# or, while developing locally
npm install file:../../svelte/ui`

  const css = `/* app.css: the library's layer sits below Tailwind's utilities */
@layer theme, base, ui, components, utilities;
@import "tailwindcss";`

  const usage = `<script>
  import { DatePicker, Select } from '@milktop/svelte-ui'
<\/script>

<DatePicker label="Lesson date" bind:value={lesson.date} />
<Select label="Subject" items={subjects} labelKey="name" valueKey="id" searchable bind:value={subjectId} />`

  const style = `<!-- the root: class; a part: classes; a token: style; a part's markup: a snippet -->
<DatePicker
  class="w-64"
  classes={{ cell: 'rounded-full', viewTrigger: 'font-bold' }}
  style="--ui-accent: var(--brand)"
/>`

  const sections = [
    { heading: 'Install', text: 'The package ships Svelte source rather than a build, so your app compiles it. Zag, TipTap, d3 and iconify-icon come with it.', code: install },
    { heading: 'Set up the CSS layers', text: "All the library's CSS sits in @layer ui. With Tailwind, declare the order first, so its reset stays below the library and its utilities above it.", code: css },
    { heading: 'Import and use', text: 'One namespace: import what you use. Values are two-way with bind:value (or bind:checked, bind:open); they are plain values: ISO dates, and the items\' own values. Each component imports its own CSS.', code: usage },
    { heading: 'Style', text: 'Every component takes class (its root) and classes (its parts, by camelCased part name), and the --ui-* tokens restyle it. Parts are marked data-scope and data-part, so your CSS can target them too; snippets replace the markup of the parts people swap out.', code: style },
    { heading: 'Upgrade', text: 'Install the newer tag. Until 1.0, a minor version may change props or markup; patch versions only fix things.' },
  ]
</script>

<h1 class="m-0 text-xl font-bold">Installation</h1>
<p class="mt-1 mb-0 text-sm text-(--ui-muted)">Add the package to a Svelte 5 app built with Vite, import the components, and use them.</p>
<div class="mt-3 flex flex-wrap gap-2">
  <a href={repo} target="_blank" rel="noopener"><Badge variant="outline">GitHub</Badge></a>
  <a href="{repo}/tags" target="_blank" rel="noopener"><Badge variant="outline">Latest: {version}</Badge></a>
</div>

{#each sections as section}
  <section class="flex flex-col gap-3 py-5">
    <h2 class="m-0 text-base font-semibold">{section.heading}</h2>
    <p class="m-0 text-sm leading-relaxed">{section.text}</p>
    {#if section.code}
      <pre class="m-0 overflow-x-auto rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-4 text-xs leading-relaxed"><code>{section.code}</code></pre>
    {/if}
  </section>
{/each}
