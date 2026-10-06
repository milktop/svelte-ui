<!-- Toolbar
  A `trigger` snippet: spread its props onto your button, which keeps its own label and clicks. -->
<script>
  import { Tooltip, Button } from '@milktop/svelte-ui'

  const tools = [['Bold', 'lucide:bold'], ['Italic', 'lucide:italic'], ['Underline', 'lucide:underline'],
    ['Insert link', 'lucide:link'], ['Clear formatting', 'lucide:remove-formatting']]
</script>

<div class="inline-flex gap-0.5 rounded-(--ui-radius) border border-(--ui-border) p-1">
  {#each tools as [label, icon]}
    <Tooltip content={label}>
      {#snippet trigger(props)}<Button {...props} variant="ghost" {icon} aria-label={label} />{/snippet}
    </Tooltip>
  {/each}
</div>
