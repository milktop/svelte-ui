<!-- Tags
  Enter or a comma adds one, Backspace removes the last, a double-click edits. `variant` sets their look. -->
<script>
  import { TagsInput } from '@milktop/svelte-ui'

  let topics = $state(['Algebra', 'Geometry'])
</script>

<TagsInput label="Topics" bind:value={topics} class="w-full max-w-md" />
<TagsInput label="Accent" variant="accent" value={['Physics', 'Chemistry']} class="w-full max-w-md" />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify(topics)}</p>
