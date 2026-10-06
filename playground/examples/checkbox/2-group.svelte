<!-- A group
  CheckboxGroup binds the array of checked values. -->
<script>
  import { CheckboxGroup } from '@milktop/svelte-ui'

  let subjects = $state(['Maths'])
</script>

<CheckboxGroup label="Subjects" items={['Maths', 'Physics', 'Chemistry']} bind:value={subjects} />
<CheckboxGroup label="Days" orientation="horizontal" items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']} value={['Tue', 'Thu']} />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify(subjects)}</p>
