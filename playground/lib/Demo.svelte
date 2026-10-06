<!-- One example: its title and description, the example itself, and its source behind a Code toggle. -->
<script>
  import { Button, Card } from '@milktop/svelte-ui'

  let { example } = $props()
  let showCode = $state(false)

  // `backticked` words in the description show as code.
  const pieces = $derived(example.description.split('`').map((text, i) => ({ text, code: i % 2 === 1 })))
</script>

<Card heading={example.title} classes={{ body: 'flex flex-col gap-4' }}>
  {#snippet actions()}
    <Button size="sm" variant="ghost" icon="lucide:code" aria-pressed={showCode} onclick={() => (showCode = !showCode)}>Code</Button>
  {/snippet}

  {#if example.description}
    <p class="-mt-3 mb-0 text-(--ui-muted)">
      {#each pieces as piece}{#if piece.code}<code class="rounded bg-(--ui-hover) px-1 text-xs text-(--ui-text)">{piece.text}</code>{:else}{piece.text}{/if}{/each}
    </p>
  {/if}
  <div class="flex flex-wrap items-start gap-3">
    <example.component />
  </div>
  {#if showCode}
    <pre class="m-0 overflow-x-auto rounded-md bg-(--ui-hover) p-4 text-xs leading-relaxed [tab-size:2]"><code>{example.code}</code></pre>
  {/if}
</Card>
