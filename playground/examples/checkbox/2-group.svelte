<!-- A group, with select all and shift-click
  `selectAll` adds a parent that's indeterminate when only some are picked. Click one, then Shift-click another: everything between follows. -->
<script>
  import { CheckboxGroup } from '@milktop/svelte-ui'

  const lessons = ['Algebra', 'Geometry', 'Statistics', 'Calculus', 'Vectors', 'Matrices', 'Probability']
  let picked = $state(['Geometry'])
  let days = $state(['Tue', 'Thu'])
</script>

<CheckboxGroup label="Lessons" items={lessons} bind:value={picked} selectAll="All lessons" />
<CheckboxGroup label="Days" orientation="horizontal" items={['Mon', 'Tue', 'Wed', 'Thu', { value: 'Fri', label: 'Fri (full)', disabled: true }]} bind:value={days} />
<p>{picked.length} lessons, {JSON.stringify(days)}</p>
