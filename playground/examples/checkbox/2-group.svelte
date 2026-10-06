<!-- A group, with select all and shift-click
  `selectAll` adds a parent that's indeterminate when only some are picked. Click one, then Shift-click another: everything between follows. -->
<script>
  import { Fields, Field, CheckboxGroup } from '@milktop/svelte-ui'

  const lessons = ['Algebra', 'Geometry', 'Statistics', 'Calculus', 'Vectors', 'Matrices', 'Probability']
  let picked = $state(['Geometry'])
  let days = $state(['Tue', 'Thu'])
</script>

<Fields class="w-full">
  <Field label="Lessons" span={6} hint="{picked.length} picked">
    <CheckboxGroup items={lessons} bind:value={picked} selectAll="All lessons" />
  </Field>
  <Field label="Days" span={6} hint={JSON.stringify(days)}>
    <CheckboxGroup orientation="horizontal" items={['Mon', 'Tue', 'Wed', 'Thu', { value: 'Fri', label: 'Fri (full)', disabled: true }]} bind:value={days} />
  </Field>
</Fields>
