<script>
  import { Button, Card, Page, Sidebar, NavSection, NavItem } from '@milktop/svelte-ui'
  import Demo from './lib/Demo.svelte'
  import ApiPanel from './lib/ApiPanel.svelte'
  import { groups, pages, examplesOf, sourceOf } from './registry.js'
  import { apiOf } from './lib/api.js'

  let hash = $state(location.hash)
  let dark = $state(matchMedia('(prefers-color-scheme: dark)').matches)

  $effect(() => { document.documentElement.classList.toggle('dark', dark) })

  const page = $derived(pages.find((p) => hash === `#/${p.slug}`))
  const summary = $derived(page ? apiOf(page.files[0], sourceOf(page.files[0])).summary : '')
</script>

<svelte:window onhashchange={() => { hash = location.hash; scrollTo(0, 0) }} />

<div class="flex min-h-dvh">
  <Sidebar style="--ui-sidebar-active: var(--ui-accent-soft); --ui-sidebar-active-text: var(--ui-accent-soft-text)">
    {#snippet logo()}<a href="#/" class="text-(--ui-text) no-underline">Svelte UI</a>{/snippet}

    <NavSection>
      <NavItem icon="lucide:house" href="#/" active={!page}>Overview</NavItem>
    </NavSection>
    {#each groups as group}
      <NavSection heading={group.heading}>
        {#each group.pages as p}
          <NavItem icon={p.icon} href="#/{p.slug}" active={page === p}>{p.title}</NavItem>
        {/each}
      </NavSection>
    {/each}

    {#snippet footer()}
      <Button block variant="ghost" icon={dark ? 'lucide:sun' : 'lucide:moon'} onclick={() => (dark = !dark)}>
        {dark ? 'Light' : 'Dark'} mode
      </Button>
    {/snippet}
  </Sidebar>

  <main class="flex-1 min-w-0">
    {#if page}
      {#key page}
        <Page heading={page.title} description={summary} width="wide" align="start">
          <div class="flex flex-col gap-5">
            {#each examplesOf(page.slug) as example (example.path)}
              <Demo {example} />
            {/each}
            {#each page.files as file}
              <ApiPanel {file} />
            {/each}
          </div>
        </Page>
      {/key}
    {:else}
      <Page heading="Svelte UI" description="Svelte 5 components on Zag state machines, with imba-ui's API and design." width="wide" align="start">
        <div class="flex flex-col gap-5">
          <Card heading="Every component works the same way">
            <ul class="m-0 flex list-none flex-col gap-3 p-0">
              <li><code>import {'{'} Button, DatePicker {'}'} from '@milktop/svelte-ui'</code>: one package, one namespace.</li>
              <li><code>bind:value</code> on every input-like component.</li>
              <li><code>class</code>: classes for the outer element, joined with the component's own. Utilities always win: the library's CSS sits in <code>@layer ui</code>.</li>
              <li><code>classes</code>: classes per part, by camelCased part name, e.g. <code>classes={'{{'} prev: 'rounded-full' {'}}'}</code>. Each page lists the parts.</li>
              <li>Snippets replace a part, e.g. a date picker's <code>prev</code>, and get its props.</li>
              <li><code>style="--ui-accent: …"</code>: tokens for one instance; set them on <code>:root</code> for the whole app.</li>
            </ul>
          </Card>
          <Card heading="Components">
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {#each pages as p}
                <a href="#/{p.slug}" class="flex items-center gap-2 rounded-md p-2 text-(--ui-text) no-underline hover:bg-(--ui-hover)">
                  <iconify-icon icon={p.icon} class="text-(--ui-muted)"></iconify-icon>{p.title}
                </a>
              {/each}
            </div>
          </Card>
        </div>
      </Page>
    {/if}
  </main>
</div>
