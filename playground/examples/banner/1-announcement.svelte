<!-- Announcement
  `dismissible` sets `open` (bindable) to false. -->
<script>
  import { Banner, Button } from '@milktop/svelte-ui'

  let open = $state(true)
</script>

<Banner icon="lucide:sparkles" dismissible bind:open>
  Lesson notes can now be shared with parents. <a href="#/banner">See how</a>
</Banner>
{#if !open}<Button size="sm" onclick={() => (open = true)}>Show it again</Button>{/if}
