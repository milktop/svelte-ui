<!-- Filters, without a header -->
<script>
  import { Sheet, Button, CheckboxGroup } from '@milktop/svelte-ui'

  let open = $state(false)
  let subjects = $state(['maths'])
</script>

<Sheet side="right" size="sm" bind:open>
  {#snippet trigger(props)}<Button {...props} icon="lucide:sliders-horizontal">Filters</Button>{/snippet}
  <CheckboxGroup label="Subjects" items={[{ value: 'maths', label: 'Maths' }, { value: 'english', label: 'English' }, { value: 'science', label: 'Science' }]}
    bind:value={subjects} />
  {#snippet footer()}<Button variant="primary" onclick={() => (open = false)}>Show results</Button>{/snippet}
</Sheet>
<p class="m-0 w-full text-sm text-(--ui-muted)">subjects: {JSON.stringify(subjects)}</p>
