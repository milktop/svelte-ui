<!-- Announcement
  A slim announcement across the top of the content. -->
<script>
  import { Banner, Button } from '@milktop/svelte-ui'

  let open = $state(true)
</script>

<Banner icon="lucide:sparkles" dismissible bind:open>Lesson notes can now be shared with parents. <a href="#/blocks/banners">See how</a></Banner>
{#if !open}<Button size="sm" variant="ghost" onclick={() => (open = true)}>Show the banner again</Button>{/if}
