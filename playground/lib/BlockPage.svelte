<!-- A block's page: a sections block's variants, each framed, or a page
     block alone, filling the main area as it would in an app, with a
     floating switch to its code. -->
<script>
  import { Segmented, CopyButton } from '@milktop/svelte-ui'
  import BlockFrame from './BlockFrame.svelte'

  let { block } = $props()
  let view = $state('preview')
</script>

{#if block.kind === 'sections'}
  <h1 class="m-0 text-xl font-bold">{block.title}</h1>
  <p class="mt-1 mb-6 text-sm text-(--ui-muted)">{block.about}</p>
  {#each block.examples as example (example.path)}
    <div class="mb-8">
      <BlockFrame caption={example.description || example.title} code={example.code}><example.component /></BlockFrame>
    </div>
  {/each}
{:else}
  <div hidden={view !== 'preview'}><block.page.component /></div>
  <pre class="m-0 overflow-x-auto rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-5 text-xs leading-relaxed [tab-size:2]"
    hidden={view !== 'code'}><code>{block.page.code}</code></pre>
  <div class="fixed right-4 bottom-4 z-40 flex items-center gap-1 rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-1 shadow-(--ui-shadow)">
    {#if view === 'code'}<CopyButton value={block.page.code} />{/if}
    <Segmented size="sm" items={[{ value: 'preview', label: 'Preview' }, { value: 'code', label: 'Code' }]} bind:value={view}
      aria-label="{block.title}: preview or code" />
  </div>
{/if}
