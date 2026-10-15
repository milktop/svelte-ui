<!-- Colours
  `color`: a named tint ('yellow', 'green'…), deeper in dark mode, or any CSS colour as it is. The default is the accent's tint, the `--ui-highlight` token. -->
<script>
  import { Highlight } from '@milktop/svelte-ui'

  const text = 'Rex had his booster vaccine and a dental check today.'
  const colours = ['accent', 'yellow', 'amber', 'orange', 'red', 'green', 'teal', 'blue', 'purple', 'pink', 'gray', '#a5f3fc']
</script>

<div class="flex flex-col gap-1.5 text-sm">
  {#each colours as color}
    <span><code class="inline-block w-20 text-xs text-(--ui-muted)">{color}</code> <Highlight {text} query={['vaccine', 'dental']} {color} /></span>
  {/each}
</div>
