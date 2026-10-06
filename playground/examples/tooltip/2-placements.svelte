<!-- Placements -->
<script>
  import { Tooltip, Button } from '@milktop/svelte-ui'
</script>

<div class="flex flex-wrap gap-x-12 gap-y-2">
  {#each ['top', 'right', 'bottom', 'left'] as placement}
    <Tooltip content={placement} {placement}>
      {#snippet trigger(props)}<Button {...props} class="capitalize">{placement}</Button>{/snippet}
    </Tooltip>
  {/each}
</div>
