<!-- Pick several
  `multiple` shows the picks as tags; the bound value is an array. -->
<script>
  import { Combobox } from '@milktop/svelte-ui'

  const subjects = ['Biology', 'Chemistry', 'English', 'French', 'Geography', 'History', 'Maths', 'Physics']

  let picked = $state(['Maths'])
</script>

<Combobox label="Subjects" items={subjects} multiple variant="accent" bind:value={picked} placeholder="Add a subject…" class="w-full max-w-md" />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify(picked)}</p>
