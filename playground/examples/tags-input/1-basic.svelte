<!-- Tags
  Enter or a comma adds one, Backspace removes the last, a double-click edits; pasting "a, b, c" adds three. `variant` sets their look. -->
<script>
  import { Fields, Field, TagsInput } from '@milktop/svelte-ui'

  let topics = $state(['Algebra', 'Geometry'])
</script>

<Fields class="w-full">
  <Field label="Topics" span={6} hint={JSON.stringify(topics)}><TagsInput bind:value={topics} /></Field>
  <Field label="Accent" span={6}><TagsInput variant="accent" value={['Physics', 'Chemistry']} /></Field>
</Fields>
