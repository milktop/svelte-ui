<!-- One example, as in imba-ui's playground: its title and Code toggle on the
     canvas, the example in a white preview card below. -->
<script>
  import 'iconify-icon'

  let { example } = $props()
  let showCode = $state(false)

  // `backticked` words in the description show as code.
  const pieces = $derived(example.description.split('`').map((text, i) => ({ text, code: i % 2 === 1 })))
</script>

<section class="flex flex-col gap-3 py-5">
  <header class="flex items-center justify-between gap-4">
    <h2 class="m-0 text-base font-semibold">{example.title}</h2>
    <button type="button" aria-pressed={showCode} onclick={() => (showCode = !showCode)}
      class="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-transparent bg-transparent px-2 text-xs text-(--ui-muted) hover:bg-(--ui-hover) hover:text-(--ui-text) aria-pressed:border-(--ui-border) aria-pressed:text-(--ui-text)">
      <iconify-icon icon="lucide:code"></iconify-icon>Code
    </button>
  </header>
  {#if example.description}
    <p class="-mt-1 mb-0 text-sm text-(--ui-muted)">
      {#each pieces as piece}{#if piece.code}<code class="rounded bg-(--ui-hover) px-1 text-xs text-(--ui-text)">{piece.text}</code>{:else}{piece.text}{/if}{/each}
    </p>
  {/if}
  {#if showCode}
    <pre class="m-0 overflow-x-auto rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-4 text-xs leading-relaxed [tab-size:2]"><code>{example.code}</code></pre>
  {/if}
  <div class="box-border flex w-full flex-wrap items-start gap-3 rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-5 shadow-(--ui-card-shadow) md:p-6">
    <example.component />
  </div>
</section>
