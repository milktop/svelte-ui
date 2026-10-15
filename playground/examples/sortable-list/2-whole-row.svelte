<!-- Whole rows, spaced
  `handle={false}` lets the whole row be dragged (or focused and moved with the keyboard); `variant="plain"` spaces the rows apart. Strings are their own keys. -->
<script>
  import { SortableList } from '@milktop/svelte-ui'

  let subjects = $state(['Maths', 'Physics', 'English', 'Chemistry'])
</script>

<SortableList bind:items={subjects} handle={false} variant="plain" label="Subjects by priority" class="w-64" />
<p class="m-0 w-full text-sm text-(--ui-muted)">Priority: {subjects.join(', ')}</p>
