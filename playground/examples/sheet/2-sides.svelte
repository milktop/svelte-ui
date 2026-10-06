<!-- Sides -->
<script>
  import { Sheet, Button } from '@milktop/svelte-ui'

  let open = $state(false)
  let side = $state('left')
</script>

{#each ['left', 'right', 'top', 'bottom'] as value}
  <Button class="capitalize" onclick={() => { side = value; open = true }}>{value}</Button>
{/each}
<Sheet {side} size={side === 'left' ? 'sm' : 'md'} heading="From the {side}" bind:open>
  <p class="m-0 text-(--ui-muted)">Left and right sheets are full height; top and bottom ones fit their content. `size` sets the width (or height): sm, md or lg.</p>
</Sheet>
