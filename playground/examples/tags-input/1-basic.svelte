<!-- Tags
  Enter or a comma adds one, Backspace removes the last, a double-click edits; pasting "a, b, c" adds three. `variant` sets their look. -->
<script>
  import { TagsInput } from '@milktop/svelte-ui'

  let topics = $state(['Algebra', 'Geometry'])
</script>

<TagsInput label="Topics" bind:value={topics} />
<TagsInput label="Accent" variant="accent" value={['Physics', 'Chemistry']} />
<p>{JSON.stringify(topics)}</p>
