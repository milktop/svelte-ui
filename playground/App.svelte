<script>
  import { AppShell, Sidebar, NavSection, NavGroup, NavItem, Topbar, Breadcrumbs, Page } from '@milktop/svelte-ui'
  import Demo from './lib/Demo.svelte'
  import ApiPanel from './lib/ApiPanel.svelte'
  import ThemeSwitch from './lib/ThemeSwitch.svelte'
  import AppearancePanel from './lib/AppearancePanel.svelte'
  import { appearance, applyAppearance } from './lib/appearance.svelte.js'
  import { groups, pages, examplesOf, sourceOf } from './registry.js'
  import { apiOf } from './lib/api.js'

  $effect(() => applyAppearance())

  let hash = $state(location.hash)
  let showApi = $state(false)

  const page = $derived(pages.find((p) => hash === `#/${p.slug}`))
  const intro = $derived(page ? apiOf(page.files[0], sourceOf(page.files[0])).summary : '')
  const trail = $derived(page
    ? [{ label: 'Svelte UI', href: '#/' }, { label: page.group.heading }, { label: page.title }]
    : [{ label: 'Svelte UI', href: '#/' }, { label: 'Overview' }])
</script>

<svelte:window onhashchange={() => { hash = location.hash; showApi = false; scrollTo(0, 0) }} />

<AppShell inset={appearance.layout === 'inset'} persist="svelte-ui:sidebar">
  <Sidebar accordion>
    {#snippet logoCollapsed()}
      <a href="#/" aria-label="Svelte UI" class="inline-flex h-7 w-7 items-center justify-center rounded-[var(--ui-radius)] bg-(--ui-accent) text-xs font-bold text-(--ui-accent-text) no-underline">UI</a>
    {/snippet}
    {#snippet logo()}
      <a href="#/" class="flex items-center gap-2 text-(--ui-text) no-underline">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-[var(--ui-radius)] bg-(--ui-accent) text-xs font-bold text-(--ui-accent-text)">UI</span>
        Svelte UI
      </a>
    {/snippet}

    <NavSection>
      <NavItem icon="lucide:house" href="#/" active={!page}>Overview</NavItem>
    </NavSection>
    <NavSection heading="Components">
      {#each groups as group}
        <NavGroup label={group.heading} icon={group.icon} open={group.pages.some((p) => hash === `#/${p.slug}`)}>
          {#each group.pages as p}
            <NavItem href="#/{p.slug}" active={hash === `#/${p.slug}`}>{p.title}</NavItem>
          {/each}
        </NavGroup>
      {/each}
    </NavSection>
  </Sidebar>

  <Topbar>
    <Breadcrumbs items={trail} />
    {#snippet end()}<ThemeSwitch /><AppearancePanel />{/snippet}
  </Topbar>

  <Page width={appearance.width} align={appearance.align}>
    {#if page}
      {#key page}
        <div class="flex items-center justify-between gap-4">
          <h1 class="m-0 text-xl font-bold">{page.title}</h1>
          <button type="button" aria-pressed={showApi} onclick={() => (showApi = !showApi)}
            class="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-transparent bg-transparent px-2 text-xs text-(--ui-muted) hover:bg-(--ui-hover) hover:text-(--ui-text) aria-pressed:border-(--ui-border) aria-pressed:bg-(--ui-surface) aria-pressed:text-(--ui-text)">
            <iconify-icon icon="lucide:list-tree"></iconify-icon>Props
          </button>
        </div>
        <p class="mt-1 mb-0 text-sm text-(--ui-muted)">{intro}</p>
        {#if showApi}
          <div class="mt-5 flex flex-col gap-4">
            {#each page.files as file}<ApiPanel {file} />{/each}
          </div>
        {/if}
        {#each examplesOf(page.slug) as example (example.path)}
          <Demo {example} />
        {/each}
      {/key}
    {:else}
      <h1 class="m-0 text-xl font-bold">Svelte UI</h1>
      <p class="mt-1 mb-0 text-sm text-(--ui-muted)">Svelte 5 components on Zag state machines, with imba-ui's API and design.</p>

      <h2 class="mt-8 mb-3 text-xs font-semibold tracking-wider text-(--ui-muted) uppercase">Every component works the same way</h2>
      <ul class="m-0 flex list-none flex-col gap-2 rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-5 text-sm shadow-(--ui-card-shadow)">
        <li><code class="text-xs">import {'{'} Button, DatePicker {'}'} from '@milktop/svelte-ui'</code>: one package, one namespace.</li>
        <li><code class="text-xs">bind:value</code> on every input-like component.</li>
        <li><code class="text-xs">class</code>: classes for the outer element. Utilities always win: the library's CSS sits in <code class="text-xs">@layer ui</code>.</li>
        <li><code class="text-xs">classes</code>: classes per part, e.g. <code class="text-xs">classes={'{{'} prev: 'rounded-full' {'}}'}</code>. Each page's Props lists the parts.</li>
        <li>Snippets replace a part, e.g. a date picker's <code class="text-xs">prev</code>, and get its props.</li>
        <li><code class="text-xs">style="--ui-accent: …"</code>: tokens for one instance; on <code class="text-xs">:root</code> for the whole app.</li>
      </ul>

      {#each groups as group}
        <h2 class="mt-8 mb-3 text-xs font-semibold tracking-wider text-(--ui-muted) uppercase">{group.heading}</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each group.pages as p}
            <a href="#/{p.slug}" class="block rounded-lg border border-(--ui-border) bg-(--ui-surface) p-3 text-inherit no-underline shadow-(--ui-card-shadow) hover:border-(--ui-muted)">
              <strong class="block text-sm font-semibold">{p.title}</strong>
              <span class="mt-0.5 block text-xs text-(--ui-muted)">{p.about}</span>
            </a>
          {/each}
        </div>
      {/each}
    {/if}
  </Page>
</AppShell>
