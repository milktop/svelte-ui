<!-- In a sentence -->
<script>
  import { HoverCard, Avatar, Button } from '@milktop/svelte-ui'
</script>

<p class="m-0">
  Next lesson: GCSE Maths with
  <HoverCard>
    {#snippet trigger(props)}<a {...props} href="#/hover-card" class="text-(--ui-accent) underline underline-offset-2">Ada Lovelace</a>{/snippet}
    <div class="flex gap-3">
      <Avatar name="Ada Lovelace" />
      <div>
        <div class="font-semibold">Ada Lovelace</div>
        <div class="text-xs text-(--ui-muted)">Year 11 · ada@example.com</div>
      </div>
    </div>
    <div class="mt-3 flex gap-4 text-xs text-(--ui-muted)">
      <span><b class="text-(--ui-text)">24</b> lessons</span>
      <span><b class="text-(--ui-text)">92%</b> attendance</span>
    </div>
    <div class="mt-4 flex gap-2">
      <Button size="sm">Message</Button>
      <Button size="sm" variant="primary">View profile</Button>
    </div>
  </HoverCard>, Thursday at 16:00.
</p>
