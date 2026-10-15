<!-- Tokens: every --ui-* token by group, with what it styles and its light
     and dark values, searchable. A Styling panel's links open it filtered
     (#/tokens?q=ui-accent). -->
<script>
  import { Input } from '@milktop/svelte-ui'
  import { groupedTokens, isColour } from '../lib/tokens.js'

  let { query: linked = '' } = $props()
  let query = $state('')
  // Each link followed opens it filtered afresh.
  $effect.pre(() => { query = linked })

  const code = 'rounded bg-(--ui-hover) px-1 text-xs'
  const q = $derived(query.trim().toLowerCase())
  const shown = $derived(groupedTokens.map((group) => ({
    ...group, tokens: q ? group.tokens.filter((token) => token.name.includes(q) || group.title.toLowerCase().includes(q)) : group.tokens,
  })).filter((group) => group.tokens.length))
</script>

<h1 class="m-0 text-xl font-bold">Tokens</h1>
<p class="mt-1 mb-0 text-sm text-(--ui-muted)">
  Every <code class={code}>--ui-*</code> token, with what it styles and its light and dark values (read
  from <code class={code}>theme.css</code>). Set them in your app's CSS on <code class={code}>:root</code> to
  brand it, or on any element to restyle what's inside it. Theming shows how.
</p>
<section class="flex flex-col gap-3 py-5">
  <h2 class="m-0 text-base font-semibold">Find a token</h2>
  <Input icon="lucide:search" placeholder="accent, sidebar, radius…" bind:value={query} class="w-64 max-w-full" />
</section>
{#each shown as group (group.title)}
  <section class="flex flex-col gap-2 py-5">
    <h2 class="m-0 text-base font-semibold">{group.title}</h2>
    {#if group.about}<p class="m-0 text-sm text-(--ui-muted)">{group.about}</p>{/if}
    <div class="overflow-x-auto rounded-lg border border-(--ui-border) bg-(--ui-surface)">
      <table class="w-full border-collapse text-left text-sm">
        <thead class="text-xs text-(--ui-muted)"><tr><th class="px-3 py-2 font-medium">Token</th><th class="px-3 py-2 font-medium">Light</th><th class="px-3 py-2 font-medium">Dark</th></tr></thead>
        <tbody>
          {#each group.tokens as token (token.name)}
            <tr class="border-t border-(--ui-border)">
              <td class="px-3 py-2 whitespace-nowrap">
                {#if isColour(token.name)}<span class="mr-2 inline-block h-5 w-5 rounded border border-(--ui-border) align-middle" style:background="var(--{token.name})"></span>{/if}
                <code class="text-xs">--{token.name}</code>
              </td>
              <td class="px-3 py-2 text-xs break-words text-(--ui-muted)"><code>{token.light}</code></td>
              <td class="px-3 py-2 text-xs break-words text-(--ui-muted)"><code>{token.dark || 'same'}</code></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
{/each}
{#if !shown.length}<p class="text-sm text-(--ui-muted)">No token matches “{query}”.</p>{/if}
