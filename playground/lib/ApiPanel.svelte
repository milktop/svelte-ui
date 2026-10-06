<!-- A component's API, read from its source (see api.js): props, snippets and parts. -->
<script>
  import { Card } from '@milktop/svelte-ui'
  import { apiOf } from './api.js'
  import { sourceOf } from '../registry.js'

  let { file } = $props()
  const api = $derived(apiOf(file, sourceOf(file)))

  // `backticked` words in notes show as code.
  const pieces = (text) => text.split('`').map((text, i) => ({ text, code: i % 2 === 1 }))
</script>

<Card heading="<{api.tag}>" description={api.summary} classes={{ heading: 'font-mono', body: 'flex flex-col gap-4' }}>
  {#if api.usage}
    <pre class="m-0 overflow-x-auto rounded-md bg-(--ui-hover) p-4 text-xs leading-relaxed [tab-size:2]"><code>{api.usage}</code></pre>
  {/if}

  <table class="w-full border-collapse text-left text-sm">
    <thead class="text-xs text-(--ui-muted)">
      <tr><th class="py-2 pr-4 font-medium">Prop</th><th class="py-2 pr-4 font-medium">Default</th><th class="py-2 font-medium">Notes</th></tr>
    </thead>
    <tbody>
      {#each api.props as prop}
        <tr class="border-t border-(--ui-border) align-top">
          <td class="py-2 pr-4 font-mono text-xs whitespace-nowrap">
            {prop.name}{#if prop.bindable}<span class="ml-1.5 rounded bg-(--ui-accent-soft) px-1 text-(--ui-accent-soft-text)">bind</span>{/if}
          </td>
          <td class="py-2 pr-4 font-mono text-xs text-(--ui-muted) whitespace-nowrap">{prop.default}</td>
          <td class="py-2 text-(--ui-muted)">
            {#each pieces(prop.note) as piece}{#if piece.code}<code class="rounded bg-(--ui-hover) px-1 text-xs text-(--ui-text)">{piece.text}</code>{:else}{piece.text}{/if}{/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#each [['Snippets', api.snippets], ['Parts (keys for classes)', api.parts]] as [label, names]}
    {#if names.length}
      <div class="flex flex-wrap items-center gap-1.5 text-xs text-(--ui-muted)">
        <span>{label}:</span>
        {#each names as name}<code class="rounded bg-(--ui-hover) px-1.5 py-0.5 text-(--ui-text)">{name}</code>{/each}
      </div>
    {/if}
  {/each}
</Card>
