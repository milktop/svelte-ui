<script>
  import {
    AppShell, Sidebar, NavSection, NavGroup, NavItem, Topbar, Breadcrumbs, Page, Toaster, toaster, colorScheme,
    SidebarUser, Command, formatHotkey, MenuItem, Submenu, MenuRadioGroup, MenuRadio, MenuSeparator,
  } from '@milktop/svelte-ui'
  import Demo from './lib/Demo.svelte'
  import ApiPanel from './lib/ApiPanel.svelte'
  import ThemeSwitch from './lib/ThemeSwitch.svelte'
  import AppearancePanel from './lib/AppearancePanel.svelte'
  import { appearance, applyAppearance } from './lib/appearance.svelte.js'
  import { groups, pages, examplesOf, sourceOf } from './registry.js'
  import { apiOf } from './lib/api.js'
  import pkg from '../package.json'
  import Theming from './pages/Theming.svelte'
  import Installation from './pages/Installation.svelte'
  import BlockPage from './lib/BlockPage.svelte'
  import { blocks } from './blocks/registry.js'

  const guides = { '#/theming': 'Theming', '#/installation': 'Installation' }

  $effect(() => applyAppearance())

  // Where it'll live once pushed (it isn't yet).
  const repo = 'https://github.com/milktop/svelte-ui'
  let shell = $state()

  // ⌘K: every page, then a few actions.
  const commands = [
    ...pages.map((p) => ({ label: p.title, description: p.about, href: `#/${p.slug}`, icon: p.group.icon, group: p.group.heading })),
    ...blocks.map((b) => ({ label: b.title, description: b.about, href: `#/blocks/${b.slug}`, icon: b.icon, group: 'Blocks' })),
    { label: 'Theming', description: 'Tokens and overrides', href: '#/theming', icon: 'lucide:palette', group: 'Guides' },
    { label: 'Installation', description: 'Install, set up the CSS layers, import', href: '#/installation', icon: 'lucide:download', group: 'Guides' },
    { label: 'GitHub', description: 'Source, releases and issues', href: repo, icon: 'mdi:github', group: 'Guides', keywords: ['repo', 'source'] },
    { label: 'Toggle sidebar', value: 'sidebar', icon: 'lucide:panel-left', shortcut: '⌘B', group: 'Playground' },
    { label: 'Light theme', value: 'light', icon: 'lucide:sun', group: 'Playground', keywords: ['appearance', 'mode'] },
    { label: 'Dark theme', value: 'dark', icon: 'lucide:moon', group: 'Playground', keywords: ['appearance', 'mode'] },
  ]

  function run(command) {
    if (command === 'sidebar') dispatchEvent(new KeyboardEvent('keydown', { key: 'b', metaKey: true, ctrlKey: true }))
    else if (command === 'light' || command === 'dark') colorScheme.value = command
  }

  let hash = $state(location.hash)
  let showApi = $state(false)

  const page = $derived(pages.find((p) => hash === `#/${p.slug}`))
  const block = $derived(blocks.find((b) => hash === `#/blocks/${b.slug}`))
  const intro = $derived(page ? apiOf(page.files[0], sourceOf(page.files[0])).summary : '')
  const trail = $derived(page
    ? [{ label: 'Svelte UI', href: '#/' }, { label: page.group.heading }, { label: page.title }]
    : block ? [{ label: 'Svelte UI', href: '#/' }, { label: 'Blocks' }, { label: block.group }, { label: block.title }]
    : [{ label: 'Svelte UI', href: '#/' }, { label: guides[hash] ?? 'Overview' }])
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
        <!-- The version, as a quiet pill after the name. -->
        <span title="Version" class="rounded-full bg-(--ui-hover) px-1.5 py-0.5 text-[11px] leading-none font-medium text-(--ui-muted) tabular-nums">v{pkg.version}</span>
      </a>
    {/snippet}
    {#snippet footer()}
      <SidebarUser name="Ada Lovelace" description="ada@example.com" onselect={(action) => toaster.info({ title: `Picked “${action}”` })}>
        <MenuItem value="profile" icon="lucide:user">Profile</MenuItem>
        <MenuItem value="settings" icon="lucide:settings" shortcut="⌘,">Settings</MenuItem>
        <Submenu label="Theme" icon="lucide:palette">
          <MenuRadioGroup bind:value={() => colorScheme.value, (v) => (colorScheme.value = v)}>
            <MenuRadio value="light" icon="lucide:sun">Light</MenuRadio>
            <MenuRadio value="dark" icon="lucide:moon">Dark</MenuRadio>
            <MenuRadio value="system" icon="lucide:monitor">System</MenuRadio>
          </MenuRadioGroup>
        </Submenu>
        <MenuSeparator />
        <MenuItem value="logout" icon="lucide:log-out" danger>Log out</MenuItem>
      </SidebarUser>
    {/snippet}

    <NavSection>
      <NavItem icon="lucide:house" href="#/" active={!page && !block && !guides[hash]}>Overview</NavItem>
      <NavItem icon="lucide:palette" href="#/theming" active={hash === '#/theming'}>Theming</NavItem>
      <NavItem icon="lucide:download" href="#/installation" active={hash === '#/installation'}>Installation</NavItem>
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
    <NavSection heading="Blocks">
      {#each ['Sections', 'Pages'] as group}
        <NavGroup label={group} icon={group === 'Pages' ? 'lucide:app-window' : 'lucide:layout-panel-top'}
          open={blocks.some((b) => b.group === group && hash === `#/blocks/${b.slug}`)}>
          {#each blocks.filter((b) => b.group === group) as b}
            <NavItem href="#/blocks/{b.slug}" active={hash === `#/blocks/${b.slug}`}>{b.title}</NavItem>
          {/each}
        </NavGroup>
      {/each}
    </NavSection>
  </Sidebar>

  <Topbar>
    <Breadcrumbs items={trail} />
    {#snippet end()}
      <Command items={commands} onselect={run}>
        {#snippet trigger(props)}
          <button {...props} type="button" class="flex h-8 cursor-pointer items-center gap-2 rounded-(--ui-radius) border border-(--ui-border) bg-(--ui-surface) px-2.5 text-sm text-(--ui-muted) hover:border-(--ui-muted) hover:text-(--ui-text) md:w-56 md:pr-1.5">
            <iconify-icon icon="lucide:search" aria-hidden="true"></iconify-icon>
            <span class="hidden flex-1 text-left md:block">Search</span>
            <kbd class="hidden h-5 items-center rounded border border-(--ui-border) bg-(--ui-hover) px-1.5 font-[inherit] text-[11px] md:inline-flex">{formatHotkey()}</kbd>
          </button>
        {/snippet}
      </Command>
      <a href={repo} target="_blank" rel="noopener" aria-label="GitHub repository"
        class="inline-flex h-(--ui-control-height-sm) w-(--ui-control-height-sm) items-center justify-center rounded-(--ui-radius) text-lg text-(--ui-muted) hover:bg-(--ui-hover) hover:text-(--ui-text)">
        <iconify-icon icon="mdi:github" aria-hidden="true"></iconify-icon>
      </a>
      <ThemeSwitch /><AppearancePanel />
    {/snippet}
  </Topbar>

  <!-- The appearance panel's width, or by default: blocks wide, the rest default. -->
  <Page width={block && appearance.width === 'default' ? 'wide' : appearance.width} align={appearance.align}>
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
          <Demo {example} form={page.form ?? !!page.group.form} />
        {/each}
      {/key}
    {:else if block}
      {#key block}<BlockPage {block} />{/key}
    {:else if hash === '#/theming'}
      <Theming />
    {:else if hash === '#/installation'}
      <Installation {repo} />
    {:else}
      <h1 class="m-0 text-xl font-bold">Svelte UI</h1>
      <p class="mt-1 mb-0 text-sm text-(--ui-muted)">Svelte 5 components on Zag state machines, with imba-ui's API and design.</p>

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
<Toaster />
