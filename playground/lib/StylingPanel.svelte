<!-- A component's Styling panel (see styling.js): the tokens it uses (linking
     to Tokens), its own variables, its parts and their states, and starter code. -->
<script>
  import { Card } from '@milktop/svelte-ui'
  import { stylingOf } from './styling.js'
  import { isColour } from './tokens.js'

  let { file } = $props()
  const s = $derived(stylingOf(file))

  const chip = 'inline-flex items-center gap-1.5 rounded bg-(--ui-hover) px-1.5 py-0.5 font-mono text-xs text-(--ui-text) no-underline'
  const heading = 'm-0 mb-1.5 text-xs font-semibold tracking-wide text-(--ui-muted) uppercase'
  const hint = 'm-0 mb-2 text-xs text-(--ui-muted)'
</script>

<Card heading="<{s.tag}>" classes={{ heading: 'font-mono' }}>
  <div class="flex flex-col gap-5">
    {#if s.tokens.length}
      <div>
        <h4 class={heading}>Tokens it uses</h4>
        <p class={hint}>Set these on the app, a wrapper or the component itself (in <code>style</code>); they reach every part that uses them.</p>
        <div class="flex flex-wrap gap-1.5">
          {#each s.tokens as name}
            <a href="#/tokens?q={name}" class="{chip} hover:bg-(--ui-border)">
              {#if isColour(name)}<span class="inline-block h-2.5 w-2.5 rounded-[2px] border border-(--ui-border)" style:background="var(--{name})"></span>{/if}
              --{name}
            </a>
          {/each}
        </div>
      </div>
    {/if}
    {#if s.own.length}
      <div>
        <h4 class={heading}>Its own variables</h4>
        <p class={hint}>For what no shared token covers; set them like tokens.</p>
        <div class="flex flex-wrap gap-1.5">{#each s.own as name}<span class={chip}>--{name}</span>{/each}</div>
      </div>
    {/if}
    {#if s.parts.length}
      <div>
        <h4 class={heading}>Parts</h4>
        <p class={hint}>
          The key for <code>classes</code> (one instance), and the selector for your CSS (every instance). The states are what
          its styles are keyed on; restate the ones you change. Zag's parts carry its state attributes (<code>[data-state=open]</code>).
        </p>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead class="text-xs text-(--ui-muted)"><tr><th class="py-1.5 pr-3 font-medium">Key</th><th class="py-1.5 pr-3 font-medium">Selector</th><th class="py-1.5 pr-3 font-medium">States</th><th></th></tr></thead>
            <tbody>
              {#each s.parts as p (p.name)}
                <tr class="border-t border-(--ui-border)">
                  <td class="py-1.5 pr-3"><code class="text-xs">{p.key}</code></td>
                  <td class="py-1.5 pr-3 whitespace-nowrap"><code class="text-xs">{p.selector}</code></td>
                  <td class="py-1.5 pr-3 font-mono text-xs text-(--ui-muted)">{p.states.join('  ') || '—'}</td>
                  <td class="py-1.5">{#if p.zag}<span title="A Zag part: carries Zag's data-part and state attributes"
                    class="inline-block rounded bg-(--ui-accent-soft) px-1.5 text-[11px] font-medium text-(--ui-accent-soft-text)">Zag</span>{/if}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
    {#if s.snippets.length}
      <div>
        <h4 class={heading}>Starter code</h4>
        <div class="flex flex-col gap-3">
          {#each s.snippets as snip (snip.title)}
            <div class="flex min-w-0 flex-col gap-1.5">
              <span class="text-xs text-(--ui-muted)">{snip.title}</span>
              <pre class="m-0 overflow-x-auto rounded-md bg-(--ui-hover) p-3 text-xs leading-relaxed [tab-size:2]"><code>{snip.code}</code></pre>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</Card>
