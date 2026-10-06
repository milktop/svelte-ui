<!-- Own trigger
  A `trigger` snippet: spread its props onto your button. -->
<script>
  import { Collapsible, Button } from '@milktop/svelte-ui'

  let more = $state(false)
</script>

<div class="w-full">
  <p class="mt-0">Ada has taught maths for twelve years and specialises in GCSE preparation.</p>
  <Collapsible bind:open={more}>
    {#snippet trigger(props)}
      <Button {...props} variant="link" iconEnd={more ? 'lucide:chevron-up' : 'lucide:chevron-down'}>{more ? 'Show less' : 'Show more'}</Button>
    {/snippet}
    She studied mathematics at Cambridge and has helped over 200 students improve by at least two grades.
  </Collapsible>
</div>
<p class="m-0 flex w-full items-center gap-3 text-sm text-(--ui-muted)">more: {more}
  <Button size="sm" onclick={() => (more = !more)}>Toggle from outside</Button></p>
